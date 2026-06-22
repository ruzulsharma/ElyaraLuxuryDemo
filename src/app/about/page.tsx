import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Our Story",
  description:
    "Learn about Elyara by Sweety — a Noida-based luxury atelier born from an obsession with form, structure, and the art of bespoke Indian fashion.",
};

const VALUES = [
  {
    title: "Craft First",
    description:
      "Every piece is cut, stitched, and finished entirely by hand. We refuse shortcuts because we believe the body deserves nothing less than full attention.",
  },
  {
    title: "Made to Fit",
    description:
      "Off-the-shelf fashion was never designed for you. Every Elyara garment is available as a custom fit — tailored to your exact measurements.",
  },
  {
    title: "Slow Fashion",
    description:
      "We produce in limited quantities. Quality over volume, always. Each collection is a considered act — not a response to trend cycles.",
  },
  {
    title: "Indian Heritage",
    description:
      "Our roots are in Indian textile craft. We source premium Indian fabrics and work with local artisans, keeping the value chain close to home.",
  },
];

const PROCESS = [
  {
    num: "01",
    title: "The Genesis Sketch",
    description:
      "Every piece begins in complete silence. We draft raw architectural lines on heavy-gauge vellum, deliberately distorting human proportions to create striking modern postures.",
    image: "/assets/hero_files/main1.jpg",
  },
  {
    num: "02",
    title: "Textile Curation",
    description:
      "Sourcing is a relentless pursuit of weight and behaviour. We curate custom textiles that absorb light rather than reflect it, establishing absolute depth along structural folds.",
    image: "/assets/hero_files/Hero1.jpg",
  },
  {
    num: "03",
    title: "Pattern & Cut",
    description:
      "Hand-drafted dimensional panels with rigid architectural geometry. Fabric is carefully manipulated to the millimeter, allowing natural drape under its own gravity.",
    image: "/assets/hero_files/Hero2.jpg",
  },
  {
    num: "04",
    title: "Handcrafted Finish",
    description:
      "The final garment is assembled, checked, and personally approved by Sweety before it leaves our atelier. No exceptions.",
    image: "/assets/hero_files/main2.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Hero */}
      <div className="bg-[#1a2744] py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/assets/hero_files/elyara.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-white mb-4 leading-tight">
            Fashion as Architecture
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-serif italic">
            &ldquo;We do not produce fashion; we assemble physical architecture for the body.&rdquo;
          </p>
          <p className="text-[#c9a96e] text-sm mt-3">— Sweety, Founder</p>
        </div>
      </div>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square max-w-lg">
            <Image
              src="/assets/hero_files/elyara.jpg"
              alt="Sweety — Founder of Elyara"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#c9a96e] -z-10" />
          </div>
          <div className="space-y-6">
            <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] font-medium">The Founder</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744] leading-snug">
              Sweety & the birth of Elyara
            </h2>
            <div className="space-y-4 text-[#3a3a3a] leading-relaxed">
              <p>
                Elyara was founded in Noida by Sweety — a designer whose obsession with raw lines, sculptural silhouettes, and structural geometry had no outlet in the mainstream Indian fashion industry.
              </p>
              <p>
                After years of studying craft traditions and international avant-garde movements, Sweety established the Elyara atelier as a space where Indian textile heritage meets modern architectural thinking.
              </p>
              <p>
                Today, every Elyara piece is designed, cut, and finished at our Noida studio. No outsourcing. No mass production. Just craft, made for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="bg-[#1a2744] py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">What We Stand For</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value) => (
              <div key={value.title} className="border border-white/10 p-6 space-y-3">
                <h3 className="text-base font-medium tracking-wide text-[#c9a96e]">{value.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] font-medium mb-2">Behind the Seams</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1a2744]">Our Process</h2>
        </div>

        <div className="space-y-20">
          {PROCESS.map((step, idx) => (
            <div
              key={step.num}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? "" : ""}`}
            >
              <div className={`${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e0d0]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className={`space-y-4 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                <p className="text-5xl font-serif font-light text-[#c9a96e]/30">{step.num}</p>
                <h3 className="text-2xl font-serif font-light text-[#1a2744]">{step.title}</h3>
                <p className="text-[#3a3a3a] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="bg-[#f5f0e8] py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a96e] font-medium">Our Commitment</p>
          <h2 className="text-3xl font-serif font-light text-[#1a2744]">Sustainability & Ethics</h2>
          <p className="text-[#3a3a3a] leading-relaxed">
            We believe luxury and responsibility are not in conflict. Our fabrics are sourced from certified Indian mills. We produce in small batches to minimise waste. Our packaging is fully recyclable. And we pay our artisans fairly — always.
          </p>
          <Link
            href="/custom-order"
            className="inline-block bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
          >
            Order a Piece With Purpose
          </Link>
        </div>
      </section>
    </div>
  );
}
