'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    icon?: string;
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type'], icon?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'success', icon?: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type, icon }]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            toast-enter pointer-events-auto
                            flex items-center gap-2 px-4 py-3 
                            border-2 border-black shadow-retro
                            font-mono text-sm font-bold
                            cursor-pointer
                            ${toast.type === 'success' ? 'bg-retro-accent text-black' : ''}
                            ${toast.type === 'info' ? 'bg-retro-secondary text-white' : ''}
                            ${toast.type === 'warning' ? 'bg-yellow-400 text-black' : ''}
                            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
                        `}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="text-lg">{toast.icon || (
                            toast.type === 'success' ? '✓' :
                                toast.type === 'info' ? 'ℹ' :
                                    toast.type === 'warning' ? '⚠' : '✕'
                        )}</span>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
