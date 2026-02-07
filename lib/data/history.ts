"use server";

import { db } from "@/lib/db";
import { products, scans } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

const ITEMS_PER_PAGE = 10;

export async function getScanHistory(page: number = 1, limit: number = ITEMS_PER_PAGE) {
    try {
        const offset = (page - 1) * limit;

        const history = await db
            .select({
                id: scans.id,
                barcode: scans.barcode,
                scannedAt: scans.scannedAt,
                productName: products.name,
                category: products.aiAnalysis,
            })
            .from(scans)
            .leftJoin(products, eq(scans.barcode, products.barcode))
            .orderBy(desc(scans.scannedAt))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const [totalResult] = await db
            .select({ count: count() })
            .from(scans);

        const totalItems = totalResult.count;
        const totalPages = Math.ceil(totalItems / limit);

        const data = history.map(scan => {
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

        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };

    } catch (error) {
        console.error("Failed to fetch history:", error);
        return {
            data: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                hasNextPage: false,
                hasPrevPage: false
            }
        };
    }
}

export async function getInsights() {
    try {
        // 1. Most Scanned Category
        const { data: scanHistory } = await getScanHistory(1, 100); // Get up to 100 recent scans for insights
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
