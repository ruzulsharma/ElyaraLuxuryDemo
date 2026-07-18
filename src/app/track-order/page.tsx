import type { Metadata } from "next";
import TrackOrderClient from "@/components/order/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your Elyara order using your order number.",
};

export default function TrackOrderPage() {
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <div className="bg-[#1a2744] py-12 px-6 text-center">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-1">Order Status</p>
        <h1 className="text-2xl sm:text-3xl font-serif font-light text-white">Track Your Order</h1>
        <p className="text-white/50 text-sm mt-2 max-w-sm mx-auto">
          Enter your order number to check the current status. No account needed.
        </p>
      </div>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <TrackOrderClient />
      </div>
    </div>
  );
}
