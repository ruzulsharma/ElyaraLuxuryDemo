"use client";

import { useState, useTransition } from "react";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { createRazorpayOrderAction, verifyPaymentAction, createUpiOrderAction } from "@/lib/actions/order.actions";
import { CheckoutFormSchema, type CheckoutFormValues } from "@/lib/validations";
import { useRouter } from "next/navigation";

type FormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<CheckoutFormValues>({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");

  // ── Auto-fill city/state from pincode ──────────────────────────────────────
  const handlePincodeBlur = async (pincode: string) => {
    if (pincode.length !== 6) return;
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const { Circle, District } = data[0].PostOffice[0];
        setFormData((prev) => ({ ...prev, state: Circle, city: District }));
      }
    } catch {
      // Silently fail — user can type manually
    }
  };

  const updateField = (field: keyof CheckoutFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  };

  // ── Client-side validation before hitting the server ───────────────────────
  const validate = (): boolean => {
    const parsed = CheckoutFormSchema.safeParse(formData);
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }
    const errs: FormErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof CheckoutFormValues;
      errs[key] = issue.message;
    }
    setFieldErrors(errs);
    return false;
  };

  const handleUpiPayment = () => {
    if (!validate()) return;
    if (items.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    startTransition(async () => {
      // 1. Save order to Supabase with status "placed"
      const result = await createUpiOrderAction({
        formData,
        items: items.map((i) => ({
          productId: i.id,
          productName: i.name,
          styleNo: i.styleNo,
          pricePaise: i.price * 100,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
      });

      if (!result.success) {
        setServerError(result.error ?? "Could not place order.");
        return;
      }

      // 2. Build WhatsApp message with order number
      const orderItems = items
        .map((i) => `• ${i.name}${i.size ? ` (${i.size})` : ""} ×${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`)
        .join("\n");

      const address = [
        formData.addressLine1,
        formData.addressLine2,
        `${formData.city}, ${formData.state} — ${formData.pincode}`,
      ]
        .filter(Boolean)
        .join(", ");

      const message = encodeURIComponent(
        `*🛍️ New Order — Pay via UPI*\n\n` +
        `*Order #:* ${result.orderNumber}\n` +
        `*Customer:* ${formData.name}\n` +
        `*Phone:* +91${formData.phone}\n` +
        `*Email:* ${formData.email}\n` +
        `*Address:* ${address}\n\n` +
        `*Order:*\n${orderItems}\n\n` +
        `*Total: ₹${subtotal.toLocaleString("en-IN")}*\n\n` +
        `Please share your UPI ID or QR code for payment. 🙏`
      );

      const waUrl = `https://wa.me/918796134073?text=${message}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      // 3. Clear cart and redirect with order number
      clearCart();
      router.push(`/order-confirmed?ref=${result.orderNumber}&method=upi`);
    });
  };

  const handlePayment = () => {
    if (!validate()) return;
    if (items.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    startTransition(async () => {
      // 1. Create order via Server Action
      const result = await createRazorpayOrderAction({
        formData,
        items: items.map((i) => ({
          productId: i.id,
          productName: i.name,
          styleNo: i.styleNo,
          pricePaise: i.price * 100,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
      });

      if (!result.success || !result.razorpayOrderId) {
        setServerError(result.error ?? "Payment setup failed. Please try again.");
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: result.amount,
        currency: result.currency,
        name: "Elyara by Sweety",
        description: "Bespoke Luxury Fashion",
        order_id: result.razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `+91${formData.phone}`,
        },
        theme: { color: "#1a2744" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify signature via Server Action
          const verification = await verifyPaymentAction({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verification.success) {
            clearCart();
            router.push(
              `/order-confirmed?ref=${result.dbOrderId}`
            );
          } else {
            setServerError(
              "Payment received but verification failed. Please contact us at elyarabysweety@gmail.com with your payment ID."
            );
          }
        },
      };

      const rzp = new (window as unknown as { Razorpay: new (o: unknown) => { open: () => void } }).Razorpay(options);
      rzp.open();
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center px-6">
        <div className="space-y-4">
          <p className="font-serif text-xl text-[#1a2744]">Your bag is empty</p>
          <a href="/shop" className="inline-block text-[#c9a96e] text-sm underline">
            Browse the collection →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 grid md:grid-cols-2 gap-12">
        {/* ── LEFT: FORM ── */}
        <div className="space-y-5">
          <h2 className="text-xl font-serif font-light text-[#1a2744] uppercase tracking-widest border-b border-[#e8e0d0] pb-4">
            Shipping Details
          </h2>

          {serverError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          {/* Name */}
          <Field label="Full Name *" error={fieldErrors.name}>
            <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Priya Sharma" className={inputCls(!!fieldErrors.name)} />
          </Field>

          {/* Email */}
          <Field label="Email Address *" error={fieldErrors.email}>
            <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@email.com" className={inputCls(!!fieldErrors.email)} />
          </Field>

          {/* Phone */}
          <Field label="Phone Number *" error={fieldErrors.phone}>
            <div className={`flex border ${fieldErrors.phone ? "border-red-400" : "border-[#e8e0d0]"}`}>
              <span className="px-4 py-3 bg-[#e8e0d0]/30 text-[#1a2744]/60 text-sm border-r border-[#e8e0d0] select-none">
                +91
              </span>
              <input
                type="tel"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                className="flex-1 p-3 bg-transparent text-sm text-[#1a2744] focus:outline-none"
              />
            </div>
          </Field>

          {/* Pincode */}
          <Field label="Pincode *" error={fieldErrors.pincode}>
            <input
              type="text"
              value={formData.pincode}
              maxLength={6}
              onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
              onBlur={(e) => handlePincodeBlur(e.target.value)}
              placeholder="110001"
              className={inputCls(!!fieldErrors.pincode)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="State" error={fieldErrors.state}>
              <input type="text" value={formData.state} onChange={(e) => updateField("state", e.target.value)} placeholder="Delhi" className={inputCls(!!fieldErrors.state)} />
            </Field>
            <Field label="City" error={fieldErrors.city}>
              <input type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="New Delhi" className={inputCls(!!fieldErrors.city)} />
            </Field>
          </div>

          <Field label="Address Line 1 *" error={fieldErrors.addressLine1}>
            <input type="text" value={formData.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="House / Flat / Block No." className={inputCls(!!fieldErrors.addressLine1)} />
          </Field>

          <Field label="Address Line 2">
            <input type="text" value={formData.addressLine2 ?? ""} onChange={(e) => updateField("addressLine2", e.target.value)} placeholder="Street, Landmark (Optional)" className={inputCls(false)} />
          </Field>
        </div>

        {/* ── RIGHT: SUMMARY ── */}
        <div className="bg-[#f5f0e8] p-8 h-fit space-y-6">
          <h2 className="text-xl font-serif text-[#1a2744]">Order Summary</h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-[#1a2744]">
                  {item.name}{item.size ? ` / ${item.size}` : ""}{" "}
                  <span className="text-[#1a2744]/50">×{item.quantity}</span>
                </span>
                <span className="font-medium text-[#1a2744]">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e8e0d0] pt-4 flex justify-between font-bold text-[#1a2744]">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>

          {/* ── Payment Methods ── */}
          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a2744]/50 font-medium">
              Choose Payment Method
            </p>

            {/* Option 1: Pay via UPI (WhatsApp flow — zero cost) */}
            <button
              onClick={handleUpiPayment}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 uppercase tracking-widest font-bold text-sm hover:bg-[#128C7E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pay ₹{subtotal.toLocaleString("en-IN")} via UPI
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e8e0d0]" />
              <span className="text-[10px] text-[#1a2744]/30 uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-[#e8e0d0]" />
            </div>

            {/* Option 2: Razorpay (cards, net banking, UPI via gateway) */}
            <button
              onClick={handlePayment}
              disabled={isPending}
              aria-busy={isPending}
              className="w-full bg-[#1a2744] text-white py-4 uppercase tracking-widest font-bold text-sm hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Processing…" : `Pay Online (Card/UPI/NetBanking)`}
            </button>
          </div>

          <p className="text-xs text-center text-[#1a2744]/40">
            UPI option sends your order to WhatsApp for direct payment · Online payments secured by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function inputCls(hasError: boolean) {
  return `w-full border bg-transparent px-4 py-3 text-sm text-[#1a2744] focus:outline-none focus:border-[#c9a96e] transition-colors ${
    hasError ? "border-red-400" : "border-[#e8e0d0]"
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs tracking-[0.15em] uppercase text-[#1a2744] font-medium mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
