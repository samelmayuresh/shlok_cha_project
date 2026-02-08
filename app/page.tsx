import { prisma } from "@/lib/prisma";
import CategoryCard, { Category } from "@/components/CategoryCard";
import Link from "next/link";
import { unstable_cache } from "next/cache";

// Force dynamic rendering (prevents SSG database errors on Vercel)
export const dynamic = 'force-dynamic';

// Cache the categories query
const getCategories = unstable_cache(
    async () => {
        return prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                icon: true,
                color: true,
                _count: {
                    select: { dietPlans: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    },
    ['categories-list'],
    { revalidate: 60, tags: ['categories'] }
);

export default async function HomePage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24 transition-colors duration-300">
            {/* Retro Header Section */}
            <header className="mb-8 border-b-4 border-retro-border pb-4 text-center bg-retro-paper p-4 shadow-retro animate-slide-up">
                <h1 className="text-4xl font-bold text-retro-primary mb-2 tracking-widest uppercase filter drop-shadow-[2px_2px_0_var(--shadow-color)]">
                    DietPlan.EXE
                </h1>
                <div className="inline-block bg-retro-border text-retro-paper px-2 py-1 font-mono text-sm typing-effect">
                    SYSTEM_READY... OK
                </div>
            </header>

            {/* Hero Box */}
            <section className="mb-8 animate-slide-up stagger-1">
                <div className="bg-retro-secondary text-white border-4 border-retro-border p-6 shadow-retro relative overflow-hidden group hover-lift">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2 uppercase drop-shadow-md">Welcome User_01</h2>
                        <p className="font-mono mb-4 text-white/90 drop-shadow-sm">
                            Initializing personalized nutrition modules. Select a database to proceed.
                        </p>
                        <Link
                            href="/chat"
                            className="inline-block bg-white text-retro-secondary border-2 border-retro-border px-4 py-2 font-bold shadow-retro-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1"
                        >
                            &gt; RUN AI_OAUTH
                        </Link>
                    </div>
                    {/* Decorative Glitch text or shapes */}
                    <div className="absolute -right-4 -bottom-4 text-9xl opacity-20 rotate-12 text-black transition-transform group-hover:rotate-6 group-hover:scale-110">
                        AI
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-retro-border pb-1 animate-fade-in">
                    <span className="w-3 h-3 bg-retro-border animate-pulse"></span>
                    <h3 className="text-xl font-bold uppercase text-retro-text">Select Category</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {categories.map((category: Category, index: number) => (
                        <div
                            key={category.id}
                            className={`animate-slide-up hover-lift`}
                            style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Access / Footer */}
            <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="text-center font-mono text-xs text-retro-muted border-t-2 border-retro-muted pt-4 mt-8">
                    © 2026 DIET_CORP // V.1.0.0
                    <br />
                    <span className="animate-pulse">MEMORY: 64KB OK</span>
                </div>
            </section>
        </div>
    );
}

