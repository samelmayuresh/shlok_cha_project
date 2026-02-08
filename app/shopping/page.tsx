'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ShoppingItem {
    id: string;
    name: string;
    category: string;
    checked: boolean;
}

const INGREDIENT_CATEGORIES: Record<string, string> = {
    // Proteins
    'chicken': 'Proteins', 'fish': 'Proteins', 'eggs': 'Proteins', 'tofu': 'Proteins',
    'paneer': 'Proteins', 'beef': 'Proteins', 'lamb': 'Proteins', 'prawns': 'Proteins',
    'dal': 'Proteins', 'lentils': 'Proteins', 'chickpeas': 'Proteins', 'beans': 'Proteins',
    // Vegetables
    'spinach': 'Vegetables', 'broccoli': 'Vegetables', 'carrot': 'Vegetables', 'tomato': 'Vegetables',
    'onion': 'Vegetables', 'garlic': 'Vegetables', 'ginger': 'Vegetables', 'potato': 'Vegetables',
    'capsicum': 'Vegetables', 'cucumber': 'Vegetables', 'lettuce': 'Vegetables', 'cabbage': 'Vegetables',
    // Fruits
    'apple': 'Fruits', 'banana': 'Fruits', 'orange': 'Fruits', 'mango': 'Fruits',
    'berries': 'Fruits', 'grapes': 'Fruits', 'papaya': 'Fruits', 'watermelon': 'Fruits',
    // Dairy
    'milk': 'Dairy', 'yogurt': 'Dairy', 'cheese': 'Dairy', 'butter': 'Dairy', 'curd': 'Dairy',
    // Grains
    'rice': 'Grains', 'oats': 'Grains', 'bread': 'Grains', 'wheat': 'Grains', 'roti': 'Grains',
    'quinoa': 'Grains', 'pasta': 'Grains', 'noodles': 'Grains',
    // Others
    'oil': 'Pantry', 'salt': 'Pantry', 'pepper': 'Pantry', 'honey': 'Pantry', 'nuts': 'Pantry',
};

function categorizeIngredient(name: string): string {
    const lower = name.toLowerCase();
    for (const [keyword, category] of Object.entries(INGREDIENT_CATEGORIES)) {
        if (lower.includes(keyword)) return category;
    }
    return 'Other';
}

function extractIngredientsFromPlan(planContent: string): ShoppingItem[] {
    const items: ShoppingItem[] = [];
    const seen = new Set<string>();

    // Match common ingredient patterns
    const lines = planContent.split('\n');
    for (const line of lines) {
        // Skip headers and non-food lines
        if (line.startsWith('#') || line.includes('Day') || line.includes('Tip')) continue;

        // Extract food items (words after bullets, dashes, or in meal descriptions)
        const foodMatches = line.match(/[-•*]\s*(.+)|:\s*(.+)/);
        if (foodMatches) {
            const text = foodMatches[1] || foodMatches[2] || '';
            // Split by common separators
            const parts = text.split(/[,;+&]|with|and/i);
            for (const part of parts) {
                const cleaned = part.trim().replace(/^\d+\s*(g|ml|oz|cups?|tbsp|tsp)?\s*/i, '').trim();
                if (cleaned.length > 2 && cleaned.length < 50 && !seen.has(cleaned.toLowerCase())) {
                    seen.add(cleaned.toLowerCase());
                    items.push({
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        name: cleaned,
                        category: categorizeIngredient(cleaned),
                        checked: false,
                    });
                }
            }
        }
    }

    return items;
}

export default function ShoppingPage() {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [newItem, setNewItem] = useState('');
    const [hasPlan, setHasPlan] = useState(false);

    useEffect(() => {
        // Load saved shopping list
        const savedList = localStorage.getItem('shoppingList');
        if (savedList) {
            setItems(JSON.parse(savedList));
        }

        // Check for active plan
        const activePlan = localStorage.getItem('activePlan');
        if (activePlan) {
            setHasPlan(true);
            // Only auto-generate if no saved list exists
            if (!savedList) {
                const plan = JSON.parse(activePlan);
                if (plan.planContent) {
                    const extracted = extractIngredientsFromPlan(plan.planContent);
                    setItems(extracted);
                    localStorage.setItem('shoppingList', JSON.stringify(extracted));
                }
            }
        }
    }, []);

    const saveItems = (newItems: ShoppingItem[]) => {
        setItems(newItems);
        localStorage.setItem('shoppingList', JSON.stringify(newItems));
    };

    const toggleItem = (id: string) => {
        const updated = items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        saveItems(updated);
    };

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const item: ShoppingItem = {
            id: Date.now().toString(),
            name: newItem.trim(),
            category: categorizeIngredient(newItem),
            checked: false,
        };
        saveItems([...items, item]);
        setNewItem('');
    };

    const deleteItem = (id: string) => {
        saveItems(items.filter(item => item.id !== id));
    };

    const clearCompleted = () => {
        saveItems(items.filter(item => !item.checked));
    };

    const regenerateFromPlan = () => {
        const activePlan = localStorage.getItem('activePlan');
        if (activePlan) {
            const plan = JSON.parse(activePlan);
            if (plan.planContent) {
                const extracted = extractIngredientsFromPlan(plan.planContent);
                saveItems(extracted);
            }
        }
    };

    const copyList = () => {
        const unchecked = items.filter(i => !i.checked);
        const text = unchecked.map(i => `☐ ${i.name}`).join('\n');
        navigator.clipboard.writeText(text);
    };

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, ShoppingItem[]>);

    const completedCount = items.filter(i => i.checked).length;
    const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🛒</span>
                            <div>
                                <h1 className="text-xl font-bold uppercase text-retro-text">SHOPPING LIST</h1>
                                <p className="text-xs font-mono text-retro-text opacity-70">Auto-generated from your plan</p>
                            </div>
                        </div>
                        {items.length > 0 && (
                            <div className="text-right">
                                <div className="text-lg font-bold text-retro-primary">{progress}%</div>
                                <div className="text-xs font-mono text-retro-text">{completedCount}/{items.length}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {items.length > 0 && (
                    <div className="bg-white dark:bg-gray-700 border-2 border-black h-4">
                        <div
                            className="h-full bg-retro-accent transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {/* Add Item Form */}
                <form onSubmit={addItem} className="flex gap-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add item..."
                        className="flex-1 bg-white border-2 border-black p-2 text-sm font-mono"
                    />
                    <button
                        type="submit"
                        className="bg-retro-accent text-black border-2 border-black px-4 font-bold text-sm"
                    >
                        + ADD
                    </button>
                </form>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {hasPlan && (
                        <button
                            onClick={regenerateFromPlan}
                            className="bg-retro-secondary text-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-black"
                        >
                            🔄 REGENERATE
                        </button>
                    )}
                    {completedCount > 0 && (
                        <button
                            onClick={clearCompleted}
                            className="bg-red-500 text-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-red-600"
                        >
                            🗑️ CLEAR DONE ({completedCount})
                        </button>
                    )}
                    {items.length > 0 && (
                        <button
                            onClick={copyList}
                            className="bg-blue-500 text-white border-2 border-black px-3 py-1 text-xs font-bold hover:bg-blue-600"
                        >
                            📋 COPY LIST
                        </button>
                    )}
                </div>

                {/* Shopping List */}
                {items.length === 0 ? (
                    <div className="bg-retro-paper dark:bg-gray-800 border-4 border-dashed border-black dark:border-white/50 p-8 text-center">
                        <div className="text-5xl mb-3">🛒</div>
                        <h2 className="text-lg font-bold uppercase mb-2 text-retro-text">LIST IS EMPTY</h2>
                        <p className="font-mono text-xs text-retro-text mb-4">
                            {hasPlan
                                ? 'Click "REGENERATE" to extract items from your diet plan'
                                : 'Create a diet plan first, or add items manually'}
                        </p>
                        {!hasPlan && (
                            <Link
                                href="/chat"
                                className="inline-block bg-retro-primary text-white border-2 border-black px-4 py-2 font-bold uppercase hover:bg-black transition-colors text-sm"
                            >
                                💬 CREATE PLAN
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(groupedItems).map(([category, categoryItems]) => (
                            <div key={category} className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro">
                                <h3 className="text-sm font-bold uppercase mb-2 bg-black text-white inline-block px-2 py-1">
                                    {category === 'Proteins' && '🥩 '}
                                    {category === 'Vegetables' && '🥬 '}
                                    {category === 'Fruits' && '🍎 '}
                                    {category === 'Dairy' && '🥛 '}
                                    {category === 'Grains' && '🌾 '}
                                    {category === 'Pantry' && '🫙 '}
                                    {category === 'Other' && '📦 '}
                                    {category}
                                </h3>
                                <div className="space-y-1">
                                    {categoryItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-2 p-2 border-2 border-black text-sm ${item.checked ? 'bg-green-100 dark:bg-green-900/30' : 'bg-white dark:bg-gray-700'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleItem(item.id)}
                                                className={`w-5 h-5 border-2 border-black flex items-center justify-center flex-shrink-0 ${item.checked ? 'bg-green-500 text-white' : 'bg-white'
                                                    }`}
                                            >
                                                {item.checked && '✓'}
                                            </button>
                                            <span className={`flex-1 ${item.checked ? 'line-through opacity-60' : ''} text-black dark:text-white`}>
                                                {item.name}
                                            </span>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="text-red-500 font-bold text-xs hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back Link */}
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
