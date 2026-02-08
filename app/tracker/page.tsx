'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DietPlanDisplay from '@/components/DietPlanDisplay';
import RecipeButton from '@/components/RecipeButton';
import { useToast } from '@/components/Toast';

interface ActivePlan {
    goal: string;
    dietType: string;
    startDate: string;
    userDetails: Record<string, string>;
    planContent?: string;
}

interface DayProgress {
    date: string;
    meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
        snacks: boolean;
    };
    water: number;
    notes: string;
    completed: boolean;
    mood?: 'happy' | 'tired' | 'energetic' | 'neutral' | null;
    energy?: number; // 1-5 scale
}

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    category: 'meal' | 'exercise' | 'habit';
}

export default function TrackerPage() {
    const { showToast } = useToast();
    const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
    const [progress, setProgress] = useState<DayProgress[]>([]);
    const [todayProgress, setTodayProgress] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
        snacks: false,
    });
    const [waterCount, setWaterCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [showPlanDetails, setShowPlanDetails] = useState(false);
    const [todayMood, setTodayMood] = useState<'happy' | 'tired' | 'energetic' | 'neutral' | null>(null);
    const [todayEnergy, setTodayEnergy] = useState<number>(3);

    useEffect(() => {
        // Load active plan
        const savedPlan = localStorage.getItem('activePlan');
        if (savedPlan) {
            setActivePlan(JSON.parse(savedPlan));
        }

        // Load progress
        const savedProgress = localStorage.getItem('dietProgress');
        if (savedProgress) {
            const progressData: DayProgress[] = JSON.parse(savedProgress);
            setProgress(progressData);

            // Calculate streak
            let currentStreak = 0;
            for (let i = progressData.length - 1; i >= 0; i--) {
                if (progressData[i].completed) {
                    currentStreak++;
                } else {
                    break;
                }
            }
            setStreak(currentStreak);

            // Load today's data
            const today = new Date().toDateString();
            const todayEntry = progressData.find(p => p.date === today);
            if (todayEntry) {
                setTodayProgress(todayEntry.meals);
                setWaterCount(todayEntry.water || 0);
                setTodayMood(todayEntry.mood || null);
                setTodayEnergy(todayEntry.energy || 3);
            }
        }

        // Load todos
        const savedTodos = localStorage.getItem('dietTodos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    const saveProgress = (meals: typeof todayProgress, water: number, mood?: typeof todayMood, energy?: number) => {
        const today = new Date().toDateString();
        const allCompleted = meals.breakfast && meals.lunch && meals.dinner;

        const updatedProgress = [...progress];
        const todayIndex = updatedProgress.findIndex(p => p.date === today);

        // Preserve existing mood/energy if not provided
        const existingEntry = todayIndex >= 0 ? updatedProgress[todayIndex] : null;

        const dayData: DayProgress = {
            date: today,
            meals,
            water,
            notes: '',
            completed: allCompleted,
            mood: mood !== undefined ? mood : (existingEntry?.mood || null),
            energy: energy !== undefined ? energy : (existingEntry?.energy || 3),
        };

        if (todayIndex >= 0) {
            updatedProgress[todayIndex] = dayData;
        } else {
            updatedProgress.push(dayData);
        }

        setProgress(updatedProgress);
        localStorage.setItem('dietProgress', JSON.stringify(updatedProgress));
    };

    const toggleMeal = (meal: keyof typeof todayProgress) => {
        const wasChecked = todayProgress[meal];
        const newProgress = { ...todayProgress, [meal]: !wasChecked };
        setTodayProgress(newProgress);
        saveProgress(newProgress, waterCount);

        // Show toast
        const mealNames = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };
        if (!wasChecked) {
            const completedCount = Object.values(newProgress).filter(Boolean).length;
            if (completedCount === 4) {
                showToast('All meals completed! 🎉', 'success', '🏆');
            } else {
                showToast(`${mealNames[meal]} logged!`, 'success', '✓');
            }
        }
    };

    const addWater = () => {
        const newCount = waterCount + 1;
        setWaterCount(newCount);
        saveProgress(todayProgress, newCount);

        if (newCount === 8) {
            showToast('Hydration goal reached! 💧', 'success', '🎯');
        } else {
            showToast(`Glass ${newCount} logged!`, 'info', '💧');
        }
    };

    const handleMoodChange = (mood: 'happy' | 'tired' | 'energetic' | 'neutral') => {
        setTodayMood(mood);
        saveProgress(todayProgress, waterCount, mood, todayEnergy);
    };

    const handleEnergyChange = (energy: number) => {
        setTodayEnergy(energy);
        saveProgress(todayProgress, waterCount, todayMood, energy);
    };

    const getDaysActive = () => {
        if (!activePlan) return 0;
        const start = new Date(activePlan.startDate);
        const now = new Date();
        return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    const getCompletionPercent = () => {
        const completed = Object.values(todayProgress).filter(Boolean).length;
        return Math.round((completed / 4) * 100);
    };

    // Calendar functions
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getDayStatus = (day: number): 'complete' | 'partial' | 'missed' | 'future' | 'none' => {
        const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkDate > today) return 'future';

        const dayProgress = progress.find(p => p.date === checkDate.toDateString());
        if (!dayProgress) {
            if (checkDate < new Date(activePlan?.startDate || today)) return 'none';
            return 'missed';
        }
        return dayProgress.completed ? 'complete' : 'partial';
    };

    // Todo functions
    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const todo: TodoItem = {
            id: Date.now().toString(),
            text: newTodo,
            completed: false,
            category: 'habit',
        };

        const updatedTodos = [...todos, todo];
        setTodos(updatedTodos);
        localStorage.setItem('dietTodos', JSON.stringify(updatedTodos));
        setNewTodo('');
    };

    const toggleTodo = (id: string) => {
        const updatedTodos = todos.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTodos(updatedTodos);
        localStorage.setItem('dietTodos', JSON.stringify(updatedTodos));
    };

    const deleteTodo = (id: string) => {
        const updatedTodos = todos.filter(t => t.id !== id);
        setTodos(updatedTodos);
        localStorage.setItem('dietTodos', JSON.stringify(updatedTodos));
    };

    const clearPlan = () => {
        localStorage.removeItem('activePlan');
        localStorage.removeItem('dietProgress');
        localStorage.removeItem('dietTodos');
        setActivePlan(null);
        setProgress([]);
        setTodayProgress({ breakfast: false, lunch: false, dinner: false, snacks: false });
        setWaterCount(0);
        setStreak(0);
        setTodos([]);
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            <div>
                                <h1 className="text-xl font-bold uppercase text-retro-text">TRACKER</h1>
                                <p className="text-xs font-mono text-retro-text opacity-70">Progress Monitor</p>
                            </div>
                        </div>
                        {activePlan && (
                            <button
                                onClick={clearPlan}
                                className="text-xs bg-red-500 text-white px-2 py-1 border-2 border-black hover:bg-red-600"
                            >
                                RESET
                            </button>
                        )}
                    </div>
                </div>

                {!activePlan ? (
                    /* No Active Plan */
                    <div className="bg-retro-paper dark:bg-gray-800 border-4 border-dashed border-black dark:border-white/50 p-8 text-center animate-bounce-in">
                        <div className="text-5xl mb-3">🎯</div>
                        <h2 className="text-lg font-bold uppercase mb-2 text-retro-text">NO ACTIVE PLAN</h2>
                        <p className="font-mono text-xs text-retro-text mb-4">
                            Create a diet plan with AI to begin tracking
                        </p>
                        <Link
                            href="/chat"
                            className="inline-block bg-retro-primary text-white border-2 border-black px-4 py-2 font-bold uppercase hover:bg-black transition-colors text-sm hover-lift"
                        >
                            💬 CREATE PLAN
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { value: getDaysActive(), label: 'DAYS', bg: 'bg-retro-accent', delay: 0.1 },
                                { value: `${streak}🔥`, label: 'STREAK', bg: 'bg-medical-light', delay: 0.15 },
                                { value: `${getCompletionPercent()}%`, label: 'TODAY', bg: 'bg-fitness-light', delay: 0.2 },
                                { value: `${waterCount}💧`, label: 'WATER', bg: 'bg-athletic-light', delay: 0.25 },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`${stat.bg} border-2 border-black p-2 text-center animate-scale-in`}
                                    style={{ animationDelay: `${stat.delay}s`, opacity: 0, animationFillMode: 'forwards' }}
                                >
                                    <div className="text-xl font-bold text-black">{stat.value}</div>
                                    <div className="text-xs font-mono text-black">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Today's Meals */}
                        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-sm font-bold uppercase mb-3 bg-black text-white inline-block px-2 py-1">
                                TODAY'S MEALS
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { key: 'breakfast', icon: '🍳', label: 'BREAKFAST', recipe: 'Healthy Breakfast' },
                                    { key: 'lunch', icon: '🥗', label: 'LUNCH', recipe: 'Healthy Lunch' },
                                    { key: 'dinner', icon: '🍽️', label: 'DINNER', recipe: 'Healthy Dinner' },
                                    { key: 'snacks', icon: '🍎', label: 'SNACKS', recipe: 'Healthy Snacks' },
                                ].map((meal) => (
                                    <div key={meal.key} className="flex gap-1">
                                        <button
                                            onClick={() => toggleMeal(meal.key as keyof typeof todayProgress)}
                                            className={`flex-1 p-2 border-2 border-black flex items-center gap-2 transition-all ${todayProgress[meal.key as keyof typeof todayProgress]
                                                ? 'bg-retro-accent text-black'
                                                : 'bg-white dark:bg-gray-700 text-black dark:text-white'
                                                }`}
                                        >
                                            <span className="text-lg">{meal.icon}</span>
                                            <span className="text-xs font-bold flex-1 text-left">{meal.label}</span>
                                            {todayProgress[meal.key as keyof typeof todayProgress] && (
                                                <span className="text-green-600 text-xs">✓</span>
                                            )}
                                        </button>
                                        <RecipeButton foodItem={meal.recipe} dietContext={activePlan?.goal} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={addWater}
                                    className="flex-1 bg-blue-400 text-black border-2 border-black p-2 font-bold text-xs hover:bg-blue-500"
                                >
                                    💧 +1 WATER
                                </button>
                                <button
                                    onClick={() => setShowPlanDetails(!showPlanDetails)}
                                    className="flex-1 bg-retro-secondary text-white border-2 border-black p-2 font-bold text-xs hover:bg-black"
                                >
                                    📋 VIEW PLAN
                                </button>
                            </div>
                        </div>

                        {/* Mood & Energy Tracker */}
                        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro">
                            <h2 className="text-sm font-bold uppercase mb-3 bg-purple-500 text-white inline-block px-2 py-1">
                                ⚡ MOOD & ENERGY
                            </h2>

                            {/* Mood Selection */}
                            <div className="mb-3">
                                <p className="text-xs font-mono text-retro-text mb-2">How are you feeling today?</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { key: 'happy', icon: '😊', label: 'Happy' },
                                        { key: 'energetic', icon: '⚡', label: 'Energetic' },
                                        { key: 'tired', icon: '😴', label: 'Tired' },
                                        { key: 'neutral', icon: '😐', label: 'Neutral' },
                                    ].map((mood) => (
                                        <button
                                            key={mood.key}
                                            onClick={() => handleMoodChange(mood.key as 'happy' | 'tired' | 'energetic' | 'neutral')}
                                            className={`p-2 border-2 border-black text-center transition-all ${todayMood === mood.key
                                                ? 'bg-purple-400 text-black shadow-none translate-y-0.5'
                                                : 'bg-white dark:bg-gray-700 shadow-retro-sm hover:translate-y-0.5 hover:shadow-none'
                                                }`}
                                        >
                                            <span className="text-xl block">{mood.icon}</span>
                                            <span className="text-[10px] font-bold">{mood.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Energy Level */}
                            <div>
                                <p className="text-xs font-mono text-retro-text mb-2">Energy Level: {todayEnergy}/5</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => handleEnergyChange(level)}
                                            className={`flex-1 h-8 border-2 border-black transition-all ${level <= todayEnergy
                                                ? 'bg-gradient-to-t from-yellow-400 to-yellow-300'
                                                : 'bg-gray-200 dark:bg-gray-600'
                                                }`}
                                            title={`Energy level ${level}`}
                                        >
                                            {level <= todayEnergy && '⚡'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Plan Details Modal */}
                        {showPlanDetails && activePlan.planContent && (
                            <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-bold uppercase bg-retro-primary text-white px-2 py-1">
                                        📋 YOUR DIET PLAN
                                    </h3>
                                    <button
                                        onClick={() => setShowPlanDetails(false)}
                                        className="bg-red-500 text-white px-2 py-1 text-xs font-bold border-2 border-black hover:bg-red-600"
                                    >
                                        ✕ CLOSE
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <DietPlanDisplay content={activePlan.planContent} />
                                </div>
                            </div>
                        )}

                        {/* Calendar */}
                        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro">
                            <div className="flex justify-between items-center mb-3">
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    className="bg-black text-white px-2 py-1 text-xs"
                                >
                                    ◀
                                </button>
                                <h3 className="font-bold text-retro-text text-sm">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    className="bg-black text-white px-2 py-1 text-xs"
                                >
                                    ▶
                                </button>
                            </div>

                            {/* Day labels */}
                            <div className="grid grid-cols-7 gap-1 mb-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <div key={i} className="text-center text-xs font-bold text-retro-text opacity-60">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square"></div>
                                ))}
                                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                                    const day = i + 1;
                                    const status = getDayStatus(day);
                                    const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

                                    return (
                                        <div
                                            key={day}
                                            className={`aspect-square flex items-center justify-center text-xs font-bold border
                                                ${isToday ? 'border-2 border-retro-primary' : 'border-black/20'}
                                                ${status === 'complete' ? 'bg-green-400 text-black' : ''}
                                                ${status === 'partial' ? 'bg-yellow-400 text-black' : ''}
                                                ${status === 'missed' ? 'bg-red-300 text-black' : ''}
                                                ${status === 'future' || status === 'none' ? 'bg-gray-100 dark:bg-gray-700 text-retro-text' : ''}
                                            `}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex gap-2 mt-2 text-xs justify-center">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 border border-black"></span>Done</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 border border-black"></span>Partial</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 border border-black"></span>Missed</span>
                            </div>
                        </div>

                        {/* Todo List */}
                        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro">
                            <h3 className="text-sm font-bold uppercase mb-3 bg-black text-white inline-block px-2 py-1">
                                📝 DAILY GOALS
                            </h3>

                            {/* Add todo form */}
                            <form onSubmit={addTodo} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newTodo}
                                    onChange={(e) => setNewTodo(e.target.value)}
                                    placeholder="Add a goal..."
                                    className="flex-1 bg-white border-2 border-black p-2 text-xs font-mono"
                                />
                                <button
                                    type="submit"
                                    className="bg-retro-accent text-black border-2 border-black px-3 font-bold text-xs"
                                >
                                    +
                                </button>
                            </form>

                            {/* Todo items */}
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {todos.length === 0 ? (
                                    <p className="text-xs text-retro-text opacity-60 text-center py-2">
                                        No goals yet. Add some above!
                                    </p>
                                ) : (
                                    todos.map((todo) => (
                                        <div
                                            key={todo.id}
                                            className={`flex items-center gap-2 p-2 border-2 border-black text-xs ${todo.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-gray-700'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleTodo(todo.id)}
                                                className={`w-5 h-5 border-2 border-black flex items-center justify-center ${todo.completed ? 'bg-green-500 text-white' : 'bg-white'
                                                    }`}
                                            >
                                                {todo.completed && '✓'}
                                            </button>
                                            <span className={`flex-1 ${todo.completed ? 'line-through opacity-60' : ''} text-black dark:text-white`}>
                                                {todo.text}
                                            </span>
                                            <button
                                                onClick={() => deleteTodo(todo.id)}
                                                className="text-red-500 font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            <Link
                                href="/chat"
                                className="flex-1 bg-retro-secondary text-white border-2 border-black p-2 text-center font-bold text-xs hover:bg-black transition-colors"
                            >
                                💬 MODIFY PLAN
                            </Link>
                            <button
                                onClick={() => {
                                    const allTrue = { breakfast: true, lunch: true, dinner: true, snacks: true };
                                    setTodayProgress(allTrue);
                                    saveProgress(allTrue, waterCount);
                                }}
                                className="flex-1 bg-retro-accent text-black border-2 border-black p-2 text-center font-bold text-xs hover:bg-black hover:text-white transition-colors"
                            >
                                ✅ COMPLETE DAY
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
