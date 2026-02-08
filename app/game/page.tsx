'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface FallingItem {
    id: number;
    x: number;
    y: number;
    type: 'healthy' | 'junk' | 'powerup';
    emoji: string;
    speed: number;
    powerupType?: 'shield' | 'double' | 'slow';
}

interface Particle {
    id: number;
    x: number;
    y: number;
    emoji: string;
}

const HEALTHY_FOODS = ['🥗', '🥕', '🍎', '🥦', '🍌', '🥒', '🍇', '🥬', '🍊', '🥑'];
const JUNK_FOODS = ['🍟', '🍔', '🍕', '🍩', '🍪', '🍫', '🧁', '🌭', '🥤', '🍭'];
const POWERUPS = [
    { emoji: '🛡️', type: 'shield' as const },
    { emoji: '⭐', type: 'double' as const },
    { emoji: '🐢', type: 'slow' as const },
];

const GAME_WIDTH = 320;
const GAME_HEIGHT = 400;
const BASKET_WIDTH = 60;
const BASKET_Y = GAME_HEIGHT - 50;

export default function GamePage() {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
    const [items, setItems] = useState<FallingItem[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [level, setLevel] = useState(1);
    const [combo, setCombo] = useState(0);

    // Power-up states
    const [hasShield, setHasShield] = useState(false);
    const [hasDouble, setHasDouble] = useState(false);
    const [slowMode, setSlowMode] = useState(false);

    // Visual feedback states
    const [screenEffect, setScreenEffect] = useState<'none' | 'shake' | 'flash-green' | 'flash-red'>('none');
    const [feedbackText, setFeedbackText] = useState<{ text: string; x: number; y: number } | null>(null);

    const gameLoopRef = useRef<number | null>(null);
    const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const itemIdRef = useRef(0);
    const particleIdRef = useRef(0);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem('foodCatcherHighScore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    // Save high score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('foodCatcherHighScore', score.toString());
        }
    }, [score, highScore]);

    // Spawn particles effect
    const spawnParticles = useCallback((x: number, y: number, type: 'good' | 'bad' | 'powerup') => {
        const emojis = type === 'good' ? ['✨', '⭐', '💫'] : type === 'bad' ? ['💢', '💥'] : ['🌟', '✨', '💎'];
        const newParticles: Particle[] = [];
        for (let i = 0; i < 5; i++) {
            newParticles.push({
                id: particleIdRef.current++,
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                emoji: emojis[Math.floor(Math.random() * emojis.length)],
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 600);
    }, []);

    // Show feedback text
    const showFeedback = useCallback((text: string, x: number, y: number) => {
        setFeedbackText({ text, x, y });
        setTimeout(() => setFeedbackText(null), 500);
    }, []);

    // Spawn items
    const spawnItem = useCallback(() => {
        const rand = Math.random();
        let type: 'healthy' | 'junk' | 'powerup';
        let emoji: string;
        let powerupType: FallingItem['powerupType'];

        if (rand < 0.05 && level >= 2) { // 5% chance for power-ups after level 2
            type = 'powerup';
            const powerup = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
            emoji = powerup.emoji;
            powerupType = powerup.type;
        } else if (rand < 0.40) { // 35% junk
            type = 'junk';
            emoji = JUNK_FOODS[Math.floor(Math.random() * JUNK_FOODS.length)];
        } else { // 60% healthy
            type = 'healthy';
            emoji = HEALTHY_FOODS[Math.floor(Math.random() * HEALTHY_FOODS.length)];
        }

        const speedMultiplier = slowMode ? 0.5 : 1;
        const newItem: FallingItem = {
            id: itemIdRef.current++,
            x: Math.random() * (GAME_WIDTH - 40) + 20,
            y: -30,
            type,
            emoji,
            speed: (2 + level * 0.5 + Math.random() * 1) * speedMultiplier,
            powerupType,
        };

        setItems(prev => [...prev, newItem]);
    }, [level, slowMode]);

    // Game loop
    const gameLoop = useCallback(() => {
        setItems(prev => {
            const updated = prev.map(item => ({
                ...item,
                y: item.y + item.speed,
            }));

            const remaining: FallingItem[] = [];
            let scoreChange = 0;
            let livesChange = 0;
            let caught = false;

            for (const item of updated) {
                // Check if caught by basket
                if (
                    item.y >= BASKET_Y - 20 &&
                    item.y <= BASKET_Y + 20 &&
                    item.x >= basketX - 10 &&
                    item.x <= basketX + BASKET_WIDTH + 10
                ) {
                    if (item.type === 'healthy') {
                        const points = (hasDouble ? 20 : 10) * (1 + Math.floor(combo / 3));
                        scoreChange += points;
                        caught = true;
                        spawnParticles(item.x, item.y, 'good');
                        showFeedback(`+${points}`, item.x, item.y);
                        setScreenEffect('flash-green');
                        setTimeout(() => setScreenEffect('none'), 150);
                    } else if (item.type === 'junk') {
                        if (hasShield) {
                            setHasShield(false);
                            spawnParticles(item.x, item.y, 'powerup');
                            showFeedback('BLOCKED!', item.x, item.y);
                        } else {
                            livesChange -= 1;
                            setCombo(0);
                            spawnParticles(item.x, item.y, 'bad');
                            showFeedback('OUCH!', item.x, item.y);
                            setScreenEffect('shake');
                            setTimeout(() => setScreenEffect('none'), 400);
                        }
                    } else if (item.type === 'powerup') {
                        spawnParticles(item.x, item.y, 'powerup');
                        if (item.powerupType === 'shield') {
                            setHasShield(true);
                            showFeedback('SHIELD!', item.x, item.y);
                        } else if (item.powerupType === 'double') {
                            setHasDouble(true);
                            showFeedback('2X POINTS!', item.x, item.y);
                            setTimeout(() => setHasDouble(false), 10000);
                        } else if (item.powerupType === 'slow') {
                            setSlowMode(true);
                            showFeedback('SLOW MO!', item.x, item.y);
                            setTimeout(() => setSlowMode(false), 8000);
                        }
                    }
                }
                // Check if missed (fell off screen)
                else if (item.y > GAME_HEIGHT + 20) {
                    if (item.type === 'healthy') {
                        setCombo(0);
                    }
                }
                // Still in play
                else if (item.y <= GAME_HEIGHT + 20) {
                    remaining.push(item);
                }
            }

            if (caught) setCombo(c => c + 1);
            if (scoreChange > 0) setScore(s => s + scoreChange);
            if (livesChange < 0) setLives(l => Math.max(0, l + livesChange));

            return remaining;
        });

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [basketX, combo, hasDouble, hasShield, spawnParticles, showFeedback]);

    // Start game
    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLives(3);
        setItems([]);
        setParticles([]);
        setLevel(1);
        setCombo(0);
        setBasketX(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
        setHasShield(false);
        setHasDouble(false);
        setSlowMode(false);
        itemIdRef.current = 0;
    };

    // Pause/Resume
    const togglePause = useCallback(() => {
        if (gameState === 'playing') {
            setGameState('paused');
        } else if (gameState === 'paused') {
            setGameState('playing');
        }
    }, [gameState]);

    // Handle game over
    useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            setGameState('gameover');
        }
    }, [lives, gameState]);

    // Level up based on score
    useEffect(() => {
        const newLevel = Math.floor(score / 100) + 1;
        if (newLevel !== level && newLevel <= 10) {
            setLevel(newLevel);
        }
    }, [score, level]);

    // Game loop control
    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            spawnIntervalRef.current = setInterval(spawnItem, Math.max(600, 1200 - level * 100));
        }

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
        };
    }, [gameState, gameLoop, spawnItem, level]);

    // Touch/mouse controls
    const handleMove = useCallback((clientX: number) => {
        if (!gameAreaRef.current || gameState !== 'playing') return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = clientX - rect.left - BASKET_WIDTH / 2;
        setBasketX(Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, x)));
    }, [gameState]);

    const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                togglePause();
                return;
            }
            if (gameState !== 'playing') return;
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                setBasketX(x => Math.max(0, x - 20));
            } else if (e.key === 'ArrowRight' || e.key === 'd') {
                setBasketX(x => Math.min(GAME_WIDTH - BASKET_WIDTH, x + 20));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, togglePause]);

    // Calculate stats for game over
    const getTopFoods = () => {
        const foods = ['🥗', '🥕', '🍎', '🥦', '🍌'];
        return foods.slice(0, Math.min(5, Math.floor(score / 20)));
    };

    return (
        <div className="min-h-screen bg-retro-bg p-4 pb-24 flex flex-col items-center">
            <div className="max-w-md w-full space-y-4">
                {/* Header */}
                <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-3 shadow-retro animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎮</span>
                            <div>
                                <h1 className="text-xl font-bold uppercase text-retro-text">FOOD CATCHER</h1>
                                <p className="text-xs font-mono text-retro-text opacity-70">Catch healthy foods!</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-mono text-retro-text">HIGH SCORE</div>
                            <div className="text-lg font-bold text-retro-primary">{highScore}</div>
                        </div>
                    </div>
                </div>

                {/* Game Stats */}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in">
                        <div className="bg-retro-accent border-2 border-black p-2 text-center">
                            <div className="text-lg font-bold text-black">{score}</div>
                            <div className="text-[10px] font-mono text-black">SCORE</div>
                        </div>
                        <div className="bg-red-300 border-2 border-black p-2 text-center">
                            <div className="text-lg font-bold text-black">{'❤️'.repeat(lives)}</div>
                            <div className="text-[10px] font-mono text-black">LIVES</div>
                        </div>
                        <div className="bg-blue-300 border-2 border-black p-2 text-center">
                            <div className="text-lg font-bold text-black">LV{level}</div>
                            <div className="text-[10px] font-mono text-black">LEVEL</div>
                        </div>
                        <div className="bg-purple-300 border-2 border-black p-2 text-center">
                            <div className="text-lg font-bold text-black">x{1 + Math.floor(combo / 3)}</div>
                            <div className="text-[10px] font-mono text-black">COMBO</div>
                        </div>
                    </div>
                )}

                {/* Power-up Indicators */}
                {(gameState === 'playing' || gameState === 'paused') && (hasShield || hasDouble || slowMode) && (
                    <div className="flex gap-2 justify-center animate-bounce-in">
                        {hasShield && (
                            <div className="bg-yellow-300 border-2 border-black px-3 py-1 font-bold text-xs animate-pulse">
                                🛡️ SHIELD
                            </div>
                        )}
                        {hasDouble && (
                            <div className="bg-green-300 border-2 border-black px-3 py-1 font-bold text-xs animate-pulse">
                                ⭐ 2X POINTS
                            </div>
                        )}
                        {slowMode && (
                            <div className="bg-blue-300 border-2 border-black px-3 py-1 font-bold text-xs animate-pulse">
                                🐢 SLOW MO
                            </div>
                        )}
                    </div>
                )}

                {/* Game Area */}
                <div
                    ref={gameAreaRef}
                    className={`
                        relative bg-gradient-to-b from-sky-300 to-sky-100 dark:from-sky-900 dark:to-sky-700 
                        border-4 border-black overflow-hidden mx-auto
                        ${screenEffect === 'shake' ? 'screen-shake' : ''}
                        ${screenEffect === 'flash-green' ? 'flash-green' : ''}
                        ${screenEffect === 'flash-red' ? 'flash-red' : ''}
                    `}
                    style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                >
                    {/* Idle Screen */}
                    {gameState === 'idle' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white text-center p-4">
                            <div className="text-6xl mb-4 animate-bounce">🥗🎮🍔</div>
                            <h2 className="text-2xl font-bold mb-2">FOOD CATCHER</h2>
                            <p className="text-sm mb-4 font-mono">
                                Catch 🥗 healthy foods<br />
                                Avoid 🍔 junk foods!<br />
                                <span className="text-yellow-400">Grab ⭐ power-ups!</span>
                            </p>
                            <button
                                onClick={startGame}
                                className="bg-retro-accent text-black border-2 border-white px-6 py-3 font-bold text-lg hover:bg-white transition-colors hover-lift"
                            >
                                ▶ START GAME
                            </button>
                            <p className="text-xs mt-4 opacity-70">
                                Use mouse, touch, or arrow keys<br />
                                Press P or ESC to pause
                            </p>
                        </div>
                    )}

                    {/* Paused Screen */}
                    {gameState === 'paused' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-center p-4 z-20">
                            <div className="text-5xl mb-4">⏸️</div>
                            <h2 className="text-2xl font-bold mb-2">PAUSED</h2>
                            <button
                                onClick={togglePause}
                                className="bg-retro-accent text-black border-2 border-white px-6 py-3 font-bold hover:bg-white transition-colors mt-4"
                            >
                                ▶ RESUME
                            </button>
                            <p className="text-xs mt-4 opacity-70">Press P or ESC</p>
                        </div>
                    )}

                    {/* Game Over Screen */}
                    {gameState === 'gameover' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-center p-4">
                            <div className="text-5xl mb-4">💀</div>
                            <h2 className="text-2xl font-bold mb-2 text-red-400">GAME OVER</h2>
                            <p className="text-3xl font-bold mb-1">{score}</p>
                            <p className="text-sm font-mono mb-2">
                                {score > highScore ? '🎉 NEW HIGH SCORE!' : `Best: ${highScore}`}
                            </p>
                            <div className="text-xs font-mono mb-4 bg-white/10 px-3 py-2 rounded">
                                <div>Level: {level} | Combo: x{1 + Math.floor(combo / 3)}</div>
                                <div className="mt-1">Foods Collected: {getTopFoods().join('')}</div>
                            </div>
                            <button
                                onClick={startGame}
                                className="bg-retro-accent text-black border-2 border-white px-6 py-3 font-bold hover:bg-white transition-colors"
                            >
                                🔄 PLAY AGAIN
                            </button>
                        </div>
                    )}

                    {/* Feedback Text */}
                    {feedbackText && (
                        <div
                            className="absolute text-lg font-bold text-white animate-bounce-in pointer-events-none z-10"
                            style={{
                                left: feedbackText.x - 30,
                                top: feedbackText.y - 30,
                                textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
                            }}
                        >
                            {feedbackText.text}
                        </div>
                    )}

                    {/* Particles */}
                    {particles.map(particle => (
                        <div
                            key={particle.id}
                            className="particle text-xl"
                            style={{ left: particle.x, top: particle.y }}
                        >
                            {particle.emoji}
                        </div>
                    ))}

                    {/* Falling Items */}
                    {items.map(item => (
                        <div
                            key={item.id}
                            className={`absolute text-3xl transition-none ${item.type === 'powerup' ? 'animate-pulse' : ''}`}
                            style={{
                                left: item.x - 15,
                                top: item.y,
                                filter: item.type === 'junk'
                                    ? 'drop-shadow(0 0 3px red)'
                                    : item.type === 'powerup'
                                        ? 'drop-shadow(0 0 6px gold)'
                                        : 'drop-shadow(0 0 3px green)',
                            }}
                        >
                            {item.emoji}
                        </div>
                    ))}

                    {/* Basket */}
                    {(gameState === 'playing' || gameState === 'paused') && (
                        <div
                            className={`absolute text-4xl ${hasShield ? 'animate-pulse' : ''}`}
                            style={{
                                left: basketX,
                                top: BASKET_Y,
                                width: BASKET_WIDTH,
                                textAlign: 'center',
                                filter: hasShield ? 'drop-shadow(0 0 8px gold)' : 'none',
                            }}
                        >
                            🧺
                            {hasShield && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">🛡️</span>}
                        </div>
                    )}

                    {/* Ground */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-green-600 to-green-500 border-t-2 border-green-700" />

                    {/* Pause Button (during gameplay) */}
                    {gameState === 'playing' && (
                        <button
                            onClick={togglePause}
                            className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded flex items-center justify-center text-lg hover:bg-black/70"
                        >
                            ⏸
                        </button>
                    )}
                </div>

                {/* Instructions */}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="bg-retro-paper dark:bg-gray-800 border-2 border-black p-2 text-center">
                        <p className="text-xs font-mono text-retro-text">
                            🥗 +10pts × combo | 🍔 -1 life | 🛡️ Shield | ⭐ 2X | 🐢 Slow
                        </p>
                    </div>
                )}

                {/* Back Link */}
                <div className="flex justify-center">
                    <Link
                        href="/tracker"
                        className="text-xs font-mono text-retro-text opacity-70 hover:opacity-100 underline"
                    >
                        ← Back to Tracker
                    </Link>
                </div>
            </div>
        </div>
    );
}
