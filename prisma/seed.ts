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
    // ==========================================
    // SKIN & LOOKS
    // ==========================================
    {
        categorySlug: 'skin-looks',
        title: 'Glowing Skin Detox (Vegetarian)',
        description: 'Antioxidant-rich vegetarian plan for radiant complexion.',
        duration: '21 days',
        difficulty: 'Beginner',
        calories: 1600,
        protein: 60,
        carbs: 200,
        fats: 50,
        dietType: 'vegetarian',
        benefits: ['Luminous skin', 'Reduced inflammation', 'Better digestion'],
        restrictions: ['No meat', 'Low dairy', 'No refined sugar'],
        meals: [
            { time: 'Breakfast', items: ['Papaya bowl with lime', 'Green tea', 'Walnuts'], calories: 300 },
            { time: 'Lunch', items: ['Spinach & strawberry salad', 'Feta cheese', 'Balsamic dressing'], calories: 450 },
            { time: 'Dinner', items: ['Stuffed bell peppers (quinoa)', 'Roasted carrots'], calories: 500 },
            { time: 'Snack', items: ['Cucumber water', 'Almonds'], calories: 150 },
        ],
    },
    {
        categorySlug: 'skin-looks',
        title: 'Collagen Booster (Non-Veg)',
        description: 'Rich in collagen-boosting nutrients for firm, youthful skin.',
        duration: '30 days',
        difficulty: 'Intermediate',
        calories: 1800,
        protein: 100,
        carbs: 150,
        fats: 70,
        dietType: 'non-vegetarian',
        benefits: ['Reduced wrinkles', 'Firmer skin', 'Joint health'],
        restrictions: ['No processed meats', 'Low sugar'],
        meals: [
            { time: 'Breakfast', items: ['Bone broth', 'Poached eggs', 'Avocado toast'], calories: 450 },
            { time: 'Lunch', items: ['Sardine salad', 'Olive oil', 'Greens'], calories: 550 },
            { time: 'Dinner', items: ['Slow-cooked beef stew (bone-in)', 'Sweet potato'], calories: 600 },
            { time: 'Snack', items: ['Citrus fruits (Vitamin C)', 'Pumpkin seeds'], calories: 200 },
        ],
    },
    {
        categorySlug: 'skin-looks',
        title: 'Plant-Based Radiance (Vegan)',
        description: '100% plant-based diet focused on hydration and skin clarity.',
        duration: '14 days',
        difficulty: 'Beginner',
        calories: 1500,
        protein: 50,
        carbs: 220,
        fats: 40,
        dietType: 'vegan',
        benefits: ['Clear complexion', 'Detoxification', 'Hydration'],
        restrictions: ['Vegan', 'No oil', 'Whole foods only'],
        meals: [
            { time: 'Breakfast', items: ['Glowing Green Smoothie (Spinach, Apple, Lemon)', 'Chia pudding'], calories: 350 },
            { time: 'Lunch', items: ['Buddha bowl (Chickpeas, Kale, Tahini)', 'Brown rice'], calories: 500 },
            { time: 'Dinner', items: ['Lentil soup', 'Steamed broccoli'], calories: 450 },
            { time: 'Snack', items: ['Watermelon', 'Brazil nuts'], calories: 200 },
        ],
    },

    // ==========================================
    // FITNESS
    // ==========================================
    {
        categorySlug: 'fitness',
        title: 'Lean Muscle Builder (Non-Veg)',
        description: 'Classic high-protein bodybuilding diet for muscle growth.',
        duration: '12 weeks',
        difficulty: 'Intermediate',
        calories: 2500,
        protein: 200,
        carbs: 250,
        fats: 70,
        dietType: 'non-vegetarian',
        benefits: ['Muscle hypertrophy', 'Strength', 'Recovery'],
        restrictions: ['No alcohol', 'Track macros strict'],
        meals: [
            { time: 'Breakfast', items: ['6 Egg whites + 2 whole eggs', 'Oats', 'Blueberries'], calories: 550 },
            { time: 'Lunch', items: ['Grilled Chicken Breast', 'White Rice', 'Broccoli'], calories: 700 },
            { time: 'Pre-Workout', items: ['Whey Protein', 'Rice cake'], calories: 250 },
            { time: 'Dinner', items: ['Lean Steak', 'Sweet Potato', 'Asparagus'], calories: 750 },
        ],
    },
    {
        categorySlug: 'fitness',
        title: 'Vegetarian Strength Gains',
        description: 'Build muscle without meat using dairy and plant proteins.',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        calories: 2300,
        protein: 160,
        carbs: 280,
        fats: 70,
        dietType: 'vegetarian',
        benefits: ['Muscle growth', 'Ethical gains', 'Digestive health'],
        restrictions: ['Vegetarian', 'High dairy'],
        meals: [
            { time: 'Breakfast', items: ['Greek Yogurt Parfait', 'Whey protein', 'Granola'], calories: 500 },
            { time: 'Lunch', items: ['Paneer (Cottage Cheese) Curry', 'Quinoa', 'Salad'], calories: 700 },
            { time: 'Dinner', items: ['Lentil Pasta', 'Mozzarella', 'Marinara Sauce'], calories: 650 },
            { time: 'Snack', items: ['Hard boiled eggs', 'Apple'], calories: 300 },
        ],
    },
    {
        categorySlug: 'fitness',
        title: 'Vegan Powerlifting',
        description: 'High-calorie plant-based diet for heavy lifting.',
        duration: '10 weeks',
        difficulty: 'Advanced',
        calories: 2800,
        protein: 150,
        carbs: 350,
        fats: 90,
        dietType: 'vegan',
        benefits: ['Strength', 'Recovery', 'Low inflammation'],
        restrictions: ['Vegan', 'High volume eating'],
        meals: [
            { time: 'Breakfast', items: ['Tofu Scramble', 'Avocado toast (2)', 'Soy milk'], calories: 700 },
            { time: 'Lunch', items: ['Seitan Stir-fry', 'Brown Rice', 'Peanut sauce'], calories: 800 },
            { time: 'Dinner', items: ['Black bean burgers', 'Sweet potato fries (baked)', 'Kale salad'], calories: 800 },
            { time: 'Snack', items: ['Pea protein shake', 'Banana'], calories: 400 },
        ],
    },

    // ==========================================
    // ATHLETIC
    // ==========================================
    {
        categorySlug: 'athletic',
        title: 'Marathon Runner Fuel (Carb Load)',
        description: 'High-carbohydrate plan for endurance athletes.',
        duration: '16 weeks',
        difficulty: 'Advanced',
        calories: 3000,
        protein: 120,
        carbs: 450,
        fats: 60,
        dietType: 'non-vegetarian',
        benefits: ['Endurance', 'Glycogen storage', 'Stamina'],
        restrictions: ['Timing centered around training'],
        meals: [
            { time: 'Breakfast', items: ['Large bowl of oatmeal', 'Honey', 'Banana', 'Toast'], calories: 700 },
            { time: 'Lunch', items: ['Turkey Sandwich (Web bread)', 'Pasta salad', 'Fruit'], calories: 800 },
            { time: 'Dinner', items: ['Grilled Chicken', 'Double portion Rice', 'Zucchini'], calories: 900 },
            { time: 'Intra-Workout', items: ['Energy Gel', 'Sports Drink'], calories: 400 },
        ],
    },
    {
        categorySlug: 'athletic',
        title: 'Sprinter Explosive Power (Vegan)',
        description: 'Plant-based power diet for short-burst athletes.',
        duration: '8 weeks',
        difficulty: 'Advanced',
        calories: 2600,
        protein: 140,
        carbs: 300,
        fats: 80,
        dietType: 'vegan',
        benefits: ['Explosive energy', 'Lean physique', 'Recovery'],
        restrictions: ['Vegan'],
        meals: [
            { time: 'Breakfast', items: ['Overnight oats', 'Vegan protein powder', 'Chia seeds'], calories: 600 },
            { time: 'Lunch', items: ['Tempeh tacos', 'Corn', 'Guacamole'], calories: 750 },
            { time: 'Dinner', items: ['Lentil & Sweet Potato Curry', 'Rice'], calories: 800 },
            { time: 'Snack', items: ['Edamame', 'Rice cakes with PB'], calories: 350 },
        ],
    },

    // ==========================================
    // MEDICAL
    // ==========================================
    {
        categorySlug: 'medical',
        title: 'Heart Healthy (Mediterranean)',
        description: 'Gold standard for cardiovascular health.',
        duration: 'Lifetime',
        difficulty: 'Easy',
        calories: 2000,
        protein: 90,
        carbs: 250,
        fats: 70,
        dietType: 'non-vegetarian',
        benefits: ['Heart health', 'Longevity', 'Brain function'],
        restrictions: ['Low warm-blooded meat', 'High olive oil'],
        meals: [
            { time: 'Breakfast', items: ['Greek Yogurt', 'Berries', 'Walnuts'], calories: 400 },
            { time: 'Lunch', items: ['Grilled Salmon', 'Greek Salad', 'Whole grain pita'], calories: 650 },
            { time: 'Dinner', items: ['Cod', 'Asparagus', 'Couscous'], calories: 550 },
            { time: 'Snack', items: ['Olives', 'Apple'], calories: 300 },
        ],
    },
    {
        categorySlug: 'medical',
        title: 'Type 2 Diabetes Control (Veg)',
        description: 'Vegetarian plan to manage stable blood sugar.',
        duration: 'Ongoing',
        difficulty: 'Intermediate',
        calories: 1800,
        protein: 80,
        carbs: 180,
        fats: 70,
        dietType: 'vegetarian',
        benefits: ['Sugar control', 'Weight loss', 'Energy stability'],
        restrictions: ['Low GI index', 'No refined sugar'],
        meals: [
            { time: 'Breakfast', items: ['Steel cut oats', 'Cinnamon', 'Almonds'], calories: 400 },
            { time: 'Lunch', items: ['Chana Masala (Chickpeas)', 'Brown Rice'], calories: 550 },
            { time: 'Dinner', items: ['Tofu & Broccoli Stir-fry', 'Quinoa'], calories: 500 },
            { time: 'Snack', items: ['Roasted chickpeas', 'Tea'], calories: 250 },
        ],
    },
];

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data (in correct order due to foreign keys)
    await prisma.chatMessage.deleteMany();
    await prisma.chatHistory.deleteMany();
    await prisma.userPlan.deleteMany();
    await prisma.dietPlan.deleteMany();
    await prisma.category.deleteMany();

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
                dietType: plan.dietType, // New field
            },
        });
        console.log(`   ✓ ${plan.title} (${plan.dietType})`);
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
