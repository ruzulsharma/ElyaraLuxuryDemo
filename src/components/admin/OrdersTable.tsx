"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/actions/order.actions";
import type { Database } from "@/types/database";

type Order = Database["public"]["Tables"]["orders"]["Row"];

const STATUS_COLOURS: Record<string, string> = {
  placed: "bg-amber-100 text-amber-800",
  pending_payment: "bg-yellow-100 text-yellow-800",
  payment_confirmed: "bg-blue-100 text-blue-800",
  payment_failed: "bg-red-100 text-red-700",
  confirmed: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  fulfilled: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
  refunded: "bg-orange-100 text-orange-700",
};

const STATUS_OPTIONS = [
  "placed",
  "pending_payment",
  "payment_confirmed",
  "confirmed",
  "in_production",
  "shipped",
  "delivered",
  "fulfilled",
  "cancelled",
  "refunded",
];

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, status: string) => {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, status);
    });
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#e8e0d0] p-12 text-center">
        <p className="text-[#1a2744]/40 font-serif text-lg">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e0d0] overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" aria-label="Orders">
          <thead>
            <tr className="border-b border-[#e8e0d0] bg-[#f5f0e8]">
              {["Order #", "Customer", "Date", "Total", "Status", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-3 text-left text-xs tracking-[0.15em] uppercase font-medium text-[#1a2744]/70"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[#e8e0d0] hover:bg-[#faf8f4] transition-colors"
              >
                <td className="px-4 py-4 font-mono text-xs text-[#c9a96e] font-medium">
                  {order.order_number}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-[#1a2744] text-sm">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-[#1a2744]/50">{order.customer_email}</p>
                </td>
                <td className="px-4 py-4 text-xs text-[#1a2744]/60 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-[#1a2744]">
                  ₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-[10px] rounded-sm tracking-wide font-medium uppercase ${
                      STATUS_COLOURS[order.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <select
                    defaultValue={order.status}
                    disabled={isPending}
                    aria-label={`Update status for order ${order.order_number}`}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs border border-[#e8e0d0] bg-white px-2 py-1.5 text-[#1a2744] focus:outline-none focus:border-[#c9a96e] cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-[#e8e0d0]">
        {orders.map((order) => (
          <div key={order.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-[#c9a96e] font-medium">
                  {order.order_number}
                </p>
                <p className="font-medium text-sm text-[#1a2744]">
                  {order.customer_name}
                </p>
                <p className="text-xs text-[#1a2744]/50">{order.customer_email}</p>
              </div>
              <p className="text-sm font-bold text-[#1a2744] whitespace-nowrap">
                ₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-block px-2 py-1 text-[10px] rounded-sm tracking-wide font-medium uppercase ${
                  STATUS_COLOURS[order.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
              <button
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
                className="text-xs text-[#c9a96e] hover:underline"
              >
                {expandedId === order.id ? "Hide" : "Update Status"}
              </button>
            </div>

            {expandedId === order.id && (
              <select
                defaultValue={order.status}
                disabled={isPending}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="w-full text-sm border border-[#e8e0d0] bg-white px-3 py-2 text-[#1a2744] focus:outline-none focus:border-[#c9a96e]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
