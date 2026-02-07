
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, History, Scan, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "History", href: "/history", icon: History },
    { name: "Scan", href: "/scan", icon: Scan, isMain: true },
    { name: "Insights", href: "/insights", icon: Sparkles },
    // { name: "Profile", href: "/profile", icon: User }, // Diganti manual
];

export function BottomNav() {
    const pathname = usePathname();
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center">
            <nav className="flex items-center justify-between bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-full px-6 py-3 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-sm mx-4 transition-colors duration-300">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.name === "Scan") {
                        return (
                            <div key={item.name} className="relative -top-8">
                                <Link href={item.href}>
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        animate={{
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0.4)",
                                                "0 0 20px rgba(59, 130, 246, 0.6)",
                                                "0 0 0px rgba(59, 130, 246, 0.4)",
                                            ],
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-xl border-4 border-white dark:border-slate-900"
                                    >
                                        <Icon className="h-8 w-8" />
                                    </motion.div>
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <Link key={item.name} href={item.href} className="relative p-2 group">
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-full bg-blue-50 dark:bg-white/10"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative flex flex-col items-center gap-1">
                                <Icon
                                    className={cn(
                                        "h-6 w-6 transition-all duration-300",
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.3)] dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] scale-110"
                                            : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-slate-200"
                                    )}
                                />
                            </div>
                        </Link>
                    );
                })}

                {/* Theme Toggle Button replace Profile */}
                <button
                    onClick={toggleTheme}
                    className="relative p-2 group hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    <div className="relative flex flex-col items-center gap-1">
                        <motion.div
                            initial={false}
                            animate={{ rotate: isDark ? 0 : 180 }}
                            transition={{ duration: 0.5, type: "spring" }}
                        >
                            {isDark ? (
                                <Sun className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] transition-all duration-300 hover:scale-110" />
                            ) : (
                                <Moon className="h-6 w-6 text-indigo-500 drop-shadow-sm transition-all duration-300 hover:scale-110 hover:text-indigo-600" />
                            )}
                        </motion.div>
                    </div>
                </button>
            </nav>
        </div>
    );
}
