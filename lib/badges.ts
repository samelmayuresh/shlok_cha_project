// Badge definitions and unlock logic

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'streak' | 'water' | 'meals' | 'goals' | 'special';
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    currentStreak: number;
    longestStreak: number;
    totalDaysTracked: number;
    totalWaterGlasses: number;
    totalMealsLogged: number;
    totalGoalsCompleted: number;
    perfectDays: number; // Days with all meals + water goal
}

export const BADGES: Badge[] = [
    // Streak Badges
    {
        id: 'streak_3',
        name: 'Getting Started',
        description: 'Complete a 3-day streak',
        icon: '🌱',
        category: 'streak',
        condition: (stats) => stats.currentStreak >= 3 || stats.longestStreak >= 3,
    },
    {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Complete a 7-day streak',
        icon: '🔥',
        category: 'streak',
        condition: (stats) => stats.currentStreak >= 7 || stats.longestStreak >= 7,
    },
    {
        id: 'streak_14',
        name: 'Fortnight Fighter',
        description: 'Complete a 14-day streak',
        icon: '⚔️',
        category: 'streak',
        condition: (stats) => stats.currentStreak >= 14 || stats.longestStreak >= 14,
    },
    {
        id: 'streak_30',
        name: 'Monthly Master',
        description: 'Complete a 30-day streak',
        icon: '👑',
        category: 'streak',
        condition: (stats) => stats.currentStreak >= 30 || stats.longestStreak >= 30,
    },

    // Water Badges
    {
        id: 'water_50',
        name: 'Hydration Rookie',
        description: 'Log 50 glasses of water',
        icon: '💧',
        category: 'water',
        condition: (stats) => stats.totalWaterGlasses >= 50,
    },
    {
        id: 'water_200',
        name: 'Hydration Hero',
        description: 'Log 200 glasses of water',
        icon: '🌊',
        category: 'water',
        condition: (stats) => stats.totalWaterGlasses >= 200,
    },
    {
        id: 'water_500',
        name: 'Aqua Legend',
        description: 'Log 500 glasses of water',
        icon: '🐳',
        category: 'water',
        condition: (stats) => stats.totalWaterGlasses >= 500,
    },

    // Meal Badges
    {
        id: 'meals_25',
        name: 'Meal Tracker',
        description: 'Log 25 meals',
        icon: '🍽️',
        category: 'meals',
        condition: (stats) => stats.totalMealsLogged >= 25,
    },
    {
        id: 'meals_100',
        name: 'Nutrition Ninja',
        description: 'Log 100 meals',
        icon: '🥷',
        category: 'meals',
        condition: (stats) => stats.totalMealsLogged >= 100,
    },
    {
        id: 'meals_500',
        name: 'Diet Grandmaster',
        description: 'Log 500 meals',
        icon: '🏆',
        category: 'meals',
        condition: (stats) => stats.totalMealsLogged >= 500,
    },

    // Goals Badges
    {
        id: 'goals_10',
        name: 'Goal Getter',
        description: 'Complete 10 daily goals',
        icon: '🎯',
        category: 'goals',
        condition: (stats) => stats.totalGoalsCompleted >= 10,
    },
    {
        id: 'goals_50',
        name: 'Achievement Hunter',
        description: 'Complete 50 daily goals',
        icon: '⭐',
        category: 'goals',
        condition: (stats) => stats.totalGoalsCompleted >= 50,
    },

    // Special Badges
    {
        id: 'perfect_1',
        name: 'Perfect Day',
        description: 'Complete all meals and hit water goal in one day',
        icon: '✨',
        category: 'special',
        condition: (stats) => stats.perfectDays >= 1,
    },
    {
        id: 'perfect_7',
        name: 'Perfect Week',
        description: 'Have 7 perfect days',
        icon: '💎',
        category: 'special',
        condition: (stats) => stats.perfectDays >= 7,
    },
    {
        id: 'days_30',
        name: 'Dedicated Dieter',
        description: 'Track for 30 total days',
        icon: '📅',
        category: 'special',
        condition: (stats) => stats.totalDaysTracked >= 30,
    },
];

export function getUnlockedBadges(stats: UserStats): Badge[] {
    return BADGES.filter(badge => badge.condition(stats));
}

export function getLockedBadges(stats: UserStats): Badge[] {
    return BADGES.filter(badge => !badge.condition(stats));
}

export function checkForNewBadges(
    oldStats: UserStats,
    newStats: UserStats
): Badge[] {
    const oldUnlocked = new Set(getUnlockedBadges(oldStats).map(b => b.id));
    const newUnlocked = getUnlockedBadges(newStats);
    return newUnlocked.filter(badge => !oldUnlocked.has(badge.id));
}

export function calculateStatsFromProgress(progress: any[], todos: any[]): UserStats {
    let totalWater = 0;
    let totalMeals = 0;
    let perfectDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (const day of progress) {
        totalWater += day.water || 0;

        const mealsCompleted = Object.values(day.meals || {}).filter(Boolean).length;
        totalMeals += mealsCompleted;

        // Check for perfect day (all 4 meals + at least 8 glasses of water)
        if (mealsCompleted === 4 && (day.water || 0) >= 8) {
            perfectDays++;
        }

        // Calculate streaks
        if (day.completed) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    // Current streak is from the end
    for (let i = progress.length - 1; i >= 0; i--) {
        if (progress[i].completed) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Count completed todos
    const completedGoals = todos.filter((t: any) => t.completed).length;

    return {
        currentStreak,
        longestStreak,
        totalDaysTracked: progress.length,
        totalWaterGlasses: totalWater,
        totalMealsLogged: totalMeals,
        totalGoalsCompleted: completedGoals,
        perfectDays,
    };
}
