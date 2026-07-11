import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Elyara Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin layout — double-checks auth server-side even though middleware
 * already protects these routes (defence in depth).
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
