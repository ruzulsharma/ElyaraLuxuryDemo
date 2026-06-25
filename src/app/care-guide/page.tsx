import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Care Instructions",
  description:
    "How to care for your Elyara garments. Washing, drying, storage, and repair guidance for bespoke Indian fashion.",
};

// ─── Editable content sections — update these to manage the page ──────────────
const CARE_SECTIONS = [
  {
    icon: "🌊",
    title: "Washing",
    content: [
      "Hand wash in cold water with a mild detergent. Never wring or twist the fabric.",
      "For embroidered or embellished pieces (Inaya, Piya), dry-clean only.",
      "Turn garments inside out before washing to protect surface embroidery.",
    ],
  },
  {
    icon: "💨",
    title: "Drying",
    content: [
      "Lay flat to dry away from direct sunlight to prevent colour fading.",
      "Never tumble dry. The heat can damage delicate fabric structures.",
      "For brocade pieces (Mira), steam-dry only — do not iron directly.",
    ],
  },
  {
    icon: "🧺",
    title: "Storage",
    content: [
      "Store in the Elyara garment bag provided with your order.",
      "Hang on padded hangers to preserve the garment's silhouette.",
      "Avoid plastic covers — breathable cotton bags protect better.",
    ],
  },
  {
    icon: "✂️",
    title: "Repairs",
    content: [
      "Minor repairs (loose threads, hooks) can be handled at home with basic sewing kits.",
      "For structural repairs or alterations, contact us at elyarabysweety@gmail.com.",
      "All Elyara pieces carry a 3-month craftsmanship warranty on seam integrity.",
    ],
  },
];

export default function CareGuidePage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2744] py-16 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">
          Preserve Your Piece
        </p>
        <h1 className="text-4xl font-serif font-light text-white mb-3">Care Instructions</h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          Elyara garments are handcrafted from premium fabrics. The right care keeps them looking exceptional for years.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        {CARE_SECTIONS.map((section) => (
          <div key={section.title} className="border border-[#e8e0d0] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-lg font-serif font-light text-[#1a2744]">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.content.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#3a3a3a] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] flex-shrink-0 mt-2" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* CTA */}
        <div className="text-center pt-4 space-y-3">
          <p className="text-sm text-[#1a2744]/60">Have a specific care question about your garment?</p>
          <Link
            href="/contact"
            className="inline-block border-2 border-[#1a2744] text-[#1a2744] text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
