'use client';

import { useState } from 'react';

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

interface RecipeButtonProps {
    foodItem: string;
    dietContext?: string;
}

export default function RecipeButton({ foodItem, dietContext }: RecipeButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecipe = async () => {
        setShowModal(true);
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: foodItem, dietContext }),
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
    };

    return (
        <>
            {/* Recipe Button */}
            <button
                onClick={fetchRecipe}
                className="bg-retro-accent/80 hover:bg-retro-accent text-black text-xs px-2 py-1 border border-black font-bold transition-colors"
                title={`Get recipe for ${foodItem}`}
            >
                🍳
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 shadow-retro max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-retro-primary p-3 flex justify-between items-center">
                            <h3 className="font-bold uppercase text-white text-sm">🍳 RECIPE: {foodItem}</h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setRecipe(null);
                                    setError('');
                                }}
                                className="bg-white text-black px-2 py-0.5 text-xs font-bold border border-black hover:bg-red-500 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 overflow-y-auto flex-1">
                            {loading && (
                                <div className="text-center py-8">
                                    <div className="text-3xl mb-2 animate-bounce">👨‍🍳</div>
                                    <p className="text-sm font-mono text-retro-text">Preparing recipe...</p>
                                    <div className="mt-3 flex justify-center gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 bg-retro-primary rounded-full animate-pulse"
                                                style={{ animationDelay: `${i * 0.2}s` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-8">
                                    <p className="text-red-500 font-bold text-sm">❌ {error}</p>
                                    <button
                                        onClick={fetchRecipe}
                                        className="mt-3 text-xs bg-retro-primary text-white px-3 py-1 border-2 border-black"
                                    >
                                        TRY AGAIN
                                    </button>
                                </div>
                            )}

                            {recipe && !loading && (
                                <div className="space-y-3">
                                    {/* Recipe Info */}
                                    {!recipe.isRaw && (
                                        <div className="flex flex-wrap gap-2 text-xs font-mono text-retro-text">
                                            {recipe.prepTime && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 border border-black dark:border-white/30">⏱️ {recipe.prepTime}</span>}
                                            {recipe.calories && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 border border-black dark:border-white/30">🔥 {recipe.calories} cal</span>}
                                            {recipe.difficulty && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 border border-black dark:border-white/30">📊 {recipe.difficulty}</span>}
                                        </div>
                                    )}

                                    {recipe.isRaw ? (
                                        <pre className="whitespace-pre-wrap font-mono text-xs text-retro-text bg-gray-50 dark:bg-gray-900 p-3 border border-black dark:border-white/30">
                                            {recipe.rawContent}
                                        </pre>
                                    ) : (
                                        <>
                                            {/* Ingredients */}
                                            {recipe.ingredients && (
                                                <div className="bg-retro-accent/10 dark:bg-gray-700/50 p-2 border border-black dark:border-white/30">
                                                    <h4 className="font-bold text-xs uppercase mb-1 text-retro-text">📦 INGREDIENTS</h4>
                                                    <ul className="text-xs font-mono space-y-0.5 text-retro-text">
                                                        {recipe.ingredients.map((ing, i) => (
                                                            <li key={i}>• {ing}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Instructions */}
                                            {recipe.instructions && (
                                                <div className="p-2 border border-black dark:border-white/30">
                                                    <h4 className="font-bold text-xs uppercase mb-1 text-retro-text">📝 STEPS</h4>
                                                    <ol className="text-xs font-mono space-y-1 text-retro-text">
                                                        {recipe.instructions.map((step, i) => (
                                                            <li key={i} className="flex gap-2">
                                                                <span className="bg-retro-primary text-white w-4 h-4 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                                    {i + 1}
                                                                </span>
                                                                <span>{step}</span>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}

                                            {/* Nutrition Tip */}
                                            {recipe.nutritionTips && (
                                                <div className="bg-green-100 dark:bg-green-900/30 p-2 border border-green-600 text-xs">
                                                    <span className="font-bold text-green-800 dark:text-green-300">💡 </span>
                                                    <span className="text-green-700 dark:text-green-400 font-mono">{recipe.nutritionTips}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {recipe && (
                            <div className="p-3 bg-gray-100 dark:bg-gray-900 border-t-2 border-black dark:border-white/30">
                                <button
                                    onClick={() => {
                                        const text = recipe.isRaw
                                            ? recipe.rawContent
                                            : `${recipe.title}\n\nIngredients:\n${recipe.ingredients?.join('\n')}\n\nSteps:\n${recipe.instructions?.join('\n')}`;
                                        navigator.clipboard.writeText(text || '');
                                    }}
                                    className="w-full bg-retro-accent text-black border-2 border-black p-2 font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors"
                                >
                                    📋 COPY RECIPE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
