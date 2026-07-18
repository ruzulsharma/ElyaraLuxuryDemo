"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/actions/order.actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Order = any;

const STATUS_COLOURS: Record<string, string> = {
  created: "bg-gray-100 text-gray-700",
  placed: "bg-amber-100 text-amber-800",
  pending_payment: "bg-yellow-100 text-yellow-800",
  payment_confirmed: "bg-blue-100 text-blue-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-orange-100 text-orange-700",
};

// New flow: created → placed → shipped → fulfilled
const STATUS_OPTIONS = [
  { value: "created", label: "Created (awaiting payment)" },
  { value: "placed", label: "Placed (payment verified)" },
  { value: "in_production", label: "In Production" },
  { value: "shipped", label: "Shipped" },
  { value: "fulfilled", label: "Fulfilled / Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

// Build a WhatsApp message with the CURRENT status (or the newly selected one)
function buildWhatsAppUrl(order: Order, statusOverride?: string): string {
  const phone = (order.customer_phone ?? "").replace(/\D/g, "");
  const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;

  const items = (order.items ?? [])
    .map((i: { product_name: string; quantity: number }) => `• ${i.product_name} ×${i.quantity}`)
    .join("\n");

  const total = `₹${((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}`;
  const status = (statusOverride ?? order.status ?? "").replace(/_/g, " ");

  const statusMessages: Record<string, string> = {
    created: "Your order has been received! We'll confirm once payment is verified.",
    placed: "Payment confirmed! ✅ Your piece is being prepared.",
    in_production: "Your piece is now being handcrafted at our atelier. 🪡",
    shipped: "Your order has been shipped! 🚚 You'll receive it soon.",
    fulfilled: "Your order has been delivered! 🎉 We hope you love it.",
    cancelled: "Your order has been cancelled. Contact us if you have questions.",
    refunded: "Your refund has been processed. It'll reflect in 3-5 days.",
  };

  const statusMsg = statusMessages[statusOverride ?? order.status] ?? "Your order status has been updated.";

  const msg = encodeURIComponent(
    `Hi ${order.customer_name} 👋\n\n` +
    `*Elyara Order Update*\n\n` +
    `*Order #:* ${order.order_number}\n` +
    `*Status:* ${status.toUpperCase()}\n\n` +
    `${statusMsg}\n\n` +
    `*Items:*\n${items}\n` +
    `*Total:* ${total}\n\n` +
    `Thank you for choosing Elyara by Sweety 🪡✨\n` +
    `Reply to this message if you have any questions.`
  );

  return `https://wa.me/${fullPhone}?text=${msg}`;
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleStatusUpdate = (orderId: string, order: Order) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        setMessage({ type: "success", text: "Status updated! Opening WhatsApp to notify customer…" });
        setExpandedId(null);

        // Auto-open WhatsApp with the NEW status
        const waUrl = buildWhatsAppUrl(order, newStatus);
        window.open(waUrl, "_blank", "noopener,noreferrer");

        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: result.error ?? "Failed to update." });
      }
    });
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#e8e0d0] p-12 text-center">
        <p className="text-[#1a2744]/40 font-serif text-lg">No orders yet.</p>
        <p className="text-xs text-[#1a2744]/30 mt-2">Orders placed via checkout will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status message */}
      {message && (
        <div className={`px-4 py-3 text-sm border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-[#e8e0d0] overflow-hidden">
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm" aria-label="Orders">
            <thead>
              <tr className="border-b border-[#e8e0d0] bg-[#f5f0e8]">
                {["Order #", "Customer", "Phone", "Date", "Total", "Status", "Action"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase font-medium text-[#1a2744]/70">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id} className="border-b border-[#e8e0d0] hover:bg-[#faf8f4] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#c9a96e] font-medium">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1a2744] text-sm">{order.customer_name}</p>
                    <p className="text-[10px] text-[#1a2744]/50">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#1a2744]/60">
                    {order.customer_phone}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#1a2744]/60 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#1a2744]">
                    ₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-[9px] rounded-sm tracking-wide font-medium uppercase ${STATUS_COLOURS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedStatus[order.id] ?? order.status}
                        onChange={(e) => setSelectedStatus((p) => ({ ...p, [order.id]: e.target.value }))}
                        disabled={isPending}
                        className="text-xs border border-[#e8e0d0] bg-white px-2 py-1.5 text-[#1a2744] focus:outline-none focus:border-[#c9a96e] cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleStatusUpdate(order.id, order)}
                        disabled={isPending || (selectedStatus[order.id] ?? order.status) === order.status}
                        className="text-[10px] bg-[#1a2744] text-white px-3 py-1.5 uppercase tracking-wide font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        Update
                      </button>
                      {/* WhatsApp confirmation button */}
                      <a
                        href={buildWhatsAppUrl(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Send WhatsApp confirmation to customer"
                        className="text-[10px] bg-[#25D366] text-white px-2.5 py-1.5 uppercase tracking-wide font-bold hover:bg-[#128C7E] transition-colors whitespace-nowrap"
                      >
                        📱 WA
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-[#e8e0d0]">
          {orders.map((order: Order) => (
            <div key={order.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-[#c9a96e] font-medium">{order.order_number}</p>
                  <p className="font-medium text-sm text-[#1a2744]">{order.customer_name}</p>
                  <p className="text-[10px] text-[#1a2744]/50">{order.customer_phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1a2744]">₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}</p>
                  <span className={`inline-block px-2 py-0.5 text-[9px] rounded-sm tracking-wide font-medium uppercase mt-1 ${STATUS_COLOURS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="text-xs text-[#c9a96e] font-medium hover:underline"
                >
                  {expandedId === order.id ? "Hide" : "Update Status ↓"}
                </button>
                <a
                  href={buildWhatsAppUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] font-medium hover:underline"
                >
                  📱 Send WA
                </a>
              </div>

              {expandedId === order.id && (
                <div className="space-y-2 pt-2 border-t border-[#e8e0d0]">
                  <select
                    value={selectedStatus[order.id] ?? order.status}
                    onChange={(e) => setSelectedStatus((p) => ({ ...p, [order.id]: e.target.value }))}
                    disabled={isPending}
                    className="w-full text-sm border border-[#e8e0d0] bg-white px-3 py-2 text-[#1a2744] focus:outline-none focus:border-[#c9a96e]"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleStatusUpdate(order.id, order)}
                    disabled={isPending || (selectedStatus[order.id] ?? order.status) === order.status}
                    className="w-full text-xs bg-[#1a2744] text-white py-2.5 uppercase tracking-wide font-bold hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-30"
                  >
                    {isPending ? "Updating…" : "Confirm Status Change"}
                  </button>
                </div>
              )}

              {/* Payment info (if available) */}
              {(order.payment_screenshot || order.transaction_id) && (
                <div className="text-[10px] text-[#1a2744]/50 pt-1 space-y-0.5">
                  {order.transaction_id && <p>TXN: {order.transaction_id}</p>}
                  {order.payment_screenshot && (
                    <a href={order.payment_screenshot} target="_blank" rel="noopener noreferrer" className="text-[#c9a96e] hover:underline">
                      View Payment Screenshot ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
