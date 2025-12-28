import { getAllAnalyses } from '@/lib/actions/analysis.action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { TrendingUp, Activity, Users } from 'lucide-react';

export default async function AdminAnalysisPage() {
    const session = await auth();
    if (session?.user.role !== 'admin') redirect('/admin/overview');

    const analyses = await getAllAnalyses();

    const totalAnalyses = analyses.length;
    const healthyCount = analyses.filter(a => a.status.toLowerCase().includes('healthy')).length;
    const sickCount = analyses.filter(a => a.status.toLowerCase().includes('sick') || a.status.toLowerCase().includes('disease')).length;

    const getStatusVariant = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('healthy')) return 'success';
        if (s.includes('sick') || s.includes('disease')) return 'destructive';
        if (s.includes('water')) return 'warning';
        return 'secondary';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Plant Analysis Overview</h1>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAnalyses}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Healthy Plants</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attention Needed</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{sickCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plant Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analyses.map((analysis) => (
                                    <TableRow key={analysis.id}>
                                        <TableCell className="whitespace-nowrap font-medium">
                                            {format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{analysis.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{analysis.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{analysis.plantName}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(analysis.status) as any}>
                                                {analysis.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/analysis/${analysis.id}`} className="text-primary hover:underline text-sm font-medium">
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {analyses.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground">
                                No analyses data available yet.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
