"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const EmailSchema = z.string().email("Invalid email address").max(254);

/**
 * Saves a newsletter subscriber email to Supabase.
 * Used by the NewsletterSection component.
 */
export async function subscribeAction(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const parsed = EmailSchema.safeParse(email);
  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const supabase = await createServerSupabaseClient();

  // Upsert — don't error on duplicate email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("subscribers")
    .upsert(
      { email: parsed.data.toLowerCase(), subscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );

  if (error) {
    console.error("[subscribeAction]", error);
    return { success: false, error: "Could not subscribe. Please try again." };
  }

  return { success: true };
}
