"use client";

import { useState } from "react";

interface OrderResult {
  order_number: string;
  status: string;
  customer_name: string;
  total_paise: number;
  items: { product_name: string; quantity: number }[];
  created_at: string;
  notes: string | null;
}

const STATUS_STEPS = ["placed", "payment_confirmed", "in_production", "shipped", "fulfilled"];

const STATUS_LABELS: Record<string, string> = {
  placed: "Order Placed",
  pending_payment: "Awaiting Payment",
  payment_confirmed: "Payment Confirmed",
  confirmed: "Confirmed",
  in_production: "Being Crafted",
  shipped: "Shipped",
  delivered: "Delivered",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    const trimmed = orderId.trim();
    if (!trimmed) {
      setError("Please enter an order number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Order not found.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="space-y-8">
      {/* Search form */}
      <form onSubmit={handleTrack} className="space-y-4">
        <div>
          <label htmlFor="orderId" className="block text-xs tracking-[0.2em] uppercase text-[#1a2744] font-medium mb-2">
            Order Number
          </label>
          <input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="e.g. ELY-M4K8XY2"
            className="w-full border border-[#e8e0d0] bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors uppercase font-mono"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a2744] text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-60"
        >
          {loading ? "Searching…" : "Track Order"}
        </button>
      </form>

      {/* Order result */}
      {order && (
        <div className="bg-white border border-[#e8e0d0] p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-[#c9a96e] font-medium">{order.order_number}</p>
              <p className="text-sm font-medium text-[#1a2744] mt-0.5">{order.customer_name}</p>
              <p className="text-xs text-[#1a2744]/50">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </p>
            </div>
            <p className="text-base font-bold text-[#1a2744]">
              ₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Status progress */}
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium">Status</p>

            {order.status === "cancelled" ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-sm">
                This order has been cancelled.
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex flex-col items-center gap-1">
                    {/* Dot */}
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        i <= currentStep
                          ? "bg-[#c9a96e] border-[#c9a96e]"
                          : "bg-white border-[#e8e0d0]"
                      }`}
                    />
                    {/* Line */}
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`w-full h-0.5 ${
                          i < currentStep ? "bg-[#c9a96e]" : "bg-[#e8e0d0]"
                        }`}
                      />
                    )}
                    {/* Label */}
                    <p className={`text-[8px] tracking-wide text-center leading-tight ${
                      i <= currentStep ? "text-[#1a2744] font-medium" : "text-[#1a2744]/30"
                    }`}>
                      {STATUS_LABELS[step] ?? step}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-t border-[#e8e0d0] pt-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium mb-2">Items</p>
            <div className="space-y-1 text-sm text-[#1a2744]/70">
              {order.items?.map((item, i) => (
                <p key={i}>
                  {item.product_name} <span className="text-[#1a2744]/30">×{item.quantity}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-[#f5f0e8] border border-[#e8e0d0] p-3 text-xs text-[#1a2744]/60 leading-relaxed">
            Questions about your order?{" "}
            <a
              href={`https://wa.me/918796134073?text=${encodeURIComponent(`Hi, I have a question about order ${order.order_number}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a96e] hover:underline font-medium"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
