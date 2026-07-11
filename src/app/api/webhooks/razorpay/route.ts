import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { RazorpayWebhookSchema } from "@/lib/validations";

/**
 * POST /api/webhooks/razorpay
 *
 * Receives Razorpay payment events and updates order status in Supabase.
 * Signature is verified with the webhook secret (HMAC-SHA256).
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  // ── Verify webhook signature ──────────────────────────────────────────────
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  let signaturesMatch = false;
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSig, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    // Buffers were different lengths — signature is definitely invalid
    signaturesMatch = false;
  }

  if (!signaturesMatch) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── Parse payload ─────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RazorpayWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Unknown payload shape" }, { status: 400 });
  }

  const { event, payload } = parsed.data;
  const supabase = createServiceRoleClient();

  // ── Handle events ─────────────────────────────────────────────────────────
  if (event === "payment.captured") {
    const payment = payload.payment?.entity;
    if (!payment) return NextResponse.json({ ok: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("orders").update({
      status: "confirmed",
      razorpay_payment_id: payment.id,
      paid_at: new Date().toISOString(),
    }).eq("razorpay_order_id", payment.order_id);
  }

  if (event === "payment.failed") {
    const payment = payload.payment?.entity;
    if (!payment) return NextResponse.json({ ok: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("orders").update({ status: "payment_failed" }).eq("razorpay_order_id", payment.order_id);
  }

  if (event === "order.paid") {
    const order = payload.order?.entity;
    if (!order) return NextResponse.json({ ok: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("orders").update({ status: "confirmed" }).eq("razorpay_order_id", order.id);
  }

  return NextResponse.json({ ok: true });
}
