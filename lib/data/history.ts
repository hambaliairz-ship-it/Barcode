"use server";

import { db } from "@/lib/db";
import { products, scans } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getScanHistory() {
    try {
        const history = await db
            .select({
                id: scans.id,
                barcode: scans.barcode,
                scannedAt: scans.scannedAt,
                productName: products.name,
                category: products.aiAnalysis, // Get full analysis data
            })
            .from(scans)
            .leftJoin(products, eq(scans.barcode, products.barcode))
            .orderBy(desc(scans.scannedAt))
            .limit(50); // Limit to last 50 scans for now

        return history.map(scan => {
            let category = "Uncategorized";
            try {
                if (scan.category) {
                    const parsed = JSON.parse(scan.category);
                    category = parsed.category || "General";
                }
            } catch (e) {
                // Ignore parse error
            }

            return {
                ...scan,
                productName: scan.productName || "Unknown Product",
                timeAgo: getTimeAgo(new Date(scan.scannedAt)),
                category
            };
        });
    } catch (error) {
        console.error("Failed to fetch history:", error);
        return [];
    }
}

export async function getInsights() {
    try {
        // 1. Most Scanned Category
        const scanHistory = await getScanHistory();
        const categoryCounts: Record<string, number> = {};

        scanHistory.forEach(scan => {
            const cat = scan.category || "Uncategorized";
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const topCategories = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, value: count }));


        // 2. Scan Activity by Hour (Simple analysis)
        const hourCounts = new Array(24).fill(0);
        scanHistory.forEach(scan => {
            const hour = new Date(scan.scannedAt).getHours();
            hourCounts[hour]++;
        });

        const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

        return {
            topCategories,
            totalScanned: scanHistory.length,
            peakHour: `${peakHour}:00 - ${peakHour + 1}:00`,
            mostActiveCategory: topCategories[0]?.name || "N/A"
        };

    } catch (error) {
        console.error("Failed to fetch insights:", error);
        return {
            topCategories: [],
            totalScanned: 0,
            peakHour: "N/A",
            mostActiveCategory: "N/A"
        };
    }
}

function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}
