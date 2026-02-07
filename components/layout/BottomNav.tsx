
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, History, Scan, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "History", href: "/history", icon: History },
    { name: "Scan", href: "/scan", icon: Scan, isMain: true },
    { name: "Insights", href: "/insights", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center">
            <nav className="flex items-center justify-between bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full max-w-sm mx-4 transition-colors duration-300">
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
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-700 text-white shadow-xl border-4 border-slate-50 dark:border-slate-900"
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
                                    className="absolute inset-0 rounded-full bg-blue-100 dark:bg-white/10"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative flex flex-col items-center gap-1">
                                <Icon
                                    className={cn(
                                        "h-6 w-6 transition-colors duration-300",
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.3)] dark:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                                            : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                                    )}
                                />
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
