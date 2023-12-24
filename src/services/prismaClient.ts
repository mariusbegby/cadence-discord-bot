import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};
