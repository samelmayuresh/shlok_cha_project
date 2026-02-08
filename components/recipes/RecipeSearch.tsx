'use client';

interface RecipeSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    loading: boolean;
    hasImage: boolean;
    onSuggestionClick: (suggestion: string) => void;
}

export default function RecipeSearch({
    searchQuery,
    setSearchQuery,
    handleSearch,
    loading,
    hasImage,
    onSuggestionClick
}: RecipeSearchProps) {
    const quickSuggestions = [
        '🥗 Healthy Salad',
        '🍳 Protein Breakfast',
        '🥣 Oatmeal Bowl',
        '🍗 Grilled Chicken',
        '🥤 Green Smoothie',
        '🍲 Vegetable Soup',
    ];

    return (
        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-4 shadow-retro">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a healthy recipe..."
                    className="flex-1 bg-white dark:bg-gray-700 border-2 border-black dark:border-white/30 p-3 font-mono text-sm text-black dark:text-white placeholder:text-gray-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || (!searchQuery.trim() && !hasImage)}
                    className="bg-retro-primary text-white border-2 border-black px-6 font-bold uppercase text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '...' : '🔍 SEARCH'}
                </button>
            </form>

            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => onSuggestionClick(suggestion)}
                        disabled={loading}
                        className="text-xs bg-retro-accent/20 dark:bg-gray-700 border border-black dark:border-white/30 px-2 py-1 font-mono hover:bg-retro-accent transition-colors text-black dark:text-white disabled:opacity-50"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
}
