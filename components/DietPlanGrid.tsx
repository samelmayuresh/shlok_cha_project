'use client';

import { useState } from 'react';
import DietPlanCard from "./DietPlanCard";

interface DietPlan {
    id: string;
    title: string;
    description: string;
    duration: string | null;
    difficulty: string | null;
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fats: number | null;
    benefits: string[];
    dietType: string;
    categoryId: string;
}

interface DietPlanGridProps {
    plans: DietPlan[];
}

export default function DietPlanGrid({ plans }: DietPlanGridProps) {
    const [filter, setFilter] = useState<'all' | 'vegetarian' | 'vegan' | 'non-vegetarian'>('all');

    const filteredPlans = filter === 'all'
        ? plans
        : plans.filter(p => p.dietType === filter);

    return (
        <div>
            {/* Filter Controls */}
            <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 border-2 border-black shadow-retro-sm">
                <span className="font-bold text-black uppercase">Filter by Type:</span>

                <div className="flex gap-2">
                    {[
                        { id: 'all', label: 'ALL FILES' },
                        { id: 'vegetarian', label: 'VEGETARIAN' },
                        { id: 'vegan', label: 'VEGAN' },
                        { id: 'non-vegetarian', label: 'NON-VEG' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setFilter(type.id as any)}
                            className={`
                                px-4 py-2 text-sm font-bold border-2 transition-all
                                ${filter === type.id
                                    ? 'bg-black text-white border-black translate-y-1 shadow-none'
                                    : 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                }
                            `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <span className="bg-black text-white px-2 font-mono text-xs">DIR_LISTING</span>
                <span className="h-0.5 bg-black dark:bg-white/50 flex-1"></span>
                <span className="font-mono text-xs text-retro-text">{filteredPlans.length} ITEMS FOUND</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                    <div key={plan.id} className="h-full">
                        <DietPlanCard plan={plan} />
                    </div>
                ))}
            </div>

            {filteredPlans.length === 0 && (
                <div className="border-2 border-dashed border-black dark:border-white/50 p-8 text-center font-mono text-retro-text bg-white/50">
                    NO_DATA_FOUND for filter "{filter.toUpperCase()}". try another directory.
                </div>
            )}
        </div>
    );
}
