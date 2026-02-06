export default function Loading() {
    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24 flex flex-col items-center justify-center">
            <div className="bg-retro-paper border-4 border-retro-border p-8 shadow-retro text-center">
                {/* Retro Loading Animation */}
                <div className="mb-4 flex justify-center gap-2">
                    <div className="w-4 h-4 bg-retro-primary animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-4 h-4 bg-retro-secondary animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-4 h-4 bg-retro-accent animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>

                <div className="font-mono text-lg animate-pulse">
                    LOADING...
                </div>

                <div className="mt-4 w-48 h-4 bg-retro-bg border-2 border-retro-border mx-auto overflow-hidden">
                    <div className="h-full bg-retro-secondary animate-bounce"
                        style={{ width: '30%' }}></div>
                </div>

                <p className="mt-4 text-xs font-mono text-retro-muted">
                    PLEASE WAIT...
                </p>
            </div>
        </div>
    );
}
