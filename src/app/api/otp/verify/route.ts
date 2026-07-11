import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import {
  checkRateLimit,
  getConfig,
  buildKey,
  rateLimitResponse,
} from "@/lib/rate-limit";

// ── Strict schema — OTP is exactly 6 digits ──────────────────────────────────
const VerifyOtpSchema = z.object({
  phone: z
    .string()
    .min(10)
    .max(13)
    .regex(/^\+?[0-9]{10,13}$/, "Invalid phone number"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = VerifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 422 }
    );
  }

  // Normalise phone to E.164
  let e164: string;
  try {
    const raw = parsed.data.phone.startsWith("+")
      ? parsed.data.phone
      : `+91${parsed.data.phone}`;
    if (!isValidPhoneNumber(raw, "IN")) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 422 });
    }
    e164 = parsePhoneNumber(raw, "IN").format("E.164");
  } catch {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 422 });
  }

  // ── Rate limit — OTP verify is also strict ────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const config = getConfig("otp");

  const ipCheck = checkRateLimit(buildKey("otp", `verify-ip:${ip}`), config);
  if (!ipCheck.allowed) {
    return rateLimitResponse(ipCheck.retryAfter) as unknown as NextResponse;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return NextResponse.json(
      { error: "OTP service not configured." },
      { status: 503 }
    );
  }

  // ── Verify code with Twilio ───────────────────────────────────────────────
  try {
    const twilioUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      },
      body: new URLSearchParams({ To: e164, Code: parsed.data.otp }),
    });

    const data = await twilioRes.json();

    if (!twilioRes.ok || data.status !== "approved") {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, verified: true }, { status: 200 });
  } catch (e) {
    console.error("[otp/verify] Error:", e);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 503 }
    );
  }
}
