"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOutAction } from "@/lib/actions/auth.actions";

interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  phone: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_paise: number;
  items: { product_name: string; quantity: number }[];
  created_at: string;
}

type Tab = "orders" | "profile" | "support";

const STATUS_COLOURS: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_production: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function AccountClient({ user, orders }: { user: UserInfo; orders: Order[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "orders", label: "My Orders", icon: "📦" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "support", label: "Support", icon: "💬" },
  ];

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2744] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-medium mb-1">My Account</p>
          <h1 className="text-2xl sm:text-3xl font-serif font-light text-white">
            Welcome, {user.fullName || "there"}
          </h1>
          <p className="text-white/50 text-sm mt-1">{user.email}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-[#e8e0d0] mb-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.18em] uppercase font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-[#c9a96e] text-[#1a2744]"
                  : "border-transparent text-[#1a2744]/40 hover:text-[#1a2744]"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "orders" && <OrdersTab orders={orders} />}
            {activeTab === "profile" && <ProfileTab user={user} />}
            {activeTab === "support" && <SupportTab />}
          </motion.div>
        </AnimatePresence>

        {/* Logout */}
        <div className="mt-12 pt-6 border-t border-[#e8e0d0]">
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-xs tracking-[0.2em] uppercase text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── Orders Tab ──────────────────────────────────────────────────────────── */
function OrdersTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-5xl">🛍️</p>
        <p className="font-serif text-lg text-[#1a2744]">No orders yet</p>
        <p className="text-sm text-[#1a2744]/50">Start your journey with a bespoke piece.</p>
        <Link
          href="/shop"
          className="inline-block mt-4 bg-[#1a2744] text-white text-xs tracking-[0.2em] uppercase font-bold px-8 py-4 hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#1a2744]/50 mb-2">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-[#e8e0d0] p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-mono text-xs text-[#c9a96e] font-medium">{order.order_number}</p>
              <p className="text-xs text-[#1a2744]/50 mt-0.5">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] tracking-wide uppercase font-medium px-2 py-1 rounded-sm ${STATUS_COLOURS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {order.status.replace(/_/g, " ")}
              </span>
              <span className="text-sm font-semibold text-[#1a2744]">
                ₹{((order.total_paise ?? 0) / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          {/* Item list */}
          <div className="text-xs text-[#1a2744]/60 space-y-1">
            {order.items?.map((item, i) => (
              <p key={i}>
                {item.product_name} <span className="text-[#1a2744]/30">×{item.quantity}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Profile Tab ─────────────────────────────────────────────────────────── */
function ProfileTab({ user }: { user: UserInfo }) {
  return (
    <div className="bg-white border border-[#e8e0d0] p-6 space-y-5 max-w-md">
      <h2 className="font-serif text-lg font-light text-[#1a2744]">Your Details</h2>
      {[
        { label: "Name", value: user.fullName || "—" },
        { label: "Email", value: user.email },
        { label: "Phone", value: user.phone ? `+91 ${user.phone}` : "Not set" },
      ].map((field) => (
        <div key={field.label} className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/40 font-medium">{field.label}</p>
          <p className="text-sm text-[#1a2744]">{field.value}</p>
        </div>
      ))}
      <p className="text-xs text-[#1a2744]/40 pt-4 border-t border-[#e8e0d0]">
        To update your details, contact us via WhatsApp or email.
      </p>
    </div>
  );
}

/* ── Support Tab ─────────────────────────────────────────────────────────── */
function SupportTab() {
  return (
    <div className="space-y-6 max-w-md">
      <h2 className="font-serif text-lg font-light text-[#1a2744]">Get Help</h2>
      <p className="text-sm text-[#1a2744]/60 leading-relaxed">
        Our team is available Mon–Sat, 11 AM – 8 PM IST. Reach us through any of these channels:
      </p>

      <div className="space-y-3">
        {/* WhatsApp */}
        <a
          href="https://wa.me/918796134073?text=Hi%20Elyara%2C%20I%20need%20help%20with%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white border border-[#e8e0d0] p-4 hover:border-[#c9a96e] transition-colors group"
        >
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-sm font-medium text-[#1a2744] group-hover:text-[#c9a96e] transition-colors">WhatsApp</p>
            <p className="text-xs text-[#1a2744]/50">Fastest response — avg 2 hours</p>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:elyarabysweety@gmail.com?subject=Order Help"
          className="flex items-center gap-4 bg-white border border-[#e8e0d0] p-4 hover:border-[#c9a96e] transition-colors group"
        >
          <span className="text-2xl">📧</span>
          <div>
            <p className="text-sm font-medium text-[#1a2744] group-hover:text-[#c9a96e] transition-colors">Email</p>
            <p className="text-xs text-[#1a2744]/50">elyarabysweety@gmail.com</p>
          </div>
        </a>

        {/* Phone */}
        <a
          href="tel:+918796134073"
          className="flex items-center gap-4 bg-white border border-[#e8e0d0] p-4 hover:border-[#c9a96e] transition-colors group"
        >
          <span className="text-2xl">📞</span>
          <div>
            <p className="text-sm font-medium text-[#1a2744] group-hover:text-[#c9a96e] transition-colors">Call Us</p>
            <p className="text-xs text-[#1a2744]/50">+91 87961 34073</p>
          </div>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com/elyarabysweety"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white border border-[#e8e0d0] p-4 hover:border-[#c9a96e] transition-colors group"
        >
          <span className="text-2xl">📸</span>
          <div>
            <p className="text-sm font-medium text-[#1a2744] group-hover:text-[#c9a96e] transition-colors">Instagram</p>
            <p className="text-xs text-[#1a2744]/50">@elyarabysweety</p>
          </div>
        </a>
      </div>

      <div className="bg-[#f5f0e8] border border-[#e8e0d0] p-4 text-xs text-[#1a2744]/60 leading-relaxed">
        <p className="font-medium text-[#1a2744] mb-1">Common Topics</p>
        <ul className="space-y-1 list-disc pl-4">
          <li>Order status & tracking</li>
          <li>Measurement guidance</li>
          <li>Returns & alterations</li>
          <li>Custom order enquiry</li>
          <li>Fabric & care advice</li>
        </ul>
      </div>
    </div>
  );
}
