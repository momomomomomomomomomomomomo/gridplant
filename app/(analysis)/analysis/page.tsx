'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/lib/uploadthing';
import { analyzePlantImage } from '@/lib/actions/analysis.action';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Leaf, ScanSearch, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { APP_NAME } from '@/lib/constants';

export default function AnalysisPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const loadingMessages = [
        'Uploading image...',
        'Scanning plant features...',
        'Consulting our botanical AI...',
        'Generating care recommendations...',
        'Almost there...',
    ];

    const handleUploadComplete = async (res: any[]) => {
        if (!res || res.length === 0) return;

        const file = res[0];
        const imageUrl = file.ufsUrl || file.url;
        const imageKey = file.key;

        setIsAnalyzing(true);
        setLoadingMessage(loadingMessages[0]);

        // Cycle through loading messages
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[msgIndex]);
        }, 2500);

        try {
            if (!session?.user?.id) {
                toast.error("You must be logged in to use this feature.");
                setIsAnalyzing(false);
                clearInterval(msgInterval);
                return;
            }
            const result = await analyzePlantImage(imageUrl, session.user.id, imageKey);
            clearInterval(msgInterval);

            if (result.success && result.analysisId) {
                toast.success('Analysis complete!');
                router.push(`/analysis/${result.analysisId}`);
            } else {
                toast.error(result.error || 'Something went wrong during analysis.');
                setIsAnalyzing(false);
            }
        } catch (error) {
            console.error(error);
            clearInterval(msgInterval);
            toast.error('An unexpected error occurred.');
            setIsAnalyzing(false);
        }
    };

    return (
        <div className='wrapper py-8'>
            {/* Hero Section */}
            <div className="text-center mb-10">

                <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                    <span className="text-primary">{APP_NAME}</span> Analysis
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Upload a photo of your plant and let our AI identify it, assess its health,
                    provide personalized care tips, and suggest products from our shop.
                </p>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                    <ScanSearch className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-semibold">Plant Identification</p>
                        <p className="text-sm text-muted-foreground">Discover what plant you have</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                    <Leaf className="w-8 h-8 text-green-500" />
                    <div>
                        <p className="font-semibold">Health Assessment</p>
                        <p className="text-sm text-muted-foreground">Check if it's healthy</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                    <div>
                        <p className="font-semibold">Product Suggestions</p>
                        <p className="text-sm text-muted-foreground">Get the right care products</p>
                    </div>
                </div>
            </div>

            {/* Upload Card */}
            <Card className="w-full max-w-xl mx-auto shadow-lg border-primary/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Upload Your Plant Photo</CardTitle>
                    <CardDescription>Supports JPG, PNG, WEBP • Max 16MB</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'loading' ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                            <p className="text-muted-foreground">Loading session...</p>
                        </div>
                    ) : status === 'unauthenticated' ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <p className="text-muted-foreground">Please sign in to analyze your plants.</p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                <Leaf className="w-6 h-6 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-muted-foreground font-medium text-center">{loadingMessage}</p>
                            <p className="text-sm text-muted-foreground/70">This may take up to 30 seconds...</p>
                        </div>
                    ) : (
                        <UploadDropzone
                            endpoint="imageUploader"
                            config={{ mode: 'auto' }}
                            onClientUploadComplete={handleUploadComplete}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`);
                            }}
                            className="ut-label:text-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
                        />
                    )}
                </CardContent>
            </Card>

            {!isAnalyzing && status === 'authenticated' && (
                <div className="mt-6 text-center space-y-3">
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        🔒 Your image is analyzed securely and deleted immediately after processing.
                    </p>
                    <a
                        href="/user/analysis"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                        📋 View your analysis history
                    </a>
                </div>
            )}
        </div>
    );
}
