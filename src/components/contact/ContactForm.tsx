"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SUBJECTS = [
  "Custom Order Enquiry",
  "Product Question",
  "Order Status",
  "Wholesale / Partnership",
  "Press & Media",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.subject) errs.subject = "Please select a subject";
    if (!form.message.trim() || form.message.length < 10) errs.message = "Message is too short";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#f5f0e8] border border-[#e8e0d0] p-8 text-center space-y-3"
      >
        <div className="w-12 h-12 rounded-full bg-[#c9a96e]/20 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-serif font-light text-[#1a2744]">Message Sent</h3>
        <p className="text-sm text-[#3a3a3a]">
          Thank you, {form.name}. We&apos;ll reply to <strong>{form.email}</strong> within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="c-name" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
          Full Name *
        </label>
        <input
          id="c-name"
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${errors.name ? "border-red-400" : "border-[#e8e0d0]"}`}
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="c-email" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
          Email *
        </label>
        <input
          id="c-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${errors.email ? "border-red-400" : "border-[#e8e0d0]"}`}
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="c-subject" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
          Subject *
        </label>
        <select
          id="c-subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={`w-full border bg-white px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors cursor-pointer ${errors.subject ? "border-red-400" : "border-[#e8e0d0]"}`}
        >
          <option value="">— Select Subject —</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p className="text-red-500 text-xs mt-1" role="alert">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="c-message" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
          Message *
        </label>
        <textarea
          id="c-message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          className={`w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none ${errors.message ? "border-red-400" : "border-[#e8e0d0]"}`}
          placeholder="Tell us how we can help..."
        />
        {errors.message && <p className="text-red-500 text-xs mt-1" role="alert">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
