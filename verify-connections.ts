import { PrismaClient } from '@prisma/client';

// Simple test script
async function main() {
    console.log('🔍 Starting Connection Checks...');

    // 1. Check Database
    console.log('\n[1/2] Testing Database Connection...');
    const prisma = new PrismaClient();
    try {
        const catCount = await prisma.category.count();
        console.log(`✅ Database Connected. Found ${catCount} categories.`);
        console.log(`   URL: ${process.env.DATABASE_URL?.substring(0, 20)}...`);
    } catch (e: any) {
        console.error('❌ Database Connection Failed:');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }

    // 2. Check NVIDIA API
    console.log('\n[2/2] Testing NVIDIA API Connection...');
    const API_KEY = process.env.NVIDIA_API_KEY;
    const BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';

    if (!API_KEY) {
        console.error('❌ Missing NVIDIA_API_KEY in environment');
    } else {
        try {
            // Simple model list check or lightweight completion
            const response = await fetch(`${BASE_URL}/models`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            });

            if (response.ok) {
                console.log('✅ NVIDIA API Connected (Key Valid).');
            } else {
                console.error(`❌ NVIDIA API Failed: ${response.status} ${response.statusText}`);
            }
        } catch (e: any) {
            console.error('❌ NVIDIA API Connection Error:', e.message);
        }
    }
}

main();
