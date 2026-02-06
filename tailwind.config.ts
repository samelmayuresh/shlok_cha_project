import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Enable manual dark mode toggle
    theme: {
        extend: {
            fontFamily: {
                retro: ['"VT323"', "monospace"],
            },
            boxShadow: {
                'retro': '4px 4px 0px 0px var(--shadow-color)',
                'retro-lg': '8px 8px 0px 0px var(--shadow-color)',
                'retro-sm': '2px 2px 0px 0px var(--shadow-color)',
            },
            colors: {
                retro: {
                    bg: "var(--bg-primary)",
                    paper: "var(--bg-secondary)",
                    text: "var(--text-primary)",
                    border: "var(--border-color)",
                    muted: "var(--text-secondary)",
                    primary: "#FF004D",
                    secondary: "#29ADFF",
                    accent: "var(--accent-color)",
                    warning: "#FFEC27",
                },
                medical: {
                    light: "var(--medical-bg)",
                    DEFAULT: "#00E436",
                    dark: "var(--medical-border)",
                },
                fitness: {
                    light: "var(--fitness-bg)",
                    DEFAULT: "#29ADFF",
                    dark: "var(--fitness-border)",
                },
                skin: {
                    light: "var(--skin-bg)",
                    DEFAULT: "#FF77A8",
                    dark: "var(--skin-border)",
                },
                athletic: {
                    light: "var(--athletic-bg)",
                    DEFAULT: "#FF004D",
                    dark: "var(--athletic-border)",
                },
            },
            animation: {
                "float": "float 3s ease-in-out infinite",
                "blink": "blink 1s step-end infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
