"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CreateRazorpayOrderSchema } from "@/lib/validations";
import type { z } from "zod";
import type { OrderLineItem, ShippingAddress } from "@/types/database";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type CreateInput = z.infer<typeof CreateRazorpayOrderSchema>;

export interface CreateOrderResult {
  success: boolean;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  dbOrderId?: string;
  error?: string;
}

/**
 * Creates a Razorpay order and persists a pending order row in Supabase.
 */
export async function createRazorpayOrderAction(
  input: CreateInput
): Promise<CreateOrderResult> {
  const parsed = CreateRazorpayOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { formData, items } = parsed.data;

  const totalPaise = items.reduce(
    (sum, i) => sum + i.pricePaise * i.quantity,
    0
  );

  // ── Create Razorpay order ─────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rzpOrder: any;
  try {
    rzpOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `ELY-${Date.now()}`,
      notes: {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
      },
    });
  } catch (e) {
    console.error("[createRazorpayOrderAction] Razorpay error:", e);
    return { success: false, error: "Payment gateway error. Please try again." };
  }

  // ── Persist to Supabase ───────────────────────────────────────────────────
  const supabase = await createServerSupabaseClient();

  const shippingAddress: ShippingAddress = {
    line1: formData.addressLine1,
    line2: formData.addressLine2 || undefined,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
  };

  const lineItems: OrderLineItem[] = items.map((i) => ({
    product_id: i.productId,
    product_name: i.productName,
    style_no: i.styleNo ?? "",
    price_paise: i.pricePaise,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
    custom_values: i.customValues as Record<string, string> | undefined,
  }));

  // Use explicit any cast — will be replaced with generated types after `supabase gen types`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error: dbError } = await (supabase as any)
    .from("orders")
    .insert({
      order_number: rzpOrder.receipt as string,
      status: "pending_payment",
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: shippingAddress,
      items: lineItems,
      subtotal_paise: totalPaise,
      shipping_paise: 0,
      total_paise: totalPaise,
      razorpay_order_id: rzpOrder.id as string,
      paid_at: null,
      notes: null,
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("[createRazorpayOrderAction] DB error:", dbError);
    return { success: false, error: "Could not save order. Please try again." };
  }

  return {
    success: true,
    razorpayOrderId: rzpOrder.id as string,
    amount: totalPaise,
    currency: "INR",
    dbOrderId: (order as { id: string }).id,
  };
}

/**
 * Verifies Razorpay payment signature and marks the order as confirmed.
 */
export async function verifyPaymentAction(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ success: boolean; error?: string }> {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  let signaturesMatch = false;
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(razorpaySignature, "hex")
    );
  } catch {
    signaturesMatch = false;
  }

  if (!signaturesMatch) {
    return { success: false, error: "Payment signature verification failed." };
  }

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("orders")
    .update({
      status: "confirmed",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      paid_at: new Date().toISOString(),
    })
    .eq("razorpay_order_id", razorpayOrderId);

  if (error) {
    console.error("[verifyPaymentAction] DB error:", error);
    return { success: false, error: "Could not update order status." };
  }

  return { success: true };
}

/**
 * Admin action — updates an order's status.
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ─── UPI Order (WhatsApp flow — no gateway) ──────────────────────────────────
export interface CreateUpiOrderInput {
  formData: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    productName: string;
    styleNo?: string;
    pricePaise: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
}

export interface CreateUpiOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

/**
 * Creates an order in Supabase with status "placed" for UPI/WhatsApp payments.
 * No payment gateway involved — admin manually confirms payment later.
 */
export async function createUpiOrderAction(
  input: CreateUpiOrderInput
): Promise<CreateUpiOrderResult> {
  const { formData, items } = input;

  // Basic validation
  if (!formData.name || !formData.phone || !formData.addressLine1) {
    return { success: false, error: "Missing required fields." };
  }
  if (!items || items.length === 0) {
    return { success: false, error: "Cart is empty." };
  }

  const totalPaise = items.reduce((sum, i) => sum + i.pricePaise * i.quantity, 0);
  const orderNumber = `ELY-${Date.now().toString(36).toUpperCase()}`;

  const shippingAddress: ShippingAddress = {
    line1: formData.addressLine1,
    line2: formData.addressLine2 || undefined,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
  };

  const lineItems: OrderLineItem[] = items.map((i) => ({
    product_id: i.productId,
    product_name: i.productName,
    style_no: i.styleNo ?? "",
    price_paise: i.pricePaise,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
  }));

  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dbError } = await (supabase as any)
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "placed",
      customer_name: formData.name,
      customer_email: formData.email || "",
      customer_phone: formData.phone,
      shipping_address: shippingAddress,
      items: lineItems,
      subtotal_paise: totalPaise,
      shipping_paise: 0,
      total_paise: totalPaise,
      razorpay_order_id: null,
      paid_at: null,
      notes: "Payment method: UPI via WhatsApp",
    });

  if (dbError) {
    console.error("[createUpiOrderAction] DB error:", dbError);
    return { success: false, error: "Could not save order. Please try again." };
  }

  return { success: true, orderNumber };
}
