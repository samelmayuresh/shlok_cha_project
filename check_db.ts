import { prisma } from "./lib/prisma";

async function main() {
    try {
        console.log('Checking database connection...');
        const user = await prisma.user.findFirst({
            where: { email: 'guest@dietai.com' }
        });

        if (user) {
            console.log('✅ Guest user found:', user.id);
        } else {
            console.error('❌ Guest user NOT found.');
        }
    } catch (error) {
        console.error('❌ Database Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
