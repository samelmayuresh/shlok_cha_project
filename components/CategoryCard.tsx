'use client';

import Link from "next/link";
import Image from "next/image";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string | null;
    color: string | null;
    _count?: {
        dietPlans: number;
    };
}

interface CategoryCardProps {
    category: Category;
}

// Map category slugs to 3D icon paths
const CATEGORY_ICONS: Record<string, string> = {
    'medical': '/icons/icon_asset/medical.png',
    'fitness': '/icons/icon_asset/fitness.png',
    'skin-looks': '/icons/icon_asset/skin.png',
    'athletic': '/icons/icon_asset/athletic.png',
};

// Fallback emojis
const FALLBACK_ICONS: Record<string, string> = {
    'medical': '🏥',
    'fitness': '💪',
    'skin-looks': '✨',
    'athletic': '🏃',
};

export default function CategoryCard({ category }: CategoryCardProps) {
    const iconPath = CATEGORY_ICONS[category.slug];
    const fallbackEmoji = FALLBACK_ICONS[category.slug] || category.icon || '📋';

    // Dynamic color classes based on category type
    const getColors = (color: string | null) => {
        switch (color) {
            case '#4CAF50': // Medical
                return 'bg-medical-light border-medical-dark';
            case '#2196F3': // Fitness
                return 'bg-fitness-light border-fitness-dark';
            case '#E91E63': // Skin
                return 'bg-skin-light border-skin-dark';
            case '#FF9800': // Athletic
                return 'bg-athletic-light border-athletic-dark';
            default:
                return 'bg-retro-paper border-retro-border';
        }
    };

    return (
        <Link href={`/category/${category.slug}`}>
            <div className={`
        relative h-48 flex flex-col justify-between p-4
        border-4 shadow-retro 
        transition-all active:translate-x-1 active:translate-y-1 active:shadow-none
        ${getColors(category.color)}
      `}>
                {/* Pixel Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '4px 4px'
                    }}
                />

                {/* Icon Header */}
                <div className="flex justify-between items-start z-10">
                    <div className="bg-retro-paper border-2 border-retro-border p-2 shadow-retro-sm">
                        {iconPath ? (
                            <img
                                src={iconPath}
                                alt={`${category.name} icon`}
                                width={48}
                                height={48}
                                className="object-contain"
                                onError={(e) => {
                                    // Fallback to emoji if image fails to load
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = `<span class="text-4xl">${fallbackEmoji}</span>`;
                                }}
                            />
                        ) : (
                            <span className="text-4xl">{fallbackEmoji}</span>
                        )}
                    </div>
                    <div className="bg-retro-border text-retro-paper px-2 py-1 text-sm font-bold">
                        ID: {category.slug.toUpperCase().slice(0, 3)}
                    </div>
                </div>

                {/* Content */}
                <div className="z-10 mt-2 bg-retro-paper/90 p-2 border-2 border-retro-border backdrop-blur-sm">
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-1 text-retro-text">
                        {category.name}
                    </h3>
                    <p className="text-sm leading-tight line-clamp-2 text-retro-text">
                        {category.description}
                    </p>
                    {category._count && (
                        <div className="mt-2 text-xs flex items-center gap-1 text-retro-text">
                            <span className="w-2 h-2 bg-retro-accent animate-pulse"></span>
                            {category._count.dietPlans} PLANS LOADED
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
