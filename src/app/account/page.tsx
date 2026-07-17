import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AccountClient from "@/components/account/AccountClient";

export const metadata: Metadata = {
  title: "My Account",
  description: "View your orders, profile, and get support from Elyara by Sweety.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user's orders
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orders } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <AccountClient
      user={{
        id: user.id,
        email: user.email ?? "",
        fullName: profile?.full_name ?? "",
        phone: profile?.phone ?? "",
      }}
      orders={orders ?? []}
    />
  );
}
