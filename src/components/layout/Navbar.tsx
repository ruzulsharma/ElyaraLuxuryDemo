"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import SearchModal from "@/components/layout/SearchModal";

const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CATEGORY_TAGS = [
  { label: "Coord Sets", href: "/shop?category=coord-sets" },
  { label: "Dresses", href: "/shop?category=dresses" },
  { label: "Tops", href: "/shop?category=tops" },
  { label: "Custom", href: "/custom-order" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#faf8f4]/95 backdrop-blur-md shadow-sm border-b border-[#e8e0d0]"
            : "bg-[#faf8f4] border-b border-[#e8e0d0]"
        }`}
      >
        {/* ── MOBILE NAV ─────────────────────────────────────────────────── */}
        <div className="md:hidden grid grid-cols-3 items-center h-16 px-4">
          {/* Left — hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            className="text-[#1a2744] p-1 -ml-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Centre — wordmark */}
          <Link href="/" className="flex flex-col items-center justify-center leading-none" aria-label="Elyara home">
            <span className="font-serif text-[1.3rem] font-bold tracking-[0.22em] text-[#1a2744] uppercase">
              ELYARA
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#c9a96e] uppercase font-medium mt-0.5">
              By Sweety
            </span>
          </Link>

          {/* Right — search + cart */}
          <div className="flex items-center justify-end gap-3 text-[#1a2744]">
            <button onClick={() => setIsSearchOpen(true)} aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
              </svg>
            </button>
            <button onClick={openCart} className="relative" aria-label={`Cart — ${totalItems} items`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── DESKTOP NAV ────────────────────────────────────────────────── */}
        <nav
          className="hidden md:flex max-w-7xl mx-auto px-8 h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-10 h-10">
              <Image src="/assets/Logo.jpg" alt="Elyara by Sweety" fill className="object-contain rounded-full" priority />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-[0.18em] text-[#1a2744] uppercase">Elyara</span>
              <span className="text-[10px] tracking-[0.22em] text-[#c9a96e] uppercase font-medium">By Sweety</span>
            </div>
          </Link>

          {/* Nav links */}
          <ul className="flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs tracking-[0.18em] uppercase font-medium text-[#3a3a3a] hover:text-[#1a2744] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#c9a96e] group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons — search, profile, cart */}
          <div className="flex items-center gap-4 text-[#1a2744]">
            <button onClick={() => setIsSearchOpen(true)} aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
              </svg>
            </button>

            {/* Profile icon → /login */}
            <Link href="/login" aria-label="Account / Sign in" className="hover:text-[#c9a96e] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <button onClick={openCart} className="relative" aria-label={`Cart — ${totalItems} items`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ── MOBILE DRAWER ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-[60]"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.32 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-[#faf8f4] z-[70] flex flex-col shadow-2xl"
              role="dialog"
              aria-label="Navigation menu"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e0d0]">
                <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex flex-col leading-none">
                  <span className="font-serif text-base font-bold tracking-[0.2em] text-[#1a2744] uppercase">ELYARA</span>
                  <span className="text-[9px] tracking-[0.2em] text-[#c9a96e] uppercase font-medium">By Sweety</span>
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center text-[#1a2744]/50 hover:text-[#1a2744]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Category quick-links */}
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#1a2744]/40 font-medium mb-3">Shop by Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_TAGS.map((tag) => (
                      <Link
                        key={tag.href}
                        href={tag.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="px-3 py-1.5 border border-[#e8e0d0] text-[10px] tracking-[0.15em] uppercase font-medium text-[#1a2744] hover:bg-[#1a2744] hover:text-white transition-colors"
                      >
                        {tag.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Main nav links */}
                <nav aria-label="Mobile navigation">
                  <ul className="space-y-1">
                    {NAV_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 py-3 text-sm tracking-[0.15em] uppercase font-medium text-[#1a2744] hover:text-[#c9a96e] transition-colors group"
                        >
                          <span className="w-4 h-px bg-[#c9a96e]/40 group-hover:w-6 group-hover:bg-[#c9a96e] transition-all duration-300" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/custom-order"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 py-3 text-sm tracking-[0.15em] uppercase font-medium text-[#c9a96e] hover:text-[#1a2744] transition-colors group"
                      >
                        <span className="w-4 h-px bg-[#c9a96e] group-hover:w-6 transition-all duration-300" />
                        Custom Order
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Footer — auth actions */}
              <div className="px-6 py-5 border-t border-[#e8e0d0] space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center w-full py-3 border-2 border-[#1a2744] text-[#1a2744] text-xs tracking-[0.2em] uppercase font-bold hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
                >
                  Create Account
                </Link>

                {/* Contact */}
                <div className="pt-2 flex gap-5 text-xs text-[#1a2744]/40">
                  <a href="tel:+918796134073" className="hover:text-[#c9a96e] transition-colors">+91 87961 34073</a>
                  <a href="mailto:elyarabysweety@gmail.com" className="hover:text-[#c9a96e] transition-colors">Email Us</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
