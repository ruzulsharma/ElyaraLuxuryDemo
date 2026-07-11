import { z } from "zod";

// ─── Product (Supabase / Contentful) ─────────────────────────────────────────
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.string(),
  collection: z.string(),
  description: z.string(),
  images: z.array(z.string().url().or(z.string().startsWith("/"))),
  isCustomizable: z.boolean(),
  isBestseller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  status: z.enum(["available", "made-to-order", "sold-out", "limited"]),
  styleNo: z.string().optional(),
});

export type ValidatedProduct = z.infer<typeof ProductSchema>;

// ─── Shipping Address ─────────────────────────────────────────────────────────
export const ShippingAddressSchema = z.object({
  line1: z.string().min(5, "Address is too short"),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6, "Pincode must be 6 digits").regex(/^\d+$/, "Pincode must be numeric"),
});

// ─── Checkout / Order creation ────────────────────────────────────────────────
export const CheckoutFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;

// ─── Create Razorpay Order (server action input) ──────────────────────────────
export const CreateRazorpayOrderSchema = z.object({
  formData: CheckoutFormSchema,
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      styleNo: z.string().optional(),
      pricePaise: z.number().int().positive(),
      quantity: z.number().int().min(1),
      size: z.string().optional(),
      color: z.string().optional(),
      customValues: z.record(z.string(), z.string()).optional(),
    })
  ).min(1, "Cart cannot be empty"),
});

// ─── Razorpay webhook payload ─────────────────────────────────────────────────
export const RazorpayWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z
      .object({
        entity: z.object({
          id: z.string(),
          order_id: z.string(),
          status: z.string(),
        }),
      })
      .optional(),
    order: z
      .object({
        entity: z.object({
          id: z.string(),
          status: z.string(),
          notes: z.record(z.string(), z.string()).optional(),
        }),
      })
      .optional(),
  }),
});

// ─── Auth / Login ─────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof LoginSchema>;

// ─── Auth / Register ──────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit Indian mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterValues = z.infer<typeof RegisterSchema>;

// ─── OTP send ─────────────────────────────────────────────────────────────────
export const SendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
});
