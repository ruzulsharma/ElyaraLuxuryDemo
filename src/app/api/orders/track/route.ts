import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * GET /api/orders/track?id=ORDER_NUMBER
 * Public endpoint — anyone with an order number can check status.
 * Returns limited info (no full address for privacy).
 */
export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("id")?.trim();

  if (!orderNumber || orderNumber.length < 3) {
    return NextResponse.json({ error: "Invalid order number" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("orders")
    .select("order_number, status, customer_name, total_paise, items, created_at, notes")
    .eq("order_number", orderNumber)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Order not found. Please check the order number and try again." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order: data }, { status: 200 });
}
