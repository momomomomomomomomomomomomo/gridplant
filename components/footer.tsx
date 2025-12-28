import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src='/images/logo.png'
              width={28}
              height={28}
              alt={`${APP_NAME} logo`}
              className="rounded"
            />
            <span className="font-semibold text-primary">{APP_NAME}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <Link href="/analysis" className="hover:text-primary transition-colors">Analysis</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
