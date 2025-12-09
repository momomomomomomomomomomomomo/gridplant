import dotenv from 'dotenv'
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter }).$extends({
   result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
}); 


