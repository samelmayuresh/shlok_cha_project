'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service (e.g., Sentry)
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24 flex flex-col items-center justify-center">
            <div className="bg-retro-paper border-4 border-retro-primary p-8 shadow-retro max-w-md w-full">
                {/* Error Header */}
                <div className="bg-retro-primary text-white px-4 py-2 -mt-8 -mx-8 mb-6 border-b-4 border-black">
                    <div className="flex items-center gap-2 font-bold">
                        <span className="text-2xl">⚠️</span>
                        <span className="uppercase tracking-wide">SYSTEM ERROR</span>
                    </div>
                </div>

                {/* Error Message */}
                <div className="font-mono text-center mb-6">
                    <div className="text-4xl mb-2">💥</div>
                    <h1 className="text-xl font-bold uppercase mb-2">
                        FATAL_ERROR_DETECTED
                    </h1>
                    <p className="text-sm text-retro-muted">
                        An unexpected error has occurred.<br />
                        The system will attempt recovery.
                    </p>
                </div>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-black text-green-400 p-3 font-mono text-xs mb-6 border-2 border-gray-600 overflow-auto max-h-32">
                        <div className="text-red-400 mb-1">ERROR_LOG:</div>
                        {error.message}
                        {error.digest && (
                            <div className="mt-2 text-gray-500">
                                Digest: {error.digest}
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-retro-secondary text-white border-2 border-black p-3 font-bold uppercase shadow-retro hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1"
                    >
                        🔄 RETRY OPERATION
                    </button>

                    <Link
                        href="/"
                        className="w-full bg-white text-retro-text border-2 border-black p-3 font-bold uppercase text-center shadow-retro-sm hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        🏠 RETURN TO HOME
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center font-mono text-xs text-retro-muted">
                    ERROR_CODE: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}
                </div>
            </div>
        </div>
    );
}
