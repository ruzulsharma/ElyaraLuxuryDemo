import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="min-h-[70vh] bg-[#faf8f4] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="relative w-14 h-14 mx-auto">
          <Image src="/assets/Logo.jpg" alt="Elyara" fill className="object-contain rounded-full" />
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-light text-[#1a2744]">Order Confirmed!</h1>
          <p className="text-sm text-[#3a3a3a] leading-relaxed">
            Thank you for your order. Our atelier has received it and will begin crafting your piece within 1–2 business days.
          </p>
        </div>

        {ref && (
          <p className="text-xs font-mono text-[#1a2744]/50 bg-[#f5f0e8] px-4 py-3 inline-block">
            Order Ref: <strong>{ref}</strong>
          </p>
        )}

        <div className="text-sm text-[#1a2744]/60 bg-[#f5f0e8] border border-[#e8e0d0] p-4 text-left space-y-2">
          <p className="font-medium text-[#1a2744]">What happens next?</p>
          <ul className="space-y-1 text-xs">
            <li>✂️ Your piece is cut and crafted by hand (7–14 working days)</li>
            <li>📦 We ship via trusted courier with tracking</li>
            <li>📱 Sweety may contact you on WhatsApp for fit confirmation</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors">
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/918796134073"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#1a2744] text-[#1a2744] text-xs tracking-[0.2em] uppercase font-bold px-8 py-4 hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
