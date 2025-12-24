'use client';

import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCarousel({ data }: { data: Product[] }) {
  return (
    <Carousel
      className='w-full mb-12'
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className='relative mx-auto aspect-[16/6] min-h-[200px] max-h-[350px] w-full overflow-hidden rounded-xl shadow-lg'>
                <Image
                  alt={product.name}
                  src={product.banner!}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 80vw'
                  priority
                />
                <div className='absolute inset-0 flex items-end justify-center'>
                  <div className='bg-black/80 px-4 py-2 mb-4'>
                    <h2 className='text-lg font-bold text-white md:text-xl text-center'>
                      {product.name}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 md:-left-12" />
      <CarouselNext className="right-0 md:-right-12" />
    </Carousel>
  );
}
