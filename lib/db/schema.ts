
import { pgTable, text, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").unique().notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
    barcode: text("barcode").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    ingredients: text("ingredients"),
    nutrition: jsonb("nutrition"), // Store nutrition info as JSON
    manufacturer: text("manufacturer"),
    image: text("image"),
    aiAnalysis: text("ai_analysis"), // Detailed analysis from Gemini
    lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const scans = pgTable("scans", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    barcode: text("barcode").notNull(),
    scannedAt: timestamp("scanned_at").defaultNow().notNull(),
    location: text("location"), // Optional: Store scan location
});

export const productCache = pgTable("product_cache", {
    id: uuid("id").primaryKey().defaultRandom(),
    barcodeData: text("barcode_data").notNull(), // String (Index) - Data hasil scan (URL/GTIN)
    analysisResult: text("analysis_result"), // Text - Hasil JSON dari AI
    modelUsed: text("model_used"), // String - Nama model yang memberikan hasil
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
