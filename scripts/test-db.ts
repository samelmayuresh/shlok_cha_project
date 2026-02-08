// Database Connection Test Script
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/test-db.ts

import { PrismaClient } from '@prisma/client';

const testDatabaseConnection = async (connectionName: string, url: string): Promise<{
    name: string;
    success: boolean;
    message: string;
    latency?: number;
}> => {
    const startTime = Date.now();

    try {
        const prisma = new PrismaClient({
            datasources: {
                db: { url }
            },
            log: []
        });

        // Test connection by running a simple query
        await prisma.$connect();

        // Try to count categories as a basic test
        const categoryCount = await prisma.category.count();
        const userCount = await prisma.user.count();

        const latency = Date.now() - startTime;

        await prisma.$disconnect();

        return {
            name: connectionName,
            success: true,
            message: `Connected! Found ${categoryCount} categories, ${userCount} users.`,
            latency
        };
    } catch (error: any) {
        const latency = Date.now() - startTime;
        return {
            name: connectionName,
            success: false,
            message: error.message?.substring(0, 150) || 'Unknown error',
            latency
        };
    }
};

const main = async () => {
    console.log('\n========================================');
    console.log('  DATABASE CONNECTION TEST');
    console.log('========================================\n');

    const databases = [
        {
            name: 'PRIMARY (Port 6543)',
            url: process.env.DATABASE_URL_PRIMARY || ''
        },
        {
            name: 'SECONDARY (Port 5432)',
            url: process.env.DATABASE_URL_SECONDARY || ''
        },
        {
            name: 'DEFAULT (DATABASE_URL)',
            url: process.env.DATABASE_URL || ''
        }
    ];

    console.log('Testing connections...\n');

    for (const db of databases) {
        if (!db.url) {
            console.log(`❌ ${db.name}: URL not configured\n`);
            continue;
        }

        console.log(`Testing ${db.name}...`);
        const result = await testDatabaseConnection(db.name, db.url);

        if (result.success) {
            console.log(`✅ ${result.name}: SUCCESS`);
            console.log(`   ${result.message}`);
            console.log(`   Latency: ${result.latency}ms\n`);
        } else {
            console.log(`❌ ${result.name}: FAILED`);
            console.log(`   Error: ${result.message}`);
            console.log(`   Timeout: ${result.latency}ms\n`);
        }
    }

    console.log('========================================');
    console.log('  TEST COMPLETE');
    console.log('========================================\n');
};

main().catch(console.error);
