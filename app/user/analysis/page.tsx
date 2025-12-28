import { getUserAnalyses } from '@/lib/actions/analysis.action';
import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, Leaf, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import Image from 'next/image';

export default async function UserAnalysisHistoryPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/sign-in');

    const analyses = await getUserAnalyses(session.user.id);

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('healthy')) return 'bg-green-500';
        if (s.includes('sick') || s.includes('disease')) return 'bg-red-500';
        if (s.includes('water') || s.includes('attention')) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Your Plant Analysis History</h2>

            {analyses.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Leaf className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No analyses found.</p>
                        <Link href="/analysis" className="mt-4 text-primary hover:underline">
                            Analyze your first plant now
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {analyses.map((analysis: any) => (
                        <Link href={`/analysis/${analysis.id}`} key={analysis.id}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden group border-0 shadow-sm bg-card ring-1 ring-border">
                                <div className="aspect-video relative overflow-hidden bg-muted">
                                    {analysis.imageUrl ? (
                                        <Image
                                            src={analysis.imageUrl}
                                            alt={analysis.plantName}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Leaf className="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge className={`text-white font-medium shadow-md ${getStatusColor(analysis.status)}`}>
                                            {analysis.status}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                                        {analysis.plantName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                                    </div>
                                    <div className="flex items-center text-sm font-medium text-primary">
                                        View Details <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
