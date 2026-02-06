const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.dietPlan.count();
  console.log(`Total Diet Plans: ${count}`);
  const byCat = await prisma.category.findMany({
    select: { name: true, _count: { select: { dietPlans: true } } }
  });
  console.log('Plans per category:', JSON.stringify(byCat, null, 2));
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
