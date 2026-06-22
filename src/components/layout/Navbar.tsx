"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "Custom Order", href: "/custom-order" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#1a2744] text-[#c9a96e] text-xs tracking-[0.25em] uppercase font-medium text-center py-2.5 px-4 flex items-center justify-center gap-4"
          >
            <span>Free shipping on orders above ₹5,000 · All pieces are made-to-order with love</span>
            <button
              onClick={() => setAnnouncementVisible(false)}
              className="ml-2 text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors text-base leading-none"
              aria-label="Close announcement"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#faf8f4]/95 backdrop-blur-sm shadow-sm border-b border-[#e8e0d0]"
            : "bg-[#faf8f4] border-b border-[#e8e0d0]"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/Logo.jpg"
                alt="Elyara by Sweety"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-[0.15em] text-[#1a2744] uppercase">Elyara</span>
              <span className="text-[10px] tracking-[0.2em] text-[#c9a96e] uppercase font-medium">By Sweety</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
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

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Link
              href="/shop"
              aria-label="Search"
              className="text-[#3a3a3a] hover:text-[#1a2744] transition-colors hidden sm:block"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart — ${cartCount} items`}
              className="relative text-[#3a3a3a] hover:text-[#1a2744] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#c9a96e] text-white text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-[#1a2744] p-1"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-[#faf8f4] border-t border-[#e8e0d0]"
            >
              <ul className="px-6 py-6 space-y-5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-sm tracking-[0.2em] uppercase font-medium text-[#1a2744] block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
