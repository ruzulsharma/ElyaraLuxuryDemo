import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import OrdersTable from "@/components/admin/OrdersTable";
import DashboardStats from "@/components/admin/DashboardStats";
import CatalogPanel from "@/components/admin/CatalogPanel";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "orders" } = await searchParams;

  const supabase = await createServerSupabaseClient();
  const { data: orders, error } = await supabase
    .from("orders" as "orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[AdminDashboard] Supabase error:", error);
  }

  // ── Stats aggregation ─────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allOrders: any[] = orders ?? [];
  const totalRevenuePaise = allOrders
    .filter((o) => o.status === "confirmed" || o.status === "delivered")
    .reduce((sum, o) => sum + (o.total_paise ?? 0), 0);
  const pendingCount = allOrders.filter((o) => o.status === "pending_payment").length;
  const confirmedCount = allOrders.filter((o) => o.status === "confirmed").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page header */}
      <div className="border-b border-[#e8e0d0] pb-5">
        <p className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] font-medium mb-1">
          Elyara Admin
        </p>
        <h1 className="text-2xl font-serif font-light text-[#1a2744]">Dashboard</h1>
      </div>

      {/* Stats row */}
      <DashboardStats
        totalOrders={allOrders.length}
        totalRevenuePaise={totalRevenuePaise}
        pendingCount={pendingCount}
        confirmedCount={confirmedCount}
      />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#e8e0d0]">
        {(["orders", "catalog"] as const).map((t) => (
          <a
            key={t}
            href={`?tab=${t}`}
            className={`px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-[#c9a96e] text-[#1a2744]"
                : "border-transparent text-[#1a2744]/50 hover:text-[#1a2744]"
            }`}
          >
            {t === "orders" ? "Orders" : "Catalog"}
          </a>
        ))}
      </div>

      {/* Tab panels */}
      {tab === "orders" && <OrdersTable orders={allOrders} />}
      {tab === "catalog" && <CatalogPanel />}
    </div>
  );
}
