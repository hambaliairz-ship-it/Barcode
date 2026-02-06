
"use server";

import { db } from "@/lib/db";
import { products, scans } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export async function getDashboardStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [scanCount] = await db
            .select({ count: count() })
            .from(scans);

        const [productCount] = await db
            .select({ count: count() })
            .from(products);

        // Get recent scans with product details
        const recentScans = await db
            .select({
                id: scans.id,
                barcode: scans.barcode,
                scannedAt: scans.scannedAt,
                productName: products.name,
                category: products.description // Fallback to description or null since 'aisle' doesn't exist yet
            })
            .from(scans)
            .leftJoin(products, eq(scans.barcode, products.barcode))
            .orderBy(desc(scans.scannedAt))
            .limit(5);

        return {
            totalScans: scanCount.count,
            totalProducts: productCount.count,
            recentScans: recentScans.map(scan => ({
                ...scan,
                productName: scan.productName || "Unknown Product",
                timeAgo: getTimeAgo(new Date(scan.scannedAt))
            }))
        };
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return {
            totalScans: 0,
            totalProducts: 0,
            recentScans: []
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
