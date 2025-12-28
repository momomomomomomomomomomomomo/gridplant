import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function AnalysisPage() {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen w-full'>
            <h1 className='text-3xl font-bold mb-4'>Plant Analysis Service</h1>
            <p className="text-muted-foreground mb-8">Coming Soon...</p>
            <Button asChild>
                <Link href='/'>
                    Return Home
                </Link>
            </Button>
        </div>
    );
}
