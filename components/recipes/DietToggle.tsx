'use client';

interface DietToggleProps {
    value: 'non-veg' | 'vegan' | 'veg';
    onChange: (value: 'non-veg' | 'vegan' | 'veg') => void;
}

export default function DietToggle({ value, onChange }: DietToggleProps) {
    return (
        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-4 shadow-retro">
            <h3 className="text-xs font-bold uppercase mb-3 text-center text-retro-text">
                🍽️ DIET PREFERENCE
            </h3>
            <div className="flex justify-center">
                <div className="inline-flex border-2 border-black dark:border-white/30 overflow-hidden">
                    <button
                        onClick={() => onChange('non-veg')}
                        className={`px-4 py-2 font-bold text-sm uppercase transition-all flex items-center gap-1 ${value === 'non-veg'
                            ? 'bg-red-500 text-white'
                            : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-red-100 dark:hover:bg-red-900/30'
                            }`}
                    >
                        🍖 NON-VEG
                    </button>
                    <button
                        onClick={() => onChange('vegan')}
                        className={`px-4 py-2 font-bold text-sm uppercase transition-all flex items-center gap-1 border-x-2 border-black dark:border-white/30 ${value === 'vegan'
                            ? 'bg-green-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`}
                    >
                        🌱 VEGAN
                    </button>
                    <button
                        onClick={() => onChange('veg')}
                        className={`px-4 py-2 font-bold text-sm uppercase transition-all flex items-center gap-1 ${value === 'veg'
                            ? 'bg-green-500 text-white'
                            : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`}
                    >
                        🥬 VEG
                    </button>
                </div>
            </div>
            <p className="text-xs font-mono text-center text-retro-text opacity-60 mt-2">
                {value === 'non-veg' && 'Recipes may include meat, fish, eggs'}
                {value === 'vegan' && 'No animal products (plant-based only)'}
                {value === 'veg' && 'Vegetarian (eggs & dairy ok, no meat)'}
            </p>
        </div>
    );
}
