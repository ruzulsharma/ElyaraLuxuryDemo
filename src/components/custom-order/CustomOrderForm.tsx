"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/data";

interface FormData {
  name: string;
  email: string;
  phone: string;
  product: string;
  waist: string;
  length: string;
  rise: string;
  chest: string;
  height: string;
  shoulders: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  name: "", email: "", phone: "",
  product: "",
  waist: "", length: "", rise: "",
  chest: "", height: "", shoulders: "",
  notes: "",
};

interface CustomOrderFormProps {
  preselectedProductId?: string;
}

export default function CustomOrderForm({ preselectedProductId }: CustomOrderFormProps) {
  const [form, setForm] = useState<FormData>({
    ...INITIAL_FORM,
    product: preselectedProductId || "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const customizableProducts = PRODUCTS.filter((p) => p.isCustomizable);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep1 = () => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone || form.phone.length < 10) errs.phone = "Valid phone number required";
    if (!form.product) errs.product = "Please select a product";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Partial<FormData> = {};
    if (!form.height.trim()) errs.height = "Height is required";
    if (!form.chest.trim()) errs.chest = "Chest measurement is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-6 max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-[#c9a96e]/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-light text-[#1a2744] mb-3">Order Received</h2>
        <p className="text-[#3a3a3a] text-sm leading-relaxed mb-6">
          Thank you, {form.name}. Our team will review your measurements and reach out within 24 hours to confirm your custom order and share the payment details.
        </p>
        <p className="text-xs text-[#1a2744]/50 bg-[#f5f0e8] px-4 py-3 inline-block">
          Confirmation sent to <strong>{form.email}</strong>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-10">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step >= s ? "text-[#1a2744]" : "text-[#1a2744]/30"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                step > s ? "bg-[#c9a96e] border-[#c9a96e] text-white" :
                step === s ? "border-[#1a2744] text-[#1a2744]" :
                "border-[#1a2744]/20 text-[#1a2744]/30"
              }`}>
                {step > s ? "✓" : s}
              </div>
              <span className="text-xs tracking-[0.15em] uppercase font-medium hidden sm:block">
                {s === 1 ? "Your Details" : "Measurements"}
              </span>
            </div>
            {s < 2 && <div className={`flex-1 h-px ${step > 1 ? "bg-[#c9a96e]" : "bg-[#e8e0d0]"}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-serif font-light text-[#1a2744]">Your Details</h2>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${errors.name ? "border-red-400" : "border-[#e8e0d0]"}`}
                placeholder="Priya Sharma"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${errors.email ? "border-red-400" : "border-[#e8e0d0]"}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${errors.phone ? "border-red-400" : "border-[#e8e0d0]"}`}
                placeholder="+91 99999 99999"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1" role="alert">{errors.phone}</p>}
            </div>

            {/* Product Select */}
            <div>
              <label htmlFor="product" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Select Product *
              </label>
              <select
                id="product"
                value={form.product}
                onChange={(e) => updateField("product", e.target.value)}
                className={`w-full border bg-white px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors cursor-pointer ${errors.product ? "border-red-400" : "border-[#e8e0d0]"}`}
              >
                <option value="">— Select a Piece —</option>
                {customizableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
              {errors.product && <p className="text-red-500 text-xs mt-1" role="alert">{errors.product}</p>}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
            >
              Continue to Measurements
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-serif font-light text-[#1a2744] mb-1">Your Measurements</h2>
              <p className="text-xs text-[#1a2744]/50 leading-relaxed">
                All measurements in inches unless noted. We recommend measuring over well-fitted undergarments.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { field: "height" as keyof FormData, label: "Height (cms)", required: true, placeholder: "e.g. 165" },
                { field: "chest" as keyof FormData, label: "Chest (inches)", required: true, placeholder: "e.g. 34" },
                { field: "waist" as keyof FormData, label: "Waist (inches)", required: false, placeholder: "e.g. 28" },
                { field: "length" as keyof FormData, label: "Length (inches)", required: false, placeholder: "e.g. 40" },
                { field: "rise" as keyof FormData, label: "Rise (inches)", required: false, placeholder: "e.g. 10" },
                { field: "shoulders" as keyof FormData, label: "Shoulders (inches)", required: false, placeholder: "e.g. 15" },
              ].map(({ field, label, required, placeholder }) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-xs tracking-[0.15em] uppercase text-[#1a2744] font-medium mb-2">
                    {label} {required && "*"}
                  </label>
                  <input
                    id={field}
                    type="text"
                    inputMode="decimal"
                    value={form[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${errors[field] ? "border-red-400" : "border-[#e8e0d0]"}`}
                    placeholder={placeholder}
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1" role="alert">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
                Unique Requirements (optional)
              </label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
                maxLength={300}
                className="w-full border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none"
                placeholder="Let us know your unique features, we'll modify the pattern to ensure it works for you..."
              />
              <p className="text-xs text-[#1a2744]/30 text-right mt-1">{form.notes.length}/300</p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border-2 border-[#e8e0d0] text-[#1a2744]/60 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:border-[#1a2744]/30 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
              >
                Submit Custom Order
              </button>
            </div>

            <p className="text-xs text-[#1a2744]/40 text-center leading-relaxed">
              Our team will contact you within 24 hours to confirm your order and share payment details.
            </p>
          </motion.div>
        )}
      </form>
    </div>
  );
}
