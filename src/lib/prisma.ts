import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import 'dotenv/config';
console.log('SEED DATABASE_URL =', process.env.DIRECT_URL);

const connectionString = `${process.env.DIRECT_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
