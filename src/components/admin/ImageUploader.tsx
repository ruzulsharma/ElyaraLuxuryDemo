"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  /** Current image URLs (for edit mode) */
  existingImages?: string[];
  /** Called when upload completes with the full array of URLs */
  onImagesChange: (urls: string[]) => void;
}

const MAX_SLOTS = 4;
const MAX_SIZE_MB = 2;
const RECOMMENDED_SIZE = "800 × 1066 px (3:4 ratio)";

/**
 * Compresses an image file client-side using Canvas.
 * Targets ~80% quality JPEG, max 1200px on longest side.
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const MAX_DIM = 1200;
      let { width, height } = img;

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIM);
          width = MAX_DIM;
        } else {
          width = Math.round((width / height) * MAX_DIM);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        "image/jpeg",
        0.82 // 82% quality — good balance of size vs quality
      );
    };

    img.src = url;
  });
}

export default function ImageUploader({ existingImages = [], onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const slotsRemaining = MAX_SLOTS - images.length;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (files.length > slotsRemaining) {
      setError(`You can add ${slotsRemaining} more image${slotsRemaining !== 1 ? "s" : ""}.`);
      return;
    }

    // Check sizes before compression
    for (const f of files) {
      if (f.size > MAX_SIZE_MB * 1024 * 1024 * 3) {
        // Allow up to 6MB raw since we compress — reject beyond that
        setError(`"${f.name}" is too large. Max raw size: 6MB.`);
        return;
      }
    }

    setError("");
    setUploading(true);

    try {
      // Compress all images client-side
      const compressed = await Promise.all(files.map(compressImage));

      // Build FormData
      const formData = new FormData();
      compressed.forEach((blob, i) => {
        formData.append("images", blob, `img-${i}.jpg`);
      });

      // Upload to API
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }

      const newImages = [...images, ...data.urls];
      setImages(newImages);
      onImagesChange(newImages);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium">
          Product Images * ({images.length}/{MAX_SLOTS})
        </label>
        <span className="text-[9px] text-[#c9a96e] tracking-wide">
          Recommended: {RECOMMENDED_SIZE}
        </span>
      </div>

      {/* Image grid — 4 slots */}
      <div className="grid grid-cols-4 gap-3">
        {/* Existing images */}
        {images.map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-[3/4] bg-[#e8e0d0] border border-[#e8e0d0] overflow-hidden group">
            <Image
              src={url}
              alt={`Product image ${i + 1}`}
              fill
              className="object-cover"
              sizes="120px"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove image ${i + 1}`}
            >
              ×
            </button>
            {/* Slot number */}
            <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded-sm">
              {i + 1}
            </span>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: slotsRemaining }).map((_, i) => (
          <button
            key={`empty-${i}`}
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-[3/4] border-2 border-dashed border-[#e8e0d0] flex flex-col items-center justify-center gap-1 text-[#1a2744]/30 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[8px] tracking-wide uppercase font-medium">
              {uploading ? "Uploading…" : "Add"}
            </span>
            <span className="text-[7px] text-[#1a2744]/20">3:4</span>
          </button>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload images"
      />

      {/* Error */}
      {error && (
        <p role="alert" className="text-red-500 text-xs">{error}</p>
      )}

      {/* Size guide hint */}
      <div className="bg-[#f5f0e8] border border-[#e8e0d0] px-3 py-2 text-[9px] text-[#1a2744]/50 leading-relaxed space-y-0.5">
        <p>• Images are auto-compressed to JPEG ~82% quality, max 1200px.</p>
        <p>• Best results with <strong>3:4 portrait ratio</strong> (800×1066 or similar).</p>
        <p>• Max 4 images per product. First image is the cover.</p>
      </div>

      {/* Hidden input to carry URLs to the form submission */}
      <input type="hidden" name="images" value={images.join(", ")} />
    </div>
  );
}
