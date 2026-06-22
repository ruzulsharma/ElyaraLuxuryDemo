import type { Metadata } from "next";
import CustomOrderForm from "@/components/custom-order/CustomOrderForm";

export const metadata: Metadata = {
  title: "Custom Order — Made for Your Form",
  description:
    "Place a custom order with Elyara by Sweety. Provide your measurements and we'll handcraft your chosen piece to fit your exact form at our Noida atelier.",
};

interface CustomOrderPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function CustomOrderPage({ searchParams }: CustomOrderPageProps) {
  const params = await searchParams;

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2744] py-16 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Bespoke Service</p>
        <h1 className="text-4xl font-serif font-light text-white mb-3">Custom Order</h1>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          Every piece made to your exact measurements. No two Elyara garments are alike.
        </p>
      </div>

      {/* How it works strip */}
      <div className="bg-[#f5f0e8] border-b border-[#e8e0d0] py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { step: "01", label: "Fill the Form" },
            { step: "02", label: "We Review" },
            { step: "03", label: "Handcrafted" },
            { step: "04", label: "Delivered" },
          ].map((s) => (
            <div key={s.step}>
              <p className="text-2xl font-serif font-light text-[#c9a96e] mb-1">{s.step}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <CustomOrderForm preselectedProductId={params.product} />
      </div>
    </div>
  );
}
