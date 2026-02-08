'use client';

import { useRef, useState } from 'react';

interface ImageUploadProps {
    onImageSelect: (base64: string) => void;
    onClear: () => void;
    imagePreview: string | null;
    loading: boolean;
    onAnalyze: () => void;
}

export default function ImageUpload({
    onImageSelect,
    onClear,
    imagePreview,
    loading,
    onAnalyze
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    // Return base64 without prefix
                    resolve(dataUrl.split(',')[1]);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB initial check)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        try {
            const compressedBase64 = await compressImage(file);
            onImageSelect(compressedBase64);
        } catch (err) {
            console.error('Image compression failed:', err);
            setError('Failed to process image');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleClear = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClear();
    };

    return (
        <div className="bg-retro-paper dark:bg-gray-800 border-4 border-black dark:border-white/30 p-4 shadow-retro">
            <h3 className="text-sm font-bold uppercase mb-3 bg-retro-secondary text-white inline-block px-2 py-1">
                📷 UPLOAD FOOD IMAGE
            </h3>
            <p className="text-xs font-mono text-retro-text opacity-70 mb-3">
                Upload an image of ingredients or food to get recipe suggestions
            </p>

            {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-500 text-red-700 text-xs font-bold">
                    ❌ {error}
                </div>
            )}

            {!imagePreview ? (
                <div className="border-2 border-dashed border-black dark:border-white/50 p-6 text-center bg-gray-50 dark:bg-gray-900 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2 w-full h-full"
                    >
                        <span className="text-4xl">📸</span>
                        <span className="text-sm font-bold text-retro-text">Click to upload image</span>
                        <span className="text-xs font-mono text-retro-text opacity-60">PNG, JPG up to 5MB</span>
                        <span className="text-[10px] text-green-600 font-mono mt-1">✨ Optimized for speed</span>
                    </label>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Image Preview */}
                    <div className="relative border-2 border-black dark:border-white/30 overflow-hidden bg-gray-100">
                        <img
                            src={`data:image/jpeg;base64,${imagePreview}`}
                            alt="Uploaded food"
                            className="w-full h-48 object-cover"
                        />
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold border-2 border-black hover:bg-red-600 shadow-sm"
                        >
                            ✕ REMOVE
                        </button>
                    </div>

                    {/* Analyze Button */}
                    <button
                        onClick={onAnalyze}
                        disabled={loading}
                        className="w-full bg-retro-accent text-black border-2 border-black p-3 font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">🔄</span> ANALYZING...
                            </>
                        ) : (
                            <>
                                <span>🍳</span> GET RECIPE FROM IMAGE
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-center text-retro-text opacity-60 font-mono">
                        Image compressed for faster analysis
                    </p>
                </div>
            )}
        </div>
    );
}
