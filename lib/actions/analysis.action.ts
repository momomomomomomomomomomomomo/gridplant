'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/db/prisma';
import { UTApi } from 'uploadthing/server';
import { revalidatePath } from 'next/cache';

// Helper to convert URL to buffer and detect mime type
async function fetchImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    return {
        buffer: Buffer.from(arrayBuffer),
        mimeType: contentType.split(';')[0] // Remove charset if present
    };
}

export async function analyzePlantImage(imageUrl: string, userId: string, imageKey: string) {
    const utapi = new UTApi();
    try {
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
        // Using Gemini 2.5 Flash for better rate limits on free tier
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const { buffer: imageBuffer, mimeType } = await fetchImage(imageUrl);

        // Convert buffer to base64 for Gemini
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: mimeType,
            },
        };

        // Fetch available products from DB
        const products = await prisma.product.findMany({
            select: { name: true },
            take: 50 // Limit context size, take most relevant if possible or just random 50 for now
        });
        const productNames = products.map(p => p.name).join(', ');

        const prompt = `Analyze this image. First determine if this is a plant image.

If this is NOT a plant image, respond with exactly: {"isPlant": false}

If this IS a plant image:
1. Identify the plant name.
2. Assess its health status (Healthy, Sick, Needs Water, etc.).
3. Provide detailed care steps as a markdown formatted string with numbered steps. Example format:
   "## Watering\n1. Water once a week\n2. Check soil moisture\n\n## Sunlight\n1. Place in indirect light\n\n## Feeding\n1. Fertilize monthly"
4. From the following list of available products, select up to 3 that would be most helpful for this plant's care. ONLY select products from this list. If none are relevant, return an empty array.
Available Products: [${productNames}]

Return the response in strictly valid JSON format with keys: "isPlant" (boolean), "plantName", "status", "careSteps" (markdown formatted string with headers and numbered steps), "productSuggestions" (array of exact product strings from the provided list). Do not include markdown code block formatting like \`\`\`json.`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if Gemini adds it
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        // Check if it's not a plant
        if (data.isPlant === false) {
            await utapi.deleteFiles(imageKey);
            return { success: false, error: 'Please upload plant image' };
        }

        // Save to DB

        const analysis = await prisma.plantAnalysis.create({
            data: {
                userId,
                plantName: data.plantName || 'Unknown Plant',
                status: data.status || 'Unknown',
                careSteps: data.careSteps || 'No steps provided.',
                imageUrl: imageUrl,
                productSuggestions: data.productSuggestions || [],
            },
        });

        // We no longer delete the image on success so user can see history
        // await utapi.deleteFiles(imageKey);

        revalidatePath('/user/analysis');

        return { success: true, analysisId: analysis.id };
    } catch (error: any) {
        console.error('Analysis failed:', error);
        console.error('Error details:', error?.message || error);
        // Attempt to delete image even on error
        try { await utapi.deleteFiles(imageKey); } catch { }
        const errorMessage = error?.message?.includes('API key')
            ? 'Invalid API key. Please check your Gemini API configuration.'
            : error?.message?.includes('not found')
                ? 'Gemini model not available. Please try again.'
                : `Analysis failed: ${error?.message || 'Unknown error. Please try again.'}`;
        return { success: false, error: errorMessage };
    }
}

export async function getUserAnalyses(userId: string) {
    return await prisma.plantAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getAnalysisById(id: string) {
    return await prisma.plantAnalysis.findUnique({
        where: { id },
    });
}

export async function getAllAnalyses() {
    return await prisma.plantAnalysis.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
    });
}
