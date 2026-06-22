import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review your selected Elyara pieces before checkout.",
};

export default function CartPage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <div className="bg-[#1a2744] py-16 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Shopping</p>
        <h1 className="text-4xl font-serif font-light text-white">Your Bag</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 border-2 border-[#e8e0d0] rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-[#1a2744]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-serif font-light text-[#1a2744]">Your bag is empty</h2>
        <p className="text-sm text-[#1a2744]/50">
          Add pieces from our collections or place a custom order.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
          >
            Shop All
          </Link>
          <Link
            href="/custom-order"
            className="inline-block border-2 border-[#1a2744] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            Custom Order
          </Link>
        </div>
      </div>
    </div>
  );
}
