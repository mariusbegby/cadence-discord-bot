import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db';
}

let prisma: PrismaClient | undefined;

export const usePrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }

    return prisma;
};
