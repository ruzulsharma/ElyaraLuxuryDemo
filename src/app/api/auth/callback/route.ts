import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback
 *
 * Supabase redirects here after email link (confirm/reset password).
 * Exchanges the code for a session, then redirects to the appropriate page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If this was a password reset flow, send to the reset page
      const type = searchParams.get("type");
      if (type === "recovery") {
        return NextResponse.redirect(
          new URL("/reset-password", request.url)
        );
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If something went wrong, redirect to login with error hint
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", request.url)
  );
}
