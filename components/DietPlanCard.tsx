'use client';

import Link from 'next/link';

interface DietPlan {
    id: string;
    title: string;
    description: string | null;
    duration: string | null;
    difficulty: string | null;
    calories: number | null;
    protein: number | null;
    categoryId: string;
}

interface DietPlanCardProps {
    plan: DietPlan;
}

export default function DietPlanCard({ plan }: DietPlanCardProps) {
    return (
        <Link href={`/plan/${plan.id}`}>
            <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-4 hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer shadow-retro h-full">
                {/* Title */}
                <h3 className="font-bold text-lg mb-2 text-retro-text uppercase tracking-tight">
                    {plan.title}
                </h3>

                {/* Description */}
                {plan.description && (
                    <p className="text-sm text-retro-text opacity-80 mb-3 line-clamp-2">
                        {plan.description}
                    </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                    {plan.duration && (
                        <div className="bg-retro-accent/20 border border-black dark:border-white/30 px-2 py-1 text-xs">
                            <span className="font-bold">⏱</span> {plan.duration}
                        </div>
                    )}
                    {plan.difficulty && (
                        <div className="bg-retro-secondary/20 border border-black dark:border-white/30 px-2 py-1 text-xs">
                            <span className="font-bold">📊</span> {plan.difficulty}
                        </div>
                    )}
                    {plan.calories && (
                        <div className="bg-medical-light/50 border border-black dark:border-white/30 px-2 py-1 text-xs">
                            <span className="font-bold">🔥</span> {plan.calories} cal
                        </div>
                    )}
                    {plan.protein && (
                        <div className="bg-fitness-light/50 border border-black dark:border-white/30 px-2 py-1 text-xs">
                            <span className="font-bold">💪</span> {plan.protein}g protein
                        </div>
                    )}
                </div>

                {/* View More */}
                <div className="mt-3 text-xs font-bold text-retro-primary uppercase">
                    VIEW PLAN →
                </div>
            </div>
        </Link>
    );
}
