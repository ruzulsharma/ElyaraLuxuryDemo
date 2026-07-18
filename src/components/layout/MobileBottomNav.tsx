"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

/**
 * Fixed bottom navigation for mobile — inspired by Snitch.
 * Layout: Home · Explore · NEW · Cart · Profile
 * Hidden on md+ breakpoint (desktop has its own top nav).
 */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#faf8f4] border-t border-[#e8e0d0] safe-area-pb"
      aria-label="Mobile bottom navigation"
      style={{ position: "fixed" }}
    >
      <div className="grid grid-cols-5 h-14">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive("/") ? "text-[#1a2744]" : "text-[#1a2744]/40"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive("/") ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] font-medium tracking-wide">Home</span>
        </Link>

        {/* Explore / Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive("/shop") || pathname.startsWith("/shop") ? "text-[#1a2744]" : "text-[#1a2744]/40"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
          </svg>
          <span className="text-[9px] font-medium tracking-wide">Explore</span>
        </Link>

        {/* NEW — centre highlight button */}
        <Link
          href="/collections"
          className="flex flex-col items-center justify-center gap-0.5"
        >
          <span className={`text-base font-serif font-bold tracking-[0.1em] uppercase ${
            isActive("/collections") ? "text-[#c9a96e]" : "text-[#1a2744]"
          }`}>
            NEW
          </span>
        </Link>

        {/* Cart */}
        <button
          onClick={openCart}
          className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
            totalItems > 0 ? "text-[#1a2744]" : "text-[#1a2744]/40"
          }`}
          aria-label={`Cart — ${totalItems} items`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium tracking-wide">Cart</span>
        </button>

        {/* Profile */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            isActive("/account") ? "text-[#1a2744]" : "text-[#1a2744]/40"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[9px] font-medium tracking-wide">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
