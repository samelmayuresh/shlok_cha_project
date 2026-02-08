'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import RecipeSearch from '@/components/recipes/RecipeSearch';
import DietToggle from '@/components/recipes/DietToggle';
import ImageUpload from '@/components/recipes/ImageUpload';
import RecipeCard from '@/components/recipes/RecipeCard';

interface Recipe {
    title: string;
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    calories?: number;
    difficulty?: string;
    ingredients?: string[];
    instructions?: string[];
    nutritionTips?: string;
    tags?: string[];
    rawContent?: string;
    isRaw?: boolean;
}

export default function RecipesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Diet preference state
    const [dietPreference, setDietPreference] = useState<'non-veg' | 'vegan' | 'veg'>('veg');

    // Image upload states
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const searchRecipe = useCallback(async (query: string, withImage: boolean = false) => {
        if (!query.trim() && !withImage) return;

        setLoading(true);
        setError('');
        setRecipe(null);

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query || 'healthy recipe',
                    imageBase64: withImage ? imageBase64 : undefined,
                    dietContext: dietPreference === 'vegan' ? 'vegan (no animal products)' : dietPreference === 'veg' ? 'vegetarian (no meat, eggs ok)' : 'non-vegetarian (includes meat)'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get recipe');
            }

            setRecipe(data.recipe);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [dietPreference, imageBase64]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchRecipe(searchQuery, !!imageBase64);
    };

    const handleImageSearch = () => {
        if (imageBase64) {
            searchRecipe(searchQuery || 'suggest healthy recipe with these ingredients', true);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const cleanSuggestion = suggestion.replace(/^.+?\s/, '');
        setSearchQuery(cleanSuggestion);
        searchRecipe(cleanSuggestion);
    };

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-4 shadow-retro">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🍳</span>
                        <div>
                            <h1 className="text-2xl font-bold uppercase text-retro-text">HEALTHY RECIPES</h1>
                            <p className="text-xs font-mono text-retro-text opacity-70">AI-Powered Recipe Generator</p>
                        </div>
                    </div>
                </div>

                {/* Diet Preference Toggle */}
                <DietToggle value={dietPreference} onChange={setDietPreference} />

                {/* Search Box */}
                <RecipeSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSubmit}
                    loading={loading}
                    hasImage={!!imageBase64}
                    onSuggestionClick={handleSuggestionClick}
                />

                {/* Image Upload Section */}
                <ImageUpload
                    onImageSelect={setImageBase64}
                    onClear={() => setImageBase64(null)}
                    imagePreview={imageBase64}
                    loading={loading}
                    onAnalyze={handleImageSearch}
                />

                {/* Loading State */}
                {loading && (
                    <div className="bg-retro-paper dark:bg-gray-800 border-4 border-dashed border-black dark:border-white/50 p-8 text-center">
                        <div className="text-4xl mb-3 animate-bounce">👨‍🍳</div>
                        <h2 className="text-lg font-bold uppercase text-retro-text">
                            {imageBase64 ? 'ANALYZING YOUR IMAGE...' : 'COOKING UP RECIPE...'}
                        </h2>
                        <p className="font-mono text-xs text-retro-text opacity-70 mt-2">
                            {imageBase64 ? 'Identifying ingredients and preparing recipe' : 'Our AI chef is preparing your recipe'}
                        </p>
                        <div className="mt-4 flex justify-center gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-3 h-3 bg-retro-primary rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 border-4 border-red-500 p-4">
                        <p className="text-red-700 dark:text-red-300 font-bold text-sm">❌ {error}</p>
                        <button
                            onClick={() => searchRecipe(searchQuery, !!imageBase64)}
                            className="mt-2 text-xs bg-red-500 text-white px-3 py-1 border-2 border-black hover:bg-red-600"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}

                {/* Recipe Display */}
                {recipe && !loading && (
                    <RecipeCard
                        recipe={recipe}
                        onNewSearch={() => {
                            setRecipe(null);
                            setSearchQuery('');
                            setImageBase64(null);
                        }}
                        onCopy={() => {
                            const text = recipe.isRaw
                                ? recipe.rawContent
                                : `${recipe.title}\n\nIngredients:\n${recipe.ingredients?.join('\n')}\n\nInstructions:\n${recipe.instructions?.join('\n')}`;
                            navigator.clipboard.writeText(text || '');
                        }}
                    />
                )}

                {/* No Recipe Yet */}
                {!recipe && !loading && !error && (
                    <div className="bg-retro-paper dark:bg-gray-800 border-4 border-dashed border-black dark:border-white/50 p-8 text-center">
                        <div className="text-5xl mb-3">🥗</div>
                        <h2 className="text-lg font-bold uppercase text-retro-text">FIND YOUR RECIPE</h2>
                        <p className="font-mono text-xs text-retro-text opacity-70 mt-2">
                            Search for any dish or upload a food image
                        </p>
                    </div>
                )}

                {/* Back to Tracker Link */}
                <div className="flex justify-center">
                    <Link
                        href="/tracker"
                        className="text-xs font-mono text-retro-text opacity-70 hover:opacity-100 underline"
                    >
                        ← Back to Tracker
                    </Link>
                </div>
            </div>
        </div>
    );
}
