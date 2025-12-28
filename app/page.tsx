import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import UserButton from '@/components/shared/header/user-button';
import ModeToggle from '@/components/shared/header/mode-toggle';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, ScanEye, Leaf, Sparkles, Shield, Truck, Heart, Star } from 'lucide-react';

const LandingPage = async () => {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/5">
            {/* Header */}
            <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 font-bold text-xl">
                        <Image
                            src='/images/logo.png'
                            width={40}
                            height={40}
                            alt={`${APP_NAME} logo`}
                            className="rounded-lg shadow-sm"
                        />
                        <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                            {APP_NAME}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block px-2">
                            Shop
                        </Link>
                        <Link href="/analysis" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block px-2">
                            Plant Analysis
                        </Link>
                        <ModeToggle />
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center py-16 md:py-24">


                <div className="text-center mb-12 max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            {APP_NAME}
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-4">
                        Your all-in-one destination for plant care and wellness.
                    </p>
                    <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto">
                        Discover a curated collection of plants, premium care products, and cutting-edge AI-powered plant analysis
                        to help your green friends thrive. Whether you&apos;re a beginner or a seasoned plant parent, we&apos;ve got you covered.
                    </p>
                </div>

                {/* Main Service Cards */}
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
                    {/* Shop Card */}
                    <Link href="/shop" className="group">
                        <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-primary to-emerald-500"></div>
                            <CardHeader className="pt-8">
                                <div className="mb-4 w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">PlantCare Shop</CardTitle>
                                <CardDescription className="text-base">
                                    Browse our extensive collection of beautiful plants, stylish pots, organic fertilizers,
                                    and premium care products. Everything you need for a thriving indoor garden.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pb-6">
                                <div className="flex items-center text-primary font-semibold text-lg">
                                    Enter Shop <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Analysis Card */}
                    <Link href="/analysis" className="group">
                        <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                            <CardHeader className="pt-8">
                                <div className="mb-4 w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ScanEye className="w-8 h-8 text-teal-600" />
                                </div>
                                <CardTitle className="text-2xl">AI Plant Analysis</CardTitle>
                                <CardDescription className="text-base">
                                    Upload a photo of your plant and let our advanced AI identify it, assess its health,
                                    provide personalized care tips, and suggest the perfect products for its needs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto pb-6">
                                <div className="flex items-center text-teal-600 font-semibold text-lg">
                                    Start Analysis <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Features Section */}
                <div className="w-full max-w-5xl">
                    <h2 className="text-2xl font-bold text-center mb-8">Why Choose {APP_NAME}?</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Leaf className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Expert Curation</h3>
                            <p className="text-sm text-muted-foreground">Hand-picked plants and products by our horticultural experts</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-teal-600" />
                            </div>
                            <h3 className="font-semibold mb-2">AI-Powered Care</h3>
                            <p className="text-sm text-muted-foreground">Advanced AI technology to diagnose and care for your plants</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                                <Truck className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-sm text-muted-foreground">Safe and speedy delivery right to your doorstep</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-rose-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Plant Health Guarantee</h3>
                            <p className="text-sm text-muted-foreground">30-day guarantee on all live plants we sell</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials/Trust Section */}
            <section className="border-t bg-muted/30 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <span className="font-medium">4.9/5 Rating</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border"></div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="font-medium">Secure Payments</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border"></div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            <span className="font-medium">Free Shipping $50+</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border"></div>
                        <div className="flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium">1000+ Happy Plants</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
