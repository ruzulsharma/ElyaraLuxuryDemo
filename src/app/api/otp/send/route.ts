import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import {
  checkRateLimit,
  getConfig,
  buildKey,
  rateLimitResponse,
} from "@/lib/rate-limit";

// ── Strict input schema — reject anything that doesn't match ────────────────
const SendOtpSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(13)
    .regex(/^\+?[0-9]{10,13}$/, "Invalid phone number format"),
});

export async function POST(request: NextRequest) {
  // ── Parse body — never trust raw input ─────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SendOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 422 }
    );
  }

  // ── Normalise to E.164 for India (+91) ────────────────────────────────────
  let e164: string;
  try {
    const raw = parsed.data.phone.startsWith("+")
      ? parsed.data.phone
      : `+91${parsed.data.phone}`;

    if (!isValidPhoneNumber(raw, "IN")) {
      return NextResponse.json(
        { error: "Enter a valid Indian mobile number" },
        { status: 422 }
      );
    }
    e164 = parsePhoneNumber(raw, "IN").format("E.164");
  } catch {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 422 });
  }

  // ── Rate limit: per-IP + per-phone ────────────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const config = getConfig("otp");

  const ipCheck = checkRateLimit(buildKey("otp", `ip:${ip}`), config);
  if (!ipCheck.allowed) {
    return rateLimitResponse(ipCheck.retryAfter) as unknown as NextResponse;
  }

  const phoneCheck = checkRateLimit(buildKey("otp", `phone:${e164}`), config);
  if (!phoneCheck.allowed) {
    return rateLimitResponse(phoneCheck.retryAfter) as unknown as NextResponse;
  }

  // ── Verify env vars are present ──────────────────────────────────────────
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    console.error("[otp/send] Twilio credentials not configured");
    return NextResponse.json(
      { error: "OTP service not configured. Contact support." },
      { status: 503 }
    );
  }

  // ── Send OTP via Twilio Verify ────────────────────────────────────────────
  try {
    const twilioUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;
    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      },
      body: new URLSearchParams({ To: e164, Channel: "sms" }),
    });

    if (!twilioRes.ok) {
      const err = await twilioRes.json().catch(() => ({}));
      console.error("[otp/send] Twilio error:", err);
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: "OTP sent to your mobile number." },
      { status: 200 }
    );
  } catch (e) {
    console.error("[otp/send] Network error:", e);
    return NextResponse.json(
      { error: "OTP service unavailable. Please try again." },
      { status: 503 }
    );
  }
}
