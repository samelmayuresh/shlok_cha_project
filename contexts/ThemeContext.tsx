'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    // Start with undefined to prevent hydration mismatch
    const [theme, setTheme] = useState<Theme | undefined>(undefined);

    useEffect(() => {
        // Run only on client
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Default to light if no preference
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        if (!theme) return; // Wait for mount

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.setProperty('--bg-primary', '#1a1a2e');
            root.style.setProperty('--bg-secondary', '#16213e');
            root.style.setProperty('--text-primary', '#eaeaea');
            root.style.setProperty('--text-secondary', '#a0a0a0');
        } else {
            root.classList.remove('dark');
            root.style.setProperty('--bg-primary', '#fdf6e3');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--text-primary', '#1D2B53');
            root.style.setProperty('--text-secondary', '#666666');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    // Prevent rendering children until theme is determined to avoid flash
    // OR render children but avoid theme-dependent UI flicker
    // For this context, we'll render children but know that 'theme' might be undefined briefly
    // which is fine as valid default global styles are already applied by globals.css

    return (
        <ThemeContext.Provider value={{
            theme: theme || 'light',
            toggleTheme,
            isDark: theme === 'dark'
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
