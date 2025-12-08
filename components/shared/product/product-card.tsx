import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProductPrice from './product-price';

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden border shadow-sm  transition-shadow duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link
          href={`/product/${product.slug}`}
          className="block overflow-hidden"
        >
          <div className="relative aspect-square">
            <Image
              priority
              src={product.images![0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 250px, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-3">
        <div className="text-xs text-muted-foreground">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-2 text-sm font-medium hover:underline">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {product.rating} stars
          </p>
          {product.stock > 0 ? (
           <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-sm text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;