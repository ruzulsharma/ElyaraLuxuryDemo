import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/upload
 * Accepts up to 4 images, compresses them client-side (already done),
 * uploads to Supabase Storage 'product-images' bucket.
 * Returns array of public URLs.
 *
 * Max file size: 2MB per image (after client-side compression).
 * Accepted types: image/jpeg, image/png, image/webp
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILES = 4;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} images allowed` }, { status: 400 });
    }

    // Validate each file
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Use JPEG, PNG, or WebP.` },
          { status: 422 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 2MB. Please compress before uploading.` },
          { status: 422 }
        );
      }
    }

    const supabase = await createServerSupabaseClient();
    const urls: string[] = [];

    for (const file of files) {
      const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: uploadError } = await (supabase as any).storage
        .from("product-images")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[upload] Storage error:", uploadError);
        return NextResponse.json(
          { error: `Upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }

      // Get public URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: urlData } = (supabase as any).storage
        .from("product-images")
        .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
    }

    return NextResponse.json({ success: true, urls }, { status: 200 });
  } catch (e) {
    console.error("[upload] Unexpected error:", e);
    return NextResponse.json({ error: "Upload failed unexpectedly" }, { status: 500 });
  }
}
