'use client';

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

interface RecipeCardProps {
    recipe: Recipe;
    onNewSearch: () => void;
    onCopy: () => void;
}

export default function RecipeCard({ recipe, onNewSearch, onCopy }: RecipeCardProps) {
    return (
        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 shadow-retro overflow-hidden">
            {/* Recipe Header */}
            <div className="bg-retro-primary p-4">
                <h2 className="text-xl font-bold uppercase text-white">{recipe.title}</h2>
                {!recipe.isRaw && (
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/90 font-mono">
                        {recipe.prepTime && <span>⏱️ Prep: {recipe.prepTime}</span>}
                        {recipe.cookTime && <span>🍳 Cook: {recipe.cookTime}</span>}
                        {recipe.servings && <span>👥 Serves: {recipe.servings}</span>}
                        {recipe.calories && <span>🔥 {recipe.calories} cal</span>}
                        {recipe.difficulty && <span>📊 {recipe.difficulty}</span>}
                    </div>
                )}
            </div>

            {recipe.isRaw ? (
                /* Raw Content Display */
                <div className="p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-retro-text">
                        {recipe.rawContent}
                    </pre>
                </div>
            ) : (
                <div className="p-4 space-y-4">
                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {recipe.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-retro-accent/30 dark:bg-gray-700 px-2 py-0.5 border border-black dark:border-white/30 font-mono text-black dark:text-white"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Ingredients */}
                    {recipe.ingredients && (
                        <div className="bg-retro-accent/10 dark:bg-gray-700/50 border-2 border-black dark:border-white/30 p-3">
                            <h3 className="font-bold uppercase text-sm mb-2 text-retro-text">📦 INGREDIENTS</h3>
                            <ul className="space-y-1">
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li key={i} className="text-sm font-mono flex items-start gap-2 text-retro-text">
                                        <span className="text-retro-primary">•</span>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Instructions */}
                    {recipe.instructions && (
                        <div className="border-2 border-black dark:border-white/30 p-3">
                            <h3 className="font-bold uppercase text-sm mb-2 text-retro-text">📝 INSTRUCTIONS</h3>
                            <ol className="space-y-2">
                                {recipe.instructions.map((step, i) => (
                                    <li key={i} className="text-sm font-mono flex items-start gap-2 text-retro-text">
                                        <span className="bg-retro-primary text-white w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Nutrition Tips */}
                    {recipe.nutritionTips && (
                        <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-600 p-3">
                            <h3 className="font-bold uppercase text-sm mb-1 text-green-800 dark:text-green-300">💡 NUTRITION TIP</h3>
                            <p className="text-sm font-mono text-green-700 dark:text-green-400">{recipe.nutritionTips}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="p-4 bg-gray-100 dark:bg-gray-900 border-t-2 border-black dark:border-white/30 flex gap-2">
                <button
                    onClick={onNewSearch}
                    className="flex-1 bg-retro-secondary text-white border-2 border-black p-2 font-bold text-xs uppercase hover:bg-black transition-colors"
                >
                    🔍 NEW SEARCH
                </button>
                <button
                    onClick={onCopy}
                    className="flex-1 bg-retro-accent text-black border-2 border-black p-2 font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors"
                >
                    📋 COPY RECIPE
                </button>
            </div>
        </div>
    );
}
