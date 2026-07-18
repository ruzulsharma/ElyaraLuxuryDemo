"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

// ── Friendly error messages for common Supabase errors ───────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function friendlyDbError(error: any): string {
  const code = error?.code;
  const msg = error?.message ?? "";

  if (code === "42501" || msg.includes("row-level security")) {
    return "Permission denied. Please ensure you're logged in as admin. If this persists, check Supabase RLS policies.";
  }
  if (code === "23505" || msg.includes("duplicate key")) {
    return "A product with this style number already exists.";
  }
  if (code === "23502" || msg.includes("not-null")) {
    return "A required field is missing. Please fill all fields marked with *.";
  }
  if (msg.includes("JWT")) {
    return "Your session has expired. Please log out and sign in again.";
  }
  return `Database error: ${msg}. Please try again or contact support.`;
}

// ── Strict schema for product input ──────────────────────────────────────────
const ProductFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  styleNo: z.string().min(1, "Style number is required").max(10),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  collection: z.string().min(1, "Collection is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  images: z.string().min(1, "At least one image URL is required"), // comma-separated
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  isCustomizable: z.boolean(),
  status: z.enum(["available", "made-to-order", "sold-out", "limited"]),
  sizes: z.string().optional(), // comma-separated
  colors: z.string().optional(), // comma-separated
});

export interface ProductActionResult {
  success: boolean;
  error?: string;
}

/**
 * Create a new product in Supabase.
 */
export async function createProductAction(
  formData: FormData
): Promise<ProductActionResult> {
  const raw = {
    name: formData.get("name") as string,
    styleNo: formData.get("styleNo") as string,
    price: Number(formData.get("price")),
    originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
    category: formData.get("category") as string,
    collection: formData.get("collection") as string,
    description: formData.get("description") as string,
    images: formData.get("images") as string,
    isBestseller: formData.get("isBestseller") === "true",
    isNew: formData.get("isNew") === "true",
    isCustomizable: formData.get("isCustomizable") === "true",
    status: formData.get("status") as string,
    sizes: formData.get("sizes") as string,
    colors: formData.get("colors") as string,
  };

  const parsed = ProductFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("products").insert({
    name: parsed.data.name,
    style_no: parsed.data.styleNo,
    price: parsed.data.price,
    original_price: parsed.data.originalPrice,
    category: parsed.data.category,
    collection: parsed.data.collection,
    description: parsed.data.description,
    images: parsed.data.images.split(",").map((s: string) => s.trim()),
    is_bestseller: parsed.data.isBestseller,
    is_new: parsed.data.isNew,
    is_customizable: parsed.data.isCustomizable,
    status: parsed.data.status,
    sizes: parsed.data.sizes ? parsed.data.sizes.split(",").map((s: string) => s.trim()) : [],
    colors: parsed.data.colors ? parsed.data.colors.split(",").map((s: string) => s.trim()) : [],
  });

  if (error) {
    console.error("[createProductAction]", error);
    return { success: false, error: friendlyDbError(error) };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/shop");
  return { success: true };
}

/**
 * Update an existing product in Supabase.
 */
export async function updateProductAction(
  productId: string,
  formData: FormData
): Promise<ProductActionResult> {
  const raw = {
    name: formData.get("name") as string,
    styleNo: formData.get("styleNo") as string,
    price: Number(formData.get("price")),
    originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
    category: formData.get("category") as string,
    collection: formData.get("collection") as string,
    description: formData.get("description") as string,
    images: formData.get("images") as string,
    isBestseller: formData.get("isBestseller") === "true",
    isNew: formData.get("isNew") === "true",
    isCustomizable: formData.get("isCustomizable") === "true",
    status: formData.get("status") as string,
    sizes: formData.get("sizes") as string,
    colors: formData.get("colors") as string,
  };

  const parsed = ProductFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("products").update({
    name: parsed.data.name,
    style_no: parsed.data.styleNo,
    price: parsed.data.price,
    original_price: parsed.data.originalPrice,
    category: parsed.data.category,
    collection: parsed.data.collection,
    description: parsed.data.description,
    images: parsed.data.images.split(",").map((s: string) => s.trim()),
    is_bestseller: parsed.data.isBestseller,
    is_new: parsed.data.isNew,
    is_customizable: parsed.data.isCustomizable,
    status: parsed.data.status,
    sizes: parsed.data.sizes ? parsed.data.sizes.split(",").map((s: string) => s.trim()) : [],
    colors: parsed.data.colors ? parsed.data.colors.split(",").map((s: string) => s.trim()) : [],
  }).eq("id", productId);

  if (error) {
    console.error("[updateProductAction]", error);
    return { success: false, error: friendlyDbError(error) };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/shop");
  return { success: true };
}

/**
 * Delete a product from Supabase.
 */
export async function deleteProductAction(
  productId: string
): Promise<ProductActionResult> {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("products").delete().eq("id", productId);

  if (error) {
    console.error("[deleteProductAction]", error);
    return { success: false, error: friendlyDbError(error) };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/shop");
  return { success: true };
}
