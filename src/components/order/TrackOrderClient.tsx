"use client";

import { useState, useTransition } from "react";
import { lookupOrderAction } from "@/lib/actions/order.actions";

const STATUS_STEPS = [
  { key: "created", label: "Order Created", icon: "📝" },
  { key: "placed", label: "Payment Verified", icon: "✅" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "fulfilled", label: "Delivered", icon: "🎉" },
];

const STATUS_COLOURS: Record<string, string> = {
  placed: "bg-amber-100 text-amber-800",
  pending_payment: "bg-yellow-100 text-yellow-800",
  payment_confirmed: "bg-blue-100 text-blue-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
};

interface OrderResult {
  order_number: string;
  status: string;
  customer_name: string;
  total_paise: number;
  items: { product_name: string; quantity: number }[];
  created_at: string;
  shipping_address: { city: string; state: string; pincode: string };
}

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter your order number.");
      return;
    }

    setError("");
    setOrder(null);

    startTransition(async () => {
      const result = await lookupOrderAction(trimmed);
      if (result.success && result.order) {
        setOrder(result.order as unknown as OrderResult);
      } else {
        setError(result.error ?? "Order not found. Please check the order number and try again.");
      }
    });
  };

  // Determine which step is active
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order?.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : -1;

  return (
    <div className="space-y-8">
      {/* Search box */}
      <div className="bg-white border border-[#e8e0d0] p-6 space-y-4">
        <label className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium">
          Order Number
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => { setOrderNumber(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. ELY-M1K2ABC"
            className="flex-1 border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors uppercase"
          />
          <button
            onClick={handleSearch}
            disabled={isPending}
            className="bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-6 py-3 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isPending ? "Searching…" : "Track"}
          </button>
        </div>
        {error && (
          <p role="alert" className="text-red-500 text-xs">{error}</p>
        )}
        <p className="text-[10px] text-[#1a2744]/40">
          Your order number was shared via WhatsApp or on the confirmation page after checkout.
        </p>
      </div>

      {/* Order result */}
      {order && (
        <div className="bg-white border border-[#e8e0d0] p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-mono text-xs text-[#c9a96e] font-medium">{order.order_number}</p>
              <p className="text-sm font-medium text-[#1a2744] mt-1">{order.customer_name}</p>
              <p className="text-xs text-[#1a2744]/50">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 text-[10px] tracking-wide font-medium uppercase rounded-sm ${STATUS_COLOURS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status.replace(/_/g, " ")}
              </span>
              <p className="text-lg font-bold text-[#1a2744] mt-1">
                ₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Status timeline */}
          <div className="space-y-0">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium mb-3">
              Order Progress
            </p>
            <div className="flex items-center gap-2">
              {STATUS_STEPS.map((step, i) => (
                <div key={step.key} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    i <= activeStep
                      ? "bg-[#c9a96e] text-white"
                      : "bg-[#e8e0d0] text-[#1a2744]/30"
                  }`}>
                    {step.icon}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${i < activeStep ? "bg-[#c9a96e]" : "bg-[#e8e0d0]"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              {STATUS_STEPS.map((step, i) => (
                <p key={step.key} className={`flex-1 text-[9px] text-center ${i <= activeStep ? "text-[#1a2744]" : "text-[#1a2744]/30"}`}>
                  {step.label}
                </p>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-[#e8e0d0] pt-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium mb-2">Items</p>
            <div className="space-y-1">
              {order.items?.map((item, i) => (
                <p key={i} className="text-sm text-[#1a2744]">
                  {item.product_name} <span className="text-[#1a2744]/40">×{item.quantity}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Shipping */}
          {order.shipping_address && (
            <div className="border-t border-[#e8e0d0] pt-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium mb-1">Shipping To</p>
              <p className="text-xs text-[#1a2744]">
                {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}
              </p>
            </div>
          )}

          {/* Help */}
          <div className="bg-[#f5f0e8] border border-[#e8e0d0] p-4 text-xs text-[#1a2744]/60">
            Need help? <a href="https://wa.me/918796134073" target="_blank" rel="noopener noreferrer" className="text-[#c9a96e] hover:underline">WhatsApp us</a> with your order number.
          </div>
        </div>
      )}
    </div>
  );
}
