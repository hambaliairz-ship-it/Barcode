
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
            <nav className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg w-full max-w-sm">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isMain) {
                        return (
                            <div key={item.name} className="relative -top-6">
                                <Link href={item.href}>
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        animate={{
                                            boxShadow: isActive
                                                ? "0 0 20px rgba(59, 130, 246, 0.5)"
                                                : "0 0 0px rgba(0,0,0,0)",
                                        }}
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl"
                                    >
                                        <Icon className="h-8 w-8" />
                                    </motion.div>
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <Link key={item.name} href={item.href} className="relative p-2">
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-full bg-white/20"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative flex flex-col items-center gap-1">
                                <Icon
                                    className={cn(
                                        "h-6 w-6 transition-colors",
                                        isActive ? "text-blue-400" : "text-gray-400"
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
