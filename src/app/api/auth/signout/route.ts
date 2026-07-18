import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout
 * Signs the user out and redirects to home.
 * Used by the mobile drawer logout button (form action POST).
 */
export async function POST() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), {
    status: 302,
  });
}
