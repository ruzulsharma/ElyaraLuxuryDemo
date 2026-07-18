import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PRODUCTS as STATIC_PRODUCTS, COLLECTIONS as STATIC_COLLECTIONS } from "@/lib/data";
import type { Product } from "@/types/types";

/**
 * Supabase row shape → frontend Product type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    category: row.category,
    collection: row.collection,
    description: row.description,
    images: row.images ?? [],
    isCustomizable: row.is_customizable ?? true,
    isBestseller: row.is_bestseller ?? false,
    isNew: row.is_new ?? false,
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    status: row.status ?? "available",
    styleNo: row.style_no ?? "",
  };
}

/**
 * Fetches all products from Supabase.
 * Falls back to static data.ts if DB is unreachable or empty.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(mapRow);
    }
  } catch (e) {
    console.warn("[getProducts] Supabase unavailable, using static fallback:", e);
  }

  // Fallback to static data
  return STATIC_PRODUCTS;
}

/**
 * Fetches a single product by ID (UUID or ELY-xxx style).
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) return mapRow(data);
  } catch {
    // Try static fallback
  }

  // Fallback: try matching by static ID
  const staticProduct = STATIC_PRODUCTS.find((p) => p.id === id);
  return staticProduct ?? null;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getProducts();
  if (category === "all") return all;
  return all.filter((p) => p.category === category);
}

/**
 * Get featured/bestseller products (first 4)
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  const bestsellers = all.filter((p) => p.isBestseller);
  return bestsellers.length >= 4 ? bestsellers.slice(0, 4) : all.slice(0, 4);
}

/**
 * Collections (still static — no collections table yet)
 */
export function getCollections() {
  return STATIC_COLLECTIONS;
}
