import { prisma } from "@/lib/prisma";
import DietPlanCard from "@/components/DietPlanCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

// Revalidate every 60 seconds
export const revalidate = 60;

// Cached query for category with diet plans
const getCategoryBySlug = unstable_cache(
    async (slug: string) => {
        return prisma.category.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                icon: true,
                color: true,
                dietPlans: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        duration: true,
                        difficulty: true,
                        calories: true,
                        protein: true,
                        carbs: true,
                        fats: true,
                        benefits: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    },
    ['category-detail'],
    { revalidate: 60, tags: ['categories', 'diet-plans'] }
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const getHeaderColor = (color: string | null) => {
        switch (color) {
            case '#4CAF50': return 'bg-medical text-black';
            case '#2196F3': return 'bg-fitness text-black';
            case '#E91E63': return 'bg-skin text-black';
            case '#FF9800': return 'bg-athletic text-black';
            default: return 'bg-black text-white';
        }
    };

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24">
            {/* Header Bar */}
            <div className={`border-4 border-black dark:border-white/30 p-4 mb-6 shadow-retro relative ${getHeaderColor(category.color)}`}>
                <Link href="/" className="absolute top-4 right-4 bg-white border-2 border-black px-2 hover:bg-black hover:text-white transition-colors text-black">
                    X CLOSE
                </Link>

                <div className="flex items-center gap-4">
                    <div className="bg-white border-2 border-black p-2 text-4xl shadow-retro-sm">
                        {category.icon || '📁'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wide" style={{ textShadow: "2px 2px 0px rgba(255,255,255,0.5)" }}>
                            {category.name}
                        </h1>
                        <p className="font-bold opacity-80 font-mono">
                            /{category.slug}/index.html
                        </p>
                    </div>
                </div>

                <div className="mt-4 bg-white/80 border-2 border-black p-2 font-mono text-sm text-black">
                    {category.description}
                </div>
            </div>

            {/* Plan Grid */}
            <div className="mb-4 flex items-center gap-2">
                <span className="bg-black text-white px-2 font-mono text-xs">DIR_LISTING</span>
                <span className="h-0.5 bg-black dark:bg-white/50 flex-1"></span>
                <span className="font-mono text-xs text-retro-text">{category.dietPlans.length} ITEMS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.dietPlans.map((plan) => (
                    <div key={plan.id} className="h-full">
                        <DietPlanCard plan={plan} />
                    </div>
                ))}
            </div>

            {category.dietPlans.length === 0 && (
                <div className="border-2 border-dashed border-black dark:border-white/50 p-8 text-center font-mono text-retro-text">
                    NO_DATA_FOUND in this directory.
                </div>
            )}
        </div>
    );
}
