import { getAnalysisById } from '@/lib/actions/analysis.action';
import { getProductsByNames } from '@/lib/actions/product-lookup.action';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, ShoppingBag, Leaf, Droplets, Sun, Scissors } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default async function AnalysisResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const analysis = await getAnalysisById(id);

    if (!analysis) {
        return notFound();
    }

    // Parse product suggestions if it's a string, otherwise use as is
    let productSuggestions: string[] = [];
    try {
        if (typeof analysis.productSuggestions === 'string') {
            productSuggestions = JSON.parse(analysis.productSuggestions);
        } else if (Array.isArray(analysis.productSuggestions)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            productSuggestions = analysis.productSuggestions as any[];
        }
    } catch (e) {
        console.error("Failed to parse product suggestions", e);
    }

    // Fetch actual products from DB with images
    const products = await getProductsByNames(productSuggestions);

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('healthy')) return 'bg-green-500 hover:bg-green-600';
        if (s.includes('sick') || s.includes('disease')) return 'bg-red-500 hover:bg-red-600';
        if (s.includes('water') || s.includes('attention')) return 'bg-yellow-500 hover:bg-yellow-600';
        return 'bg-blue-500 hover:bg-blue-600';
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('water')) return <Droplets className="w-5 h-5" />;
        if (s.includes('sick') || s.includes('disease')) return <Scissors className="w-5 h-5" />;
        return <Sun className="w-5 h-5" />;
    };

    return (
        <div className='container mx-auto px-3 py-4 md:p-8 max-w-4xl'>
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 gap-2">
                    <Link href="/analysis"><ArrowLeft className="w-4 h-4" /> Back to Analysis</Link>
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-6">
                    {/* Image Section */}
                    {analysis.imageUrl && (
                        <div className="relative w-full md:w-48 aspect-square rounded-xl overflow-hidden shadow-sm border shrink-0">
                            <Image
                                src={analysis.imageUrl}
                                alt={analysis.plantName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Text Details */}
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                {!analysis.imageUrl && (
                                    <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                        <Leaf className="text-primary w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                )}
                                <Badge className={`text-white px-3 py-1 text-sm md:text-base font-medium inline-flex items-center gap-2 w-fit ${getStatusColor(analysis.status)}`}>
                                    {getStatusIcon(analysis.status)}
                                    {analysis.status}
                                </Badge>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                                {analysis.plantName}
                            </h1>
                            <p className="text-sm text-muted-foreground">Analyzed on {new Date(analysis.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                {/* Care Steps Section */}
                <Card className="border-l-4 border-l-primary shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                            Care Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="prose dark:prose-invert max-w-none prose-headings:text-primary prose-headings:font-semibold prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2 prose-ol:my-2 prose-li:my-1">
                            <ReactMarkdown
                                components={{
                                    h2: ({ children }) => (
                                        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary border-b border-primary/20 pb-2 mt-6 first:mt-0">
                                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            {children}
                                        </h2>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside space-y-2 pl-4 my-3">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-foreground/90 leading-relaxed">{children}</li>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-foreground/80 leading-relaxed my-2">{children}</p>
                                    ),
                                }}
                            >
                                {analysis.careSteps}
                            </ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Suggestions Section */}
                {products.length > 0 && (
                    <Card className="shadow-md overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                        <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                            <CardTitle className="text-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                <ShoppingBag className="w-6 h-6" />
                                Recommended Products
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Products from our shop that can help care for your plant</p>
                        </CardHeader>
                        <CardContent className="pt-4 md:pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {products.map((product) => (
                                    <Link key={product.id} href={`/product/${product.slug}`}>
                                        <div className="bg-background hover:bg-accent/50 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer overflow-hidden group">
                                            <div className="aspect-square relative bg-muted">
                                                {product.images && product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-primary">
                                                        ${Number(product.price).toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                                                        View <ArrowLeft className="w-3 h-3 rotate-180" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Fallback if no products found */}
                {productSuggestions.length > 0 && products.length === 0 && (
                    <Card className="shadow-sm border-dashed">
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>The suggested products are not currently available in our shop.</p>
                            <Button asChild variant="outline" className="mt-4">
                                <Link href="/shop">Browse All Products</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
