export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-6 shadow-retro mb-6">
                    <div className="text-center">
                        <div className="inline-block bg-retro-secondary text-white border-4 border-black p-4 mb-4">
                            <span className="text-6xl">👤</span>
                        </div>
                        <h1 className="text-3xl font-bold uppercase mb-2 text-retro-text">USER_PROFILE</h1>
                        <p className="font-mono text-sm text-retro-text">
                            Authentication system under development
                        </p>
                    </div>
                </div>

                {/* Status Box */}
                <div className="bg-black text-green-400 p-4 font-mono border-4 border-gray-600 mb-6">
                    <div className="mb-2 border-b border-green-800 pb-1">SYSTEM_STATUS</div>
                    <div className="text-sm">
                        <div>AUTH_MODULE: <span className="text-yellow-400">IN_PROGRESS</span></div>
                        <div>USER_DATA: <span className="text-yellow-400">PENDING</span></div>
                        <div>PROFILE_SYNC: <span className="text-yellow-400">WAITING</span></div>
                    </div>
                </div>

                {/* Features Card */}
                <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-6 shadow-retro">
                    <h2 className="text-xl font-bold uppercase mb-4 bg-black text-white inline-block px-3 py-1">
                        PLANNED_FEATURES
                    </h2>
                    <ul className="space-y-3 font-mono text-retro-text">
                        <li className="flex items-center gap-3 p-2 bg-medical-light dark:bg-gray-700 border-2 border-black dark:border-white/30">
                            <span className="text-xl">💾</span>
                            <span className="text-black dark:text-white">Save favorite diet plans</span>
                        </li>
                        <li className="flex items-center gap-3 p-2 bg-fitness-light dark:bg-gray-700 border-2 border-black dark:border-white/30">
                            <span className="text-xl">📊</span>
                            <span className="text-black dark:text-white">Track your progress</span>
                        </li>
                        <li className="flex items-center gap-3 p-2 bg-skin-light dark:bg-gray-700 border-2 border-black dark:border-white/30">
                            <span className="text-xl">💬</span>
                            <span className="text-black dark:text-white">View chat history</span>
                        </li>
                        <li className="flex items-center gap-3 p-2 bg-athletic-light dark:bg-gray-700 border-2 border-black dark:border-white/30">
                            <span className="text-xl">🎯</span>
                            <span className="text-black dark:text-white">Personalized recommendations</span>
                        </li>
                        <li className="flex items-center gap-3 p-2 bg-retro-paper dark:bg-gray-700 border-2 border-black dark:border-white/30">
                            <span className="text-xl">🍽️</span>
                            <span className="text-black dark:text-white">Custom meal preferences</span>
                        </li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="mt-6 text-center">
                    <div className="inline-block bg-retro-paper dark:bg-gray-800 border-4 border-dashed border-black dark:border-white/50 p-4 font-mono text-sm text-retro-text">
                        COMING_SOON.exe - Check back for updates!
                    </div>
                </div>
            </div>
        </div>
    );
}
