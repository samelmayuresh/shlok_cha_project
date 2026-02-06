import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import Header from "@/components/Header";
import FloatingChatButton from "@/components/FloatingChatButton";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
    title: {
        default: "DietPlan.EXE - AI-Powered Retro Nutrition",
        template: "%s | DietPlan.EXE",
    },
    description: "Personalized AI-powered diet plans for medical, fitness, beauty, and athletic goals. Retro 8-bit experience meets modern nutrition science.",
    keywords: ["diet plan", "nutrition", "AI", "health", "fitness", "meal planning", "weight loss", "muscle gain"],
    authors: [{ name: "DietPlan Team" }],
    creator: "DietPlan.EXE",
    publisher: "DietPlan.EXE",

    // Open Graph
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://dietplan.exe",
        siteName: "DietPlan.EXE",
        title: "DietPlan.EXE - AI-Powered Retro Nutrition",
        description: "Personalized AI-powered diet plans with a retro 8-bit twist.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "DietPlan.EXE Preview",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "DietPlan.EXE - AI-Powered Retro Nutrition",
        description: "Personalized AI-powered diet plans with a retro 8-bit twist.",
        images: ["/og-image.png"],
    },

    // PWA
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "DietPlan.EXE",
    },

    // Icons
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180" },
        ],
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fdf6e3" },
        { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
    ],
    colorScheme: "light dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Preload critical fonts */}
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="pb-24 safe-bottom bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                <ThemeProvider>
                    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-retro-primary text-white px-4 py-2 z-[100]">
                        Skip to main content
                    </a>
                    <div className="min-h-screen border-x-4 border-black dark:border-white/20 max-w-lg mx-auto bg-[var(--bg-primary)] shadow-retro-lg transition-colors duration-300">
                        <Header />
                        <main id="main-content" role="main">
                            {children}
                        </main>
                    </div>
                    <FloatingChatButton />
                    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto">
                        <MobileNav />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
