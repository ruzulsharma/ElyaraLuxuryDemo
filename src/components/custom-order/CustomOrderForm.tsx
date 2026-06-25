"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderMode = "new-custom" | "customize-existing" | "";

interface BaseFields {
  name: string;
  phone: string;
  email: string;
}

interface NewCustomFields extends BaseFields {
  designRequirements: string;
}

interface ExistingFields extends BaseFields {
  product: string;
  waist: string;
  length: string;
  rise: string;
  chest: string;
  height: string;
  shoulders: string;
  notes: string;
}

type FormErrors = Partial<Record<string, string>>;

const INITIAL_BASE: BaseFields = { name: "", phone: "", email: "" };
const INITIAL_NEW: NewCustomFields = { ...INITIAL_BASE, designRequirements: "" };
const INITIAL_EXISTING: ExistingFields = {
  ...INITIAL_BASE,
  product: "",
  waist: "", length: "", rise: "",
  chest: "", height: "", shoulders: "",
  notes: "",
};

// ─── WhatsApp message builder ─────────────────────────────────────────────────
function buildWhatsAppMessage(mode: OrderMode, form: NewCustomFields | ExistingFields): string {
  const base = `*Elyara Order Enquiry*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email}\n`;

  if (mode === "new-custom") {
    const f = form as NewCustomFields;
    return encodeURIComponent(
      `${base}*Order Type:* New Custom Order\n\n*Design Requirements:*\n${f.designRequirements}`
    );
  }

  const f = form as ExistingFields;
  const product = PRODUCTS.find((p) => p.id === f.product);
  const measurements = [
    f.height && `Height: ${f.height} cms`,
    f.chest && `Chest: ${f.chest}"`,
    f.waist && `Waist: ${f.waist}"`,
    f.length && `Length: ${f.length}"`,
    f.rise && `Rise: ${f.rise}"`,
    f.shoulders && `Shoulders: ${f.shoulders}"`,
  ]
    .filter(Boolean)
    .join("\n");

  return encodeURIComponent(
    `${base}*Order Type:* Customise Existing Design\n*Selected Piece:* ${product?.name ?? f.product} (Style No. ${product?.styleNo ?? ""})\n*Price:* ₹${product?.price?.toLocaleString("en-IN") ?? ""}\n\n*Measurements:*\n${measurements}${f.notes ? `\n\n*Notes:* ${f.notes}` : ""}`
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface CustomOrderFormProps {
  preselectedProductId?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomOrderForm({ preselectedProductId }: CustomOrderFormProps) {
  const [orderMode, setOrderMode] = useState<OrderMode>("");
  const [newForm, setNewForm] = useState<NewCustomFields>(INITIAL_NEW);
  const [existingForm, setExistingForm] = useState<ExistingFields>({
    ...INITIAL_EXISTING,
    product: preselectedProductId ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const customizableProducts = PRODUCTS.filter((p) => p.isCustomizable);

  // ── Field updaters ──
  const updateNew = (field: keyof NewCustomFields, value: string) => {
    setNewForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateExisting = (field: keyof ExistingFields, value: string) => {
    setExistingForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Validation ──
  const validateBase = (f: BaseFields): FormErrors => {
    const e: FormErrors = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!f.phone || f.phone.replace(/\D/g, "").length < 10) e.phone = "Valid 10-digit phone required";
    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Valid email required";
    return e;
  };

  const validate = (): boolean => {
    if (!orderMode) {
      setErrors({ orderMode: "Please select an order type" });
      return false;
    }
    if (orderMode === "new-custom") {
      const e = { ...validateBase(newForm) };
      if (!newForm.designRequirements.trim()) e.designRequirements = "Please describe your design requirements";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    // existing
    const e = { ...validateBase(existingForm) };
    if (!existingForm.product) e.product = "Please select a piece";
    if (!existingForm.height.trim()) e.height = "Height is required";
    if (!existingForm.chest.trim()) e.chest = "Chest measurement is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const form = orderMode === "new-custom" ? newForm : existingForm;
    const waMsg = buildWhatsAppMessage(orderMode, form);
    const waUrl = `https://wa.me/918796134073?text=${waMsg}`;

    setSubmitted(true);

    // Open WhatsApp after a short delay so the success screen renders first
    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 600);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-6 max-w-lg mx-auto space-y-5"
      >
        <div className="w-16 h-16 rounded-full bg-[#c9a96e]/20 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-light text-[#1a2744]">Order Received!</h2>
        <p className="text-sm text-[#3a3a3a] leading-relaxed">
          Thank you,{" "}
          <strong>{orderMode === "new-custom" ? newForm.name : existingForm.name}</strong>. We&apos;re opening WhatsApp with your order details pre-filled — just hit Send!
        </p>
        <p className="text-xs text-[#1a2744]/50 bg-[#f5f0e8] px-4 py-3 inline-block rounded-sm">
          Our team will confirm within 24 hours. 📱 +91 8796134073
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto space-y-8">

      {/* ── Step 1: Order Type Selection ── */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-light text-[#1a2744]">How would you like to order?</h2>
        {errors.orderMode && (
          <p className="text-red-500 text-xs" role="alert">{errors.orderMode}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              {
                value: "new-custom" as OrderMode,
                title: "New Custom Order",
                desc: "Have a design in mind? Describe it and we'll bring it to life from scratch.",
                icon: "✏️",
              },
              {
                value: "customize-existing" as OrderMode,
                title: "Customise Our Designs",
                desc: "Pick from our catalogue and we'll tailor it to your exact measurements.",
                icon: "📐",
              },
            ] as { value: OrderMode; title: string; desc: string; icon: string }[]
          ).map(({ value, title, desc, icon }) => (
            <label
              key={value}
              className={`relative flex flex-col gap-2 border-2 rounded-sm p-5 cursor-pointer transition-all ${
                orderMode === value
                  ? "border-[#c9a96e] bg-[#c9a96e]/5"
                  : "border-[#e8e0d0] hover:border-[#1a2744]/30"
              }`}
            >
              <input
                type="radio"
                name="orderMode"
                value={value}
                checked={orderMode === value}
                onChange={() => {
                  setOrderMode(value);
                  setErrors({});
                }}
                className="sr-only"
              />
              {/* Custom radio indicator */}
              <div
                className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  orderMode === value ? "border-[#c9a96e]" : "border-[#e8e0d0]"
                }`}
              >
                {orderMode === value && (
                  <div className="w-2 h-2 rounded-full bg-[#c9a96e]" />
                )}
              </div>
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-semibold text-[#1a2744] tracking-wide">{title}</span>
              <span className="text-xs text-[#1a2744]/60 leading-relaxed">{desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Step 2: Conditional Fields ── */}
      <AnimatePresence mode="wait">
        {orderMode === "new-custom" && (
          <motion.div
            key="new-custom"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-5 border-t border-[#e8e0d0] pt-6"
          >
            <h3 className="text-base font-medium text-[#1a2744] tracking-wide">Your Details</h3>

            <BaseFieldSet
              values={newForm}
              errors={errors}
              onUpdate={updateNew}
            />

            {/* Design requirements */}
            <div>
              <label htmlFor="designReq" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Design Requirements *
              </label>
              <textarea
                id="designReq"
                value={newForm.designRequirements}
                onChange={(e) => updateNew("designRequirements", e.target.value)}
                rows={5}
                maxLength={500}
                className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none ${
                  errors.designRequirements ? "border-red-400" : "border-[#e8e0d0]"
                }`}
                placeholder="Describe your dream outfit — occasion, silhouette, fabric preferences, colour, reference images (mention links or we can discuss on WhatsApp)..."
              />
              <div className="flex justify-between">
                {errors.designRequirements && (
                  <p className="text-red-500 text-xs mt-1" role="alert">{errors.designRequirements}</p>
                )}
                <p className="text-xs text-[#1a2744]/30 text-right mt-1 ml-auto">{newForm.designRequirements.length}/500</p>
              </div>
            </div>
          </motion.div>
        )}

        {orderMode === "customize-existing" && (
          <motion.div
            key="customize-existing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-5 border-t border-[#e8e0d0] pt-6"
          >
            <h3 className="text-base font-medium text-[#1a2744] tracking-wide">Your Details</h3>

            <BaseFieldSet
              values={existingForm}
              errors={errors}
              onUpdate={updateExisting}
            />

            {/* Product dropdown */}
            <div>
              <label htmlFor="product" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Select a Piece *
              </label>
              <select
                id="product"
                value={existingForm.product}
                onChange={(e) => updateExisting("product", e.target.value)}
                className={`w-full border bg-white px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors cursor-pointer ${
                  errors.product ? "border-red-400" : "border-[#e8e0d0]"
                }`}
              >
                <option value="">— Select a Piece —</option>
                {customizableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Style {p.styleNo}) — ₹{p.price.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
              {errors.product && (
                <p className="text-red-500 text-xs mt-1" role="alert">{errors.product}</p>
              )}
            </div>

            {/* Measurements */}
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#1a2744]">
                Your Measurements
              </p>
              <p className="text-xs text-[#1a2744]/50 leading-relaxed">
                All in inches unless noted. Measure over fitted undergarments.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { field: "height", label: "Height (cms)", required: true, placeholder: "e.g. 165" },
                    { field: "chest", label: "Chest (inches)", required: true, placeholder: "e.g. 34" },
                    { field: "waist", label: "Waist (inches)", required: false, placeholder: "e.g. 28" },
                    { field: "length", label: "Length (inches)", required: false, placeholder: "e.g. 40" },
                    { field: "rise", label: "Rise (inches)", required: false, placeholder: "e.g. 10" },
                    { field: "shoulders", label: "Shoulders (inches)", required: false, placeholder: "e.g. 15" },
                  ] as { field: keyof ExistingFields; label: string; required: boolean; placeholder: string }[]
                ).map(({ field, label, required, placeholder }) => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-xs tracking-[0.15em] uppercase text-[#1a2744] font-medium mb-2">
                      {label} {required && "*"}
                    </label>
                    <input
                      id={field}
                      type="text"
                      inputMode="decimal"
                      value={existingForm[field]}
                      onChange={(e) => updateExisting(field, e.target.value)}
                      className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${
                        errors[field] ? "border-red-400" : "border-[#e8e0d0]"
                      }`}
                      placeholder={placeholder}
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-xs mt-1" role="alert">{errors[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Unique Requirements (optional)
              </label>
              <textarea
                id="notes"
                value={existingForm.notes}
                onChange={(e) => updateExisting("notes", e.target.value)}
                rows={3}
                maxLength={300}
                className="w-full border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none"
                placeholder="Any unique features, colour preferences, or special requests..."
              />
              <p className="text-xs text-[#1a2744]/30 text-right mt-1">{existingForm.notes.length}/300</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ── */}
      {orderMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <button
            type="submit"
            className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors flex items-center justify-center gap-3"
          >
            {/* WhatsApp icon */}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send via WhatsApp
          </button>
          <p className="text-xs text-[#1a2744]/40 text-center leading-relaxed">
            This will open WhatsApp with your order details pre-filled. Our team responds within 24 hours.
          </p>
        </motion.div>
      )}
    </form>
  );
}

// ─── Shared base fields sub-component ─────────────────────────────────────────
function BaseFieldSet({
  values,
  errors,
  onUpdate,
}: {
  values: BaseFields;
  errors: FormErrors;
  onUpdate: (field: keyof BaseFields, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      {(
        [
          { field: "name", label: "Full Name", type: "text", placeholder: "Priya Sharma", required: true },
          { field: "phone", label: "Phone Number", type: "tel", placeholder: "+91 87961 34073", required: true },
          { field: "email", label: "Email Address", type: "email", placeholder: "you@email.com", required: true },
        ] as { field: keyof BaseFields; label: string; type: string; placeholder: string; required: boolean }[]      ).map(({ field, label, type, placeholder }) => (
        <div key={field}>
          <label htmlFor={`base-${field}`} className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
            {label} *
          </label>
          <input
            id={`base-${field}`}
            type={type}
            value={values[field]}
            onChange={(e) => onUpdate(field, e.target.value)}
            className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${
              errors[field] ? "border-red-400" : "border-[#e8e0d0]"
            }`}
            placeholder={placeholder}
          />
          {errors[field] && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
