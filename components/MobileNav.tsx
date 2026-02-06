'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'HOME', path: '/', icon: '🏠', ariaLabel: 'Go to home page' },
        { name: 'LIST', path: '/categories', icon: '📁', ariaLabel: 'Browse diet plan categories' },
        { name: 'TRACKER', path: '/tracker', icon: '�', ariaLabel: 'Track your progress' },
        { name: 'USER', path: '/profile', icon: '👤', ariaLabel: 'View your profile' },
    ];

    return (
        <nav
            className="bg-retro-paper/80 backdrop-blur-xl border-t-4 border-black/10 dark:border-white/10 px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-colors duration-300"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="flex justify-between items-stretch gap-2 h-14" role="menubar">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            role="menuitem"
                            aria-label={item.ariaLabel}
                            aria-current={isActive ? 'page' : undefined}
                            className={`
                  flex-1 flex flex-col items-center justify-center
                  border-2 transition-all backdrop-blur-sm rounded-sm
                  focus:outline-none focus:ring-2 focus:ring-retro-primary focus:ring-offset-2
                  ${isActive
                                    ? 'bg-retro-secondary text-white border-retro-secondary shadow-none translate-y-0.5'
                                    : 'bg-retro-paper/50 text-retro-text border-retro-border/50 shadow-retro-sm hover:translate-y-0.5 hover:shadow-none'
                                }
                `}
                        >
                            <span className="text-xl mb-0.5 drop-shadow-sm" aria-hidden="true">{item.icon}</span>
                            <span className="text-xs font-bold tracking-wider drop-shadow-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
