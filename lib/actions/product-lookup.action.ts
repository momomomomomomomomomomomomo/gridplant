'use server';

import { prisma } from '@/db/prisma';

export async function getProductsByNames(names: string[]) {
    if (!names || names.length === 0) return [];

    const products = await prisma.product.findMany({
        where: {
            name: {
                in: names
            }
        },
        select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            price: true,
        }
    });

    return products;
}
