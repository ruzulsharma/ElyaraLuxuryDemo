import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signout
 * Signs the user out and redirects to home page.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (e) {
    // Log but don't block — user should still be redirected home
    console.warn("[signout] Error during sign out:", e);
  }

  // Build absolute URL from the request origin (works in all environments)
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(new URL("/", origin), { status: 302 });
}

/**
 * GET /api/auth/signout
 * Fallback for direct link navigation (in case form POST fails).
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.warn("[signout] Error during sign out:", e);
  }

  const origin = request.nextUrl.origin;
  return NextResponse.redirect(new URL("/", origin), { status: 302 });
}
