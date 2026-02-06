import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    {
        name: 'Medical',
        slug: 'medical',
        description: 'Diet plans designed for specific medical conditions and health requirements',
        icon: '🏥',
        color: '#4CAF50',
    },
    {
        name: 'Fitness',
        slug: 'fitness',
        description: 'Optimized nutrition plans for workout performance and muscle building',
        icon: '💪',
        color: '#2196F3',
    },
    {
        name: 'Skin & Looks',
        slug: 'skin-looks',
        description: 'Beauty-focused diets for glowing skin and healthy appearance',
        icon: '✨',
        color: '#E91E63',
    },
    {
        name: 'Athletic',
        slug: 'athletic',
        description: 'High-performance nutrition for athletes and sports enthusiasts',
        icon: '🏃',
        color: '#FF9800',
    },
];

const dietPlans = [
    // Medical Category
    {
        categorySlug: 'medical',
        title: 'Diabetes Management Plan',
        description: 'A balanced diet plan to manage blood sugar levels effectively',
        duration: '30 days',
        difficulty: 'Intermediate',
        calories: 1800,
        protein: 90,
        carbs: 200,
        fats: 60,
        benefits: ['Stable blood sugar', 'Weight management', 'Improved energy'],
        restrictions: ['Low sugar', 'Complex carbs only', 'No processed foods'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'],
                calories: 400,
            },
            {
                time: 'Lunch',
                items: ['Grilled chicken salad', 'Quinoa', 'Steamed vegetables'],
                calories: 600,
            },
            {
                time: 'Dinner',
                items: ['Baked salmon', 'Brown rice', 'Broccoli'],
                calories: 550,
            },
            {
                time: 'Snacks',
                items: ['Almonds', 'Apple slices'],
                calories: 250,
            },
        ],
    },
    {
        categorySlug: 'medical',
        title: 'Heart-Healthy Mediterranean Diet',
        description: 'Reduce cardiovascular risk with this proven Mediterranean approach',
        duration: '60 days',
        difficulty: 'Beginner',
        calories: 2000,
        protein: 85,
        carbs: 230,
        fats: 70,
        benefits: ['Lower cholesterol', 'Reduced inflammation', 'Heart health'],
        restrictions: ['Low saturated fat', 'No trans fats', 'Limited red meat'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Whole grain toast', 'Avocado', 'Poached eggs'],
                calories: 450,
            },
            {
                time: 'Lunch',
                items: ['Mediterranean salad', 'Hummus', 'Whole wheat pita'],
                calories: 650,
            },
            {
                time: 'Dinner',
                items: ['Grilled fish', 'Roasted vegetables', 'Olive oil'],
                calories: 600,
            },
            {
                time: 'Snacks',
                items: ['Walnuts', 'Fresh fruit'],
                calories: 300,
            },
        ],
    },

    // Fitness Category
    {
        categorySlug: 'fitness',
        title: 'Muscle Building Bulk',
        description: 'High-protein plan designed for serious muscle growth',
        duration: '90 days',
        difficulty: 'Advanced',
        calories: 3200,
        protein: 200,
        carbs: 400,
        fats: 90,
        benefits: ['Muscle growth', 'Strength gains', 'Recovery support'],
        restrictions: ['High protein', 'Complex carbs', 'Healthy fats only'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Scrambled eggs (4)', 'Oatmeal', 'Banana', 'Protein shake'],
                calories: 800,
            },
            {
                time: 'Lunch',
                items: ['Chicken breast', 'Sweet potato', 'Mixed vegetables'],
                calories: 900,
            },
            {
                time: 'Dinner',
                items: ['Lean beef', 'Brown rice', 'Spinach salad'],
                calories: 950,
            },
            {
                time: 'Snacks',
                items: ['Protein bar', 'Greek yogurt', 'Nuts'],
                calories: 550,
            },
        ],
    },
    {
        categorySlug: 'fitness',
        title: 'Lean Cut Program',
        description: 'Burn fat while preserving muscle mass',
        duration: '60 days',
        difficulty: 'Intermediate',
        calories: 1900,
        protein: 150,
        carbs: 180,
        fats: 50,
        benefits: ['Fat loss', 'Muscle retention', 'Increased definition'],
        restrictions: ['Calorie deficit', 'High protein', 'Low fat'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Egg whites', 'Whole wheat toast', 'Berries'],
                calories: 400,
            },
            {
                time: 'Lunch',
                items: ['Grilled turkey', 'Quinoa', 'Green salad'],
                calories: 600,
            },
            {
                time: 'Dinner',
                items: ['White fish', 'Asparagus', 'Small portion rice'],
                calories: 550,
            },
            {
                time: 'Snacks',
                items: ['Protein shake', 'Celery sticks'],
                calories: 350,
            },
        ],
    },

    // Skin & Looks Category
    {
        categorySlug: 'skin-looks',
        title: 'Glowing Skin Detox',
        description: 'Antioxidant-rich foods for radiant, healthy skin',
        duration: '21 days',
        difficulty: 'Beginner',
        calories: 1700,
        protein: 70,
        carbs: 210,
        fats: 55,
        benefits: ['Clear skin', 'Anti-aging', 'Hydration boost'],
        restrictions: ['No dairy', 'No refined sugar', 'Plenty of water'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Green smoothie', 'Chia seeds', 'Fresh berries'],
                calories: 350,
            },
            {
                time: 'Lunch',
                items: ['Rainbow salad', 'Grilled salmon', 'Avocado'],
                calories: 600,
            },
            {
                time: 'Dinner',
                items: ['Vegetable stir-fry', 'Tofu', 'Brown rice'],
                calories: 500,
            },
            {
                time: 'Snacks',
                items: ['Carrot sticks', 'Hummus', 'Green tea'],
                calories: 250,
            },
        ],
    },
    {
        categorySlug: 'skin-looks',
        title: 'Anti-Aging Nutrition',
        description: 'Combat aging from the inside out with nutrient-dense foods',
        duration: '90 days',
        difficulty: 'Intermediate',
        calories: 1850,
        protein: 80,
        carbs: 200,
        fats: 65,
        benefits: ['Reduced wrinkles', 'Collagen production', 'Skin elasticity'],
        restrictions: ['No processed foods', 'Low sugar', 'Antioxidant-rich'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Acai bowl', 'Walnuts', 'Blueberries'],
                calories: 400,
            },
            {
                time: 'Lunch',
                items: ['Spinach salad', 'Grilled chicken', 'Sweet potato'],
                calories: 650,
            },
            {
                time: 'Dinner',
                items: ['Wild salmon', 'Kale', 'Quinoa'],
                calories: 550,
            },
            {
                time: 'Snacks',
                items: ['Dark chocolate', 'Pomegranate'],
                calories: 250,
            },
        ],
    },

    // Athletic Category
    {
        categorySlug: 'athletic',
        title: 'Endurance Athlete Fuel',
        description: 'Optimize performance for long-distance running and cycling',
        duration: '60 days',
        difficulty: 'Advanced',
        calories: 3000,
        protein: 140,
        carbs: 450,
        fats: 80,
        benefits: ['Sustained energy', 'Quick recovery', 'Enhanced stamina'],
        restrictions: ['High carbs', 'Moderate protein', 'Timed nutrition'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Whole grain pancakes', 'Banana', 'Almond butter'],
                calories: 750,
            },
            {
                time: 'Lunch',
                items: ['Pasta', 'Chicken', 'Tomato sauce', 'Vegetables'],
                calories: 900,
            },
            {
                time: 'Dinner',
                items: ['Grilled fish', 'Large sweet potato', 'Green beans'],
                calories: 850,
            },
            {
                time: 'Snacks',
                items: ['Energy bars', 'Dried fruits', 'Sports drink'],
                calories: 500,
            },
        ],
    },
    {
        categorySlug: 'athletic',
        title: 'Power Athlete Performance',
        description: 'Explosive power and strength for sprinters and power lifters',
        duration: '90 days',
        difficulty: 'Advanced',
        calories: 3500,
        protein: 220,
        carbs: 380,
        fats: 110,
        benefits: ['Explosive power', 'Muscle recovery', 'Peak performance'],
        restrictions: ['High protein', 'Quality carbs', 'Strategic timing'],
        meals: [
            {
                time: 'Breakfast',
                items: ['Steak', 'Eggs', 'Hash browns', 'Orange juice'],
                calories: 900,
            },
            {
                time: 'Lunch',
                items: ['Large chicken breast', 'Rice', 'Mixed vegetables'],
                calories: 1000,
            },
            {
                time: 'Dinner',
                items: ['Salmon', 'Quinoa', 'Avocado', 'Salad'],
                calories: 950,
            },
            {
                time: 'Snacks',
                items: ['Protein shake', 'Beef jerky', 'Nuts'],
                calories: 650,
            },
        ],
    },
];

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.chatMessage.deleteMany();
    await prisma.chatHistory.deleteMany();
    await prisma.userPlan.deleteMany();
    await prisma.dietPlan.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✨ Creating categories...');

    const createdCategories: any = {};
    for (const category of categories) {
        const created = await prisma.category.create({
            data: category,
        });
        createdCategories[category.slug] = created;
        console.log(`   ✓ ${category.name}`);
    }

    console.log('📋 Creating diet plans...');

    for (const plan of dietPlans) {
        const category = createdCategories[plan.categorySlug];
        await prisma.dietPlan.create({
            data: {
                title: plan.title,
                description: plan.description,
                duration: plan.duration,
                difficulty: plan.difficulty,
                calories: plan.calories,
                protein: plan.protein,
                carbs: plan.carbs,
                fats: plan.fats,
                benefits: plan.benefits,
                restrictions: plan.restrictions,
                meals: plan.meals,
                categoryId: category.id,
            },
        });
        console.log(`   ✓ ${plan.title}`);
    }

    console.log('✅ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
