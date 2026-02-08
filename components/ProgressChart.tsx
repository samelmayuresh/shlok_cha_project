'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Metric {
    id: string;
    value: number;
    recordedAt: string;
}

export default function ProgressChart() {
    const [data, setData] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [newValue, setNewValue] = useState('');
    const [type, setType] = useState('weight'); // 'weight' or 'water'

    const fetchData = () => {
        setLoading(true);
        fetch(`/api/metrics?type=${type}`)
            .then(res => res.json())
            .then(d => {
                if (d.metrics) {
                    setData(d.metrics.map((m: any) => ({
                        ...m,
                        recordedAt: new Date(m.recordedAt).toLocaleDateString()
                    })));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newValue) return;

        await fetch('/api/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                value: newValue,
                unit: type === 'weight' ? 'kg' : 'L'
            })
        });

        setNewValue('');
        fetchData();
    };

    return (
        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black p-4 shadow-retro">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold uppercase bg-black text-white px-3 py-1">
                    📈 PROGRESS_TRACKER
                </h2>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-white border-2 border-black p-1 font-mono text-sm"
                >
                    <option value="weight">Weight (kg)</option>
                    <option value="water">Water (L)</option>
                </select>
            </div>

            <div className="h-64 mb-4 bg-white border-2 border-black p-2">
                {loading ? (
                    <div className="h-full flex items-center justify-center animate-pulse text-gray-400 font-mono">
                        LOADING_DATA...
                    </div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="recordedAt" tick={{ fontSize: 10 }} />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ border: '2px solid black', borderRadius: '0px', padding: '5px' }}
                                itemStyle={{ fontFamily: 'monospace' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#000"
                                strokeWidth={3}
                                activeDot={{ r: 6, fill: 'yellow', stroke: 'black', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 font-mono">
                        NO_DATA_FOUND. START_TRACKING!
                    </div>
                )}
            </div>

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="number"
                    step="0.1"
                    placeholder={`Enter ${type}...`}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="flex-1 border-2 border-black p-2 font-mono"
                    required
                />
                <button type="submit" className="bg-retro-accent text-black border-2 border-black px-4 font-bold hover:bg-black hover:text-white transition-colors">
                    + LOG
                </button>
            </form>
        </div>
    );
}
