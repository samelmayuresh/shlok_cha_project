'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
    _count: { messages: number };
}

export default function ChatHistoryList() {
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                if (data.history) setHistory(data.history);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center p-4 font-mono animate-pulse">LOADING_MEMORY_BANKS...</div>;

    if (history.length === 0) {
        return (
            <div className="font-mono text-center p-4 border-2 border-dashed border-black/30 text-gray-500">
                NO_ARCHIVED_DATA
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar p-1">
            {history.map(session => (
                <Link
                    key={session.id}
                    href={`/chat?id=${session.id}`}
                    className="block bg-white dark:bg-gray-700 border-2 border-black dark:border-white/30 p-3 shadow-retro-sm hover:translate-x-1 hover:bg-yellow-50 dark:hover:bg-gray-600 transition-all"
                >
                    <div className="flex justify-between items-start">
                        <span className="font-bold text-sm line-clamp-1">{session.title}</span>
                        <span className="text-xs font-mono bg-black text-white px-1 ml-2">
                            {session._count.messages} MSG
                        </span>
                    </div>
                    <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                </Link>
            ))}
        </div>
    );
}
