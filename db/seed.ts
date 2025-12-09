import { prisma } from './prisma';
import sampleData from './sample-data';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

  console.log('Database seeded successfully');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});