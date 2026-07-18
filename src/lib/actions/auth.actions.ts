"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LoginSchema, RegisterSchema } from "@/lib/validations";
import { headers } from "next/headers";
import {
  checkRateLimit,
  getConfig,
  buildKey,
} from "@/lib/rate-limit";

// ─── Helper: get IP from request headers ─────────────────────────────────────
async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

// ─── Sign In ─────────────────────────────────────────────────────────────────
export async function signInAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  // Rate-limit by IP + email (per-account) to prevent brute force
  const ip = await getClientIp();
  const email = (formData.get("email") as string | null) ?? "";
  const config = getConfig("auth");

  const ipCheck = checkRateLimit(buildKey("auth", `login-ip:${ip}`), config);
  if (!ipCheck.allowed) {
    return { error: `Too many login attempts. Please wait ${ipCheck.retryAfter}s.` };
  }

  const accountCheck = checkRateLimit(
    buildKey("auth", `login-email:${email.toLowerCase()}`),
    config
  );
  if (!accountCheck.allowed) {
    return { error: `Too many attempts for this account. Please wait ${accountCheck.retryAfter}s.` };
  }

  // Validate inputs strictly
  const raw = { email, password: (formData.get("password") as string | null) ?? "" };
  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Don't leak whether email exists — always the same message
    return { error: "Invalid email or password." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check role from profiles table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const dest = profile?.role === "admin" ? "/admin/dashboard" : "/account";
  redirect(dest);
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────
export async function signUpAction(
  _prevState: { error: string; field?: string } | null,
  formData: FormData
): Promise<{ error: string; field?: string }> {
  const rawData = Object.fromEntries(formData.entries());
  console.log("DEBUG: Form data received:", rawData);
  
  const ip = await getClientIp();
  const config = getConfig("auth");

  const ipCheck = checkRateLimit(buildKey("auth", `register-ip:${ip}`), config);
  if (!ipCheck.allowed) {
    return { error: `Too many registration attempts. Please wait ${ipCheck.retryAfter}s.` };
  }

  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    // OTP disabled for now — no Twilio dependency
    otp: (formData.get("otp") as string) || "000000",
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue.message, field: issue.path[0] as string };
  }

  // ── OTP verification DISABLED — uncomment when Twilio is configured ──
  // const otpResult = await verifyOtpServer(
  //   `+91${parsed.data.phone}`,
  //   parsed.data.otp
  // );
  // if (!otpResult.success) {
  //   return { error: "Invalid or expired OTP. Please try again.", field: "otp" };
  // }

  const supabase = await createServerSupabaseClient();

  // Create Supabase auth user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
    },
  });

  // if (signUpError) {
  //   if (signUpError.message.includes("already registered")) {
  //     return { error: "An account with this email already exists.", field: "email" };
  //   }
  //   return { error: "Registration failed. Please try again." };
  // }
  if (signUpError) {
    console.log("SUPABASE SIGNUP ERROR:", signUpError); // Add this line
    if (signUpError.message.includes("already registered")) {
      return { error: "An account with this email already exists.", field: "email" };
    }
    return { error: `Registration failed: ${signUpError.message}` }; // Update this to show the real error
  }

  // Upsert profile with phone
  if (data.user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("profiles").upsert({
      id: data.user.id,
      email: parsed.data.email,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      role: "customer",
    });
  }

  redirect("/account");
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────
export async function signOutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ─── OTP server-side verification helper ─────────────────────────────────────
async function verifyOtpServer(
  e164Phone: string,
  otp: string
): Promise<{ success: boolean }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  // If Twilio not configured, skip verification in dev (log a warning)
  if (!accountSid || !authToken || !serviceSid) {
    console.warn("[signUpAction] Twilio not configured — skipping OTP verification in dev");
    return { success: true };
  }

  try {
    const url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      },
      body: new URLSearchParams({ To: e164Phone, Code: otp }),
    });
    const data = await res.json();
    return { success: res.ok && data.status === "approved" };
  } catch {
    return { success: false };
  }
}

// ─── Forgot Password (send reset email) ──────────────────────────────────────
export async function forgotPasswordAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const ip = await getClientIp();
  const config = getConfig("auth");

  // Rate limit — strict on password reset to prevent abuse
  const ipCheck = checkRateLimit(buildKey("auth", `reset-ip:${ip}`), config);
  if (!ipCheck.allowed) {
    return { error: `Too many requests. Please wait ${ipCheck.retryAfter}s.`, success: false };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address.", success: false };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?type=recovery`,
  });

  // Always show success — don't reveal if email exists
  if (error) {
    console.error("[forgotPasswordAction]", error.message);
  }

  return { error: "", success: true };
}

// ─── Reset Password (set new password after clicking email link) ──────────────
export async function resetPasswordAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const password = (formData.get("password") as string | null) ?? "";
  const confirmPassword = (formData.get("confirmPassword") as string | null) ?? "";

  // Strict validation
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }
  if (!/[A-Z]/.test(password)) {
    return { error: "Password must contain at least one uppercase letter.", success: false };
  }
  if (!/[0-9]/.test(password)) {
    return { error: "Password must contain at least one number.", success: false };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[resetPasswordAction]", error.message);
    return { error: "Failed to update password. The link may have expired — request a new one.", success: false };
  }

  return { error: "", success: true };
}
