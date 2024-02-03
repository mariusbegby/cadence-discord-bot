import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export const usePrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};
