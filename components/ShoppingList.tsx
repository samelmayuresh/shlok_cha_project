'use client';

import { useState, useMemo } from 'react';

interface ShoppingListProps {
    meals: any[]; // Using any primarily because structure varies, but ideally distinct
    planTitle: string;
}

export default function ShoppingList({ meals, planTitle }: ShoppingListProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Extract unique ingredients logic
    const shoppingItems = useMemo(() => {
        const ingredients = new Set<string>();

        meals.forEach(meal => {
            if (Array.isArray(meal.items)) {
                meal.items.forEach((item: string) => {
                    // Basic cleanup: remove quantities if loosely structured (e.g. "2 eggs" -> "eggs")
                    // For now, keeping raw string to ensure accuracy
                    ingredients.add(item.replace(/[*_]/g, '').trim());
                });
            }
        });

        return Array.from(ingredients).sort();
    }, [meals]);

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleItem = (item: string) => {
        setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-4 bg-retro-secondary text-white border-2 border-black p-3 font-mono hover:bg-opacity-90 transition-all shadow-retro-sm flex items-center justify-center gap-2"
            >
                <span>🛒</span> GENERATE_SHOPPING_LIST
            </button>
        );
    }

    return (
        <div className="mt-6 bg-retro-paper dark:bg-gray-800 border-2 border-black p-4 shadow-retro-sm animation-slide-up">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                <h3 className="font-bold font-mono text-lg">SHOPPING_LIST.txt</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-red-500 hover:bg-black hover:text-white px-2 font-mono"
                >
                    [X] BOOT_DOWN
                </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {shoppingItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => toggleItem(item)}
                        className={`
                            cursor-pointer p-2 flex items-center gap-3 border border-black/10 hover:bg-black/5 transition-colors
                            ${checkedItems[item] ? 'opacity-50 line-through bg-gray-100 dark:bg-gray-900' : ''}
                        `}
                    >
                        <div className={`
                            w-5 h-5 border-2 border-black flex items-center justify-center
                            ${checkedItems[item] ? 'bg-black' : 'bg-white'}
                        `}>
                            {checkedItems[item] && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="font-mono">{item}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-dashed border-black/30 text-center font-mono text-xs text-gray-500">
                Total Items: {shoppingItems.length} | Checked: {Object.values(checkedItems).filter(Boolean).length}
            </div>

            <button
                onClick={() => {
                    const text = `SHOPPING LIST for ${planTitle}\n\n` + shoppingItems.map(i => `[ ] ${i}`).join('\n');
                    navigator.clipboard.writeText(text);
                    alert('List copied to clipboard!');
                }}
                className="w-full mt-4 bg-black text-white p-2 font-mono text-sm hover:bg-gray-800 transition-colors"
            >
                COPY_TO_CLIPBOARD
            </button>
        </div>
    );
}
