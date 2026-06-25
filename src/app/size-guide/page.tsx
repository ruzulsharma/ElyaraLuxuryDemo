import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Elyara sizing guide. How to measure yourself for a perfect custom fit. All pieces are available in custom measurements.",
};

// ─── Editable size table data ─────────────────────────────────────────────────
const SIZE_TABLE = [
  { size: "XS", bust: "32\"", waist: "26\"", hip: "35\"", height: "158–162 cm" },
  { size: "S",  bust: "34\"", waist: "28\"", hip: "37\"", height: "160–165 cm" },
  { size: "M",  bust: "36\"", waist: "30\"", hip: "39\"", height: "163–168 cm" },
  { size: "L",  bust: "38\"", waist: "32\"", hip: "41\"", height: "165–170 cm" },
  { size: "XL", bust: "40\"", waist: "34\"", hip: "43\"", height: "168–173 cm" },
];

const HOW_TO_MEASURE = [
  {
    label: "Bust",
    instruction:
      "Measure around the fullest part of your chest, keeping the tape parallel to the floor. Do not hold breath.",
  },
  {
    label: "Waist",
    instruction:
      "Measure around your natural waistline — the narrowest part of your torso, usually 2\" above the navel.",
  },
  {
    label: "Hip",
    instruction:
      "Measure around the fullest part of your hips and seat, roughly 8\" below the natural waistline.",
  },
  {
    label: "Height",
    instruction:
      "Stand straight against a wall without shoes. Measure from the floor to the top of your head.",
  },
  {
    label: "Shoulder",
    instruction:
      "Measure across the back from one shoulder point to the other, following the natural line of your shoulders.",
  },
  {
    label: "Length",
    instruction:
      "For tops: measure from the highest shoulder point to where you want the garment to end. For trousers: inseam length.",
  },
];

export default function SizeGuidePage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2744] py-16 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">
          Your Perfect Fit
        </p>
        <h1 className="text-4xl font-serif font-light text-white mb-3">Size Guide</h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          All Elyara pieces are available in custom measurements at no extra charge. This guide is for our standard size reference.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-14">

        {/* Custom order note */}
        <div className="bg-[#c9a96e]/10 border border-[#c9a96e]/30 p-5 flex gap-4 items-start">
          <span className="text-2xl flex-shrink-0">📏</span>
          <div>
            <p className="text-sm font-semibold text-[#1a2744] mb-1">We Make It For You</p>
            <p className="text-xs text-[#1a2744]/70 leading-relaxed">
              Every Elyara piece can be made to your exact measurements — at the same price. Use the table below as a guide, or{" "}
              <Link href="/custom-order" className="text-[#c9a96e] underline hover:no-underline">
                place a custom order
              </Link>{" "}
              with your measurements directly.
            </p>
          </div>
        </div>

        {/* Size Table */}
        <div>
          <h2 className="text-xl font-serif font-light text-[#1a2744] mb-6">Standard Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a2744] text-white">
                  {["Size", "Bust", "Waist", "Hip", "Height"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-[0.15em] uppercase font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-b border-[#e8e0d0] ${i % 2 === 0 ? "bg-white" : "bg-[#f5f0e8]"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-[#c9a96e]">{row.size}</td>
                    <td className="px-4 py-3 text-[#1a2744]">{row.bust}</td>
                    <td className="px-4 py-3 text-[#1a2744]">{row.waist}</td>
                    <td className="px-4 py-3 text-[#1a2744]">{row.hip}</td>
                    <td className="px-4 py-3 text-[#1a2744]">{row.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div>
          <h2 className="text-xl font-serif font-light text-[#1a2744] mb-6">How to Measure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_TO_MEASURE.map((item) => (
              <div key={item.label} className="border border-[#e8e0d0] p-5 space-y-2">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#c9a96e]">{item.label}</h3>
                <p className="text-sm text-[#3a3a3a] leading-relaxed">{item.instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3">
          <p className="text-sm text-[#1a2744]/60">Not sure about your size? Send us your measurements directly.</p>
          <Link
            href="/custom-order"
            className="inline-block bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
          >
            Place Custom Order
          </Link>
        </div>
      </div>
    </div>
  );
}
