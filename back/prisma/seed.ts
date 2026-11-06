import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const rodion = await prisma.user.upsert({
        where: { email: 'rodion@mail.ru' },
        update: {},
        create: {
            email: 'rodion@mail.ru',
            tag: 'rodion',
            name: 'rodion',
            password: await bcrypt.hash('123123', 10),
        },
    });

    console.log('Seeded:', rodion);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
