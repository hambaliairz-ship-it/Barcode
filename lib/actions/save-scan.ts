
"use server";

import { db } from "@/lib/db";
import { products, scans, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to get or create a dummy user (Since we don't have full Auth yet)
async function getGuestUser() {
    const email = "guest@rzvalor.app";

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
        return existingUser[0].id;
    }

    // Create new guest user
    const [newUser] = await db.insert(users).values({
        name: "Guest User",
        email: email,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
    }).returning({ id: users.id });

    return newUser.id;
}

export async function saveScan(productData: any) {
    try {
        const userId = await getGuestUser();

        // 1. Upsert Product (Insert or Update if exists)
        // Note: In Drizzle, simple upsert isn't always standard across drivers, 
        // so we'll check existence first for safety.

        // Check if product exists
        const existingProduct = await db.select().from(products).where(eq(products.barcode, productData.barcode)).limit(1);

        if (existingProduct.length === 0) {
            // Insert new product
            await db.insert(products).values({
                barcode: productData.barcode,
                name: productData.name,
                description: productData.description,
                nutrition: productData.nutrition, // JSONB
                aiAnalysis: JSON.stringify(productData), // Complete raw analysis
                image: null, // We don't have image upload yet
            });
        } else {
            // Optional: Update existing product info if needed
            // For now we keep the first analysis to avoid overwriting with potentially worse AI hallucinations
        }

        // 2. Record Scan History
        await db.insert(scans).values({
            userId: userId,
            barcode: productData.barcode,
        });

        // 3. Revalidate paths to update UI
        revalidatePath("/home");
        revalidatePath("/history");

        return { success: true };

    } catch (error) {
        console.error("Failed to save scan:", error);
        return { success: false, error: "Gagal menyimpan data ke database." };
    }
}
