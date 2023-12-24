import { getPrismaClient } from './prismaClient';

const prisma = getPrismaClient();

const guildDatabaseService = {
    async getAllGuilds() {
        return await prisma.guild.findMany();
    }
};

export default guildDatabaseService;
