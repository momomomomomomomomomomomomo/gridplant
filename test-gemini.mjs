import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) { console.error('No API Key found'); return; }

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('--- Testing gemini-1.5-pro ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const result = await model.generateContent('Hi');
        console.log('PRO SUCCESS:', result.response.text());
    } catch (error) {
        console.error('PRO FAILED:', error.message);
    }

    console.log('--- Listing Available Models ---');
    try {
        const genModel = genAI.getGenerativeModel({ model: 'gemini-pro' }); // Dummy
        // The SDK doesn't expose listModels directly on genAI instance in all versions?
        // Actually typically it's specific to the API client.
        // Let's try to just fetch the list endpoint raw if SDK falls short, or assume the user has a bigger issue.
        // The error message suggested "Call ListModels to see the list".
        // I can't easily call ListModels with this SDK version if I don't know the exact syntax, usually it's `genAI.getGenerativeModel`...
        // Wait, the SDK has `genAI.getGenerativeModel`.
        // Let's try raw fetch.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log('MODELS LIST:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('LIST FAILED:', e.message);
    }

    console.log('\n--- Testing gemini-pro (v1.0) ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent('Hi');
        console.log('GEMINI-PRO SUCCESS:', result.response.text());
    } catch (e) {
        console.error('GEMINI-PRO FAILED:', e.message);
    }

    console.log('\n--- Testing gemini-1.5-flash ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hi');
        console.log('FLASH SUCCESS:', result.response.text());
    } catch (e) {
        console.error('FLASH FAILED:', e.message);
    }
}

listModels();
