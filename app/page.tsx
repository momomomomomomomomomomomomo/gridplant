import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import UserButton from '@/components/shared/header/user-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, ScanEye } from 'lucide-react';

const LandingPage = async () => {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="w-full border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Image
                            src='/images/logo.png'
                            width={32}
                            height={32}
                            alt={`${APP_NAME} logo`}
                        />
                        {APP_NAME}
                    </div>
                    <div>
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center py-12">
                <div className="text-center mb-12 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Welcome to GridPlant
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Your all-in-one destination for plant care. Choose a service to get started.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Shop Card */}
                    <Link href="/shop" className="group">
                        <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer flex flex-col">
                            <CardHeader>
                                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <ShoppingBag className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">PlantCare Shop</CardTitle>
                                <CardDescription>
                                    Browse our extensive collection of plants, pots, and care products.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="flex items-center text-primary font-medium">
                                    Enter Shop <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Analysis Card */}
                    <Link href="/analysis" className="group">
                        <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer flex flex-col">
                            <CardHeader>
                                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <ScanEye className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Plant Analysis</CardTitle>
                                <CardDescription>
                                    Upload an image of your plant to get instant care tips and product suggestions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="flex items-center text-primary font-medium">
                                    Start Analysis <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
