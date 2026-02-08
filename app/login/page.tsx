'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid credentials');
                setLoading(false);
            } else {
                router.push('/profile');
                router.refresh();
            }
        } catch (error) {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-retro-bg font-retro">
            <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black p-8 shadow-retro max-w-md w-full">
                <h1 className="text-2xl font-bold uppercase mb-6 text-center bg-retro-primary text-white p-2">
                    🔑 LOGIN_SYSTEM
                </h1>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-700 p-2 mb-4 text-center font-bold">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">EMAIL_ADDRESS</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-2 border-black p-2 font-mono"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-black p-2 font-mono"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-retro-accent text-black border-2 border-black p-3 font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ENTER_SYSTEM'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    NEW_USER?{' '}
                    <Link href="/register" className="text-retro-primary font-bold hover:underline">
                        REGISTER_HERE
                    </Link>
                </p>
            </div>
        </div>
    );
}
