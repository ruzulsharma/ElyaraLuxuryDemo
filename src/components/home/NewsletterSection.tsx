"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    setError("");
  };

  return (
    <section className="bg-[#1a2744] py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium">Stay Connected</p>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white">
            First access to new drops,<br />exclusive offers & more.
          </h2>
          <p className="text-white/50 text-sm">
            Subscribe and get 10% off your first custom order.
          </p>

          {submitted ? (
            <div className="bg-[#c9a96e]/10 border border-[#c9a96e]/30 text-[#c9a96e] px-6 py-4 text-sm tracking-wide">
              Welcome to Elyara. We&apos;ll be in touch soon. ✨
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-[#c9a96e] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-6 py-3.5 hover:bg-[#b8935a] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2" role="alert">{error}</p>
              )}
            </form>
          )}
          <p className="text-white/30 text-xs">No spam, ever. Unsubscribe at any time.</p>
        </motion.div>
      </div>
    </section>
  );
}
