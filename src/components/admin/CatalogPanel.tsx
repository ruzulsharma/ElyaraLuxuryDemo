"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/lib/actions/product.actions";

interface CatalogProduct {
  id: string;
  name: string;
  style_no: string;
  price: number;
  original_price?: number | null;
  category: string;
  collection: string;
  description: string;
  images: string[];
  is_bestseller: boolean;
  is_new: boolean;
  is_customizable: boolean;
  status: string;
  sizes: string[];
  colors: string[];
}

interface CatalogPanelProps {
  products: CatalogProduct[];
}

const CATEGORIES = ["coord-sets", "dresses", "tops", "outerwear", "resort"];
const STATUSES = ["available", "made-to-order", "sold-out", "limited"];

const inputCls =
  "w-full border border-[#e8e0d0] bg-transparent px-3 py-2 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors";

export default function CatalogPanel({ products }: CatalogPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
    setMessage(null);
  };

  const handleEdit = (product: CatalogProduct) => {
    setEditingProduct(product);
    setShowForm(true);
    setMessage(null);
  };

  const handleDelete = (product: CatalogProduct) => {
    if (!confirm(`Delete "${product.name}" (Style ${product.style_no})? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (result.success) {
        setMessage({ type: "success", text: `"${product.name}" deleted.` });
      } else {
        setMessage({ type: "error", text: result.error ?? "Delete failed." });
      }
    });
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      let result;
      if (editingProduct) {
        result = await updateProductAction(editingProduct.id, formData);
      } else {
        result = await createProductAction(formData);
      }

      if (result.success) {
        setMessage({ type: "success", text: editingProduct ? "Product updated!" : "Product created!" });
        setShowForm(false);
        setEditingProduct(null);
      } else {
        setMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium">
          Catalog ({products.length} pieces)
        </p>
        <button
          onClick={handleCreate}
          className="bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-5 py-2.5 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div className={`px-4 py-3 text-sm border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* ── Product Form (create/edit) ── */}
      {showForm && (
        <div className="bg-white border border-[#e8e0d0] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#e8e0d0] pb-3">
            <h3 className="text-sm font-medium text-[#1a2744]">
              {editingProduct ? `Edit: ${editingProduct.name}` : "New Product"}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditingProduct(null); }}
              className="text-xs text-[#1a2744]/50 hover:text-[#1a2744]"
            >
              Cancel
            </button>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Name *</label>
                <input name="name" defaultValue={editingProduct?.name ?? ""} required className={inputCls} placeholder="Mira" />
              </div>

              {/* Style No */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Style No *</label>
                <input name="styleNo" defaultValue={editingProduct?.style_no ?? ""} required className={inputCls} placeholder="001" />
              </div>

              {/* Price */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Price (₹) *</label>
                <input name="price" type="number" defaultValue={editingProduct?.price ?? ""} required className={inputCls} placeholder="4999" />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Original Price (₹)</label>
                <input name="originalPrice" type="number" defaultValue={editingProduct?.original_price ?? ""} className={inputCls} placeholder="Optional — for discount display" />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Category *</label>
                <select name="category" defaultValue={editingProduct?.category ?? "coord-sets"} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Collection */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Collection *</label>
                <input name="collection" defaultValue={editingProduct?.collection ?? "Signature Edit"} required className={inputCls} placeholder="Signature Edit" />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Status *</label>
                <select name="status" defaultValue={editingProduct?.status ?? "available"} className={inputCls}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Sizes (comma-separated)</label>
                <input name="sizes" defaultValue={editingProduct?.sizes?.join(", ") ?? "XS, S, M, L, XL, Custom"} className={inputCls} placeholder="XS, S, M, L, XL, Custom" />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Colors (comma-separated)</label>
                <input name="colors" defaultValue={editingProduct?.colors?.join(", ") ?? ""} className={inputCls} placeholder="Blue-Gold Brocade" />
              </div>
            </div>

            {/* Images — upload component */}
            <ImageUploader
              existingImages={editingProduct?.images ?? []}
              onImagesChange={(urls) => {
                // URLs are stored in the hidden input inside ImageUploader
                // They'll be submitted as comma-separated via the hidden name="images" input
              }}
            />

            {/* Description */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#1a2744]/60 font-medium mb-1">Description *</label>
              <textarea name="description" defaultValue={editingProduct?.description ?? ""} required rows={3} className={`${inputCls} resize-none`} placeholder="A brocade peplum top with..." />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-xs text-[#1a2744]">
                <input type="hidden" name="isBestseller" value="false" />
                <input type="checkbox" name="isBestseller" value="true" defaultChecked={editingProduct?.is_bestseller ?? false} className="w-4 h-4 accent-[#c9a96e]" />
                Bestseller
              </label>
              <label className="flex items-center gap-2 text-xs text-[#1a2744]">
                <input type="hidden" name="isNew" value="false" />
                <input type="checkbox" name="isNew" value="true" defaultChecked={editingProduct?.is_new ?? false} className="w-4 h-4 accent-[#c9a96e]" />
                New Arrival
              </label>
              <label className="flex items-center gap-2 text-xs text-[#1a2744]">
                <input type="hidden" name="isCustomizable" value="false" />
                <input type="checkbox" name="isCustomizable" value="true" defaultChecked={editingProduct?.is_customizable ?? true} className="w-4 h-4 accent-[#c9a96e]" />
                Customizable
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-8 py-3 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving…" : editingProduct ? "Update Product" : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* ── Product Grid ── */}
      {products.length === 0 && !showForm ? (
        <div className="bg-white border border-[#e8e0d0] p-12 text-center">
          <p className="text-[#1a2744]/40 font-serif text-lg mb-3">No products yet.</p>
          <p className="text-xs text-[#1a2744]/40 mb-6">Add your first product to get started.</p>
          <button
            onClick={handleCreate}
            className="bg-[#c9a96e] text-[#1a2744] text-xs tracking-[0.2em] uppercase font-bold px-8 py-3"
          >
            + Add First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#e8e0d0] p-4 flex gap-4 group relative"
            >
              {/* Image */}
              <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden bg-[#e8e0d0]">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[10px] text-[#c9a96e] tracking-[0.2em] uppercase font-medium">
                  Style {product.style_no}
                </p>
                <p className="text-sm font-medium text-[#1a2744] truncate">
                  {product.name}
                </p>
                <p className="text-xs font-semibold text-[#1a2744]">
                  ₹{product.price.toLocaleString("en-IN")}
                  {product.original_price && (
                    <span className="ml-2 text-[#1a2744]/40 line-through font-normal">
                      ₹{product.original_price.toLocaleString("en-IN")}
                    </span>
                  )}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {product.is_bestseller && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#c9a96e]/10 text-[#c9a96e] uppercase tracking-wide font-medium">Bestseller</span>
                  )}
                  {product.is_new && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#1a2744]/10 text-[#1a2744] uppercase tracking-wide font-medium">New</span>
                  )}
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#e8e0d0]/50 text-[#1a2744]/60 uppercase tracking-wide font-medium">
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Action buttons — visible on hover */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(product)}
                  title="Edit"
                  className="w-7 h-7 bg-[#1a2744] text-white flex items-center justify-center text-xs hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  title="Delete"
                  disabled={isPending}
                  className="w-7 h-7 bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
