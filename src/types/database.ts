/**
 * Supabase database type definitions.
 * Run `npx supabase gen types typescript` to regenerate from your schema.
 * Manual version below matches the SQL in sql/schema.sql
 */
export type OrderStatus =
  | "pending_payment"
  | "payment_failed"
  | "confirmed"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_number: string;
          status: OrderStatus;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: ShippingAddress;
          items: OrderLineItem[];
          subtotal_paise: number;
          shipping_paise: number;
          total_paise: number;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          paid_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string; // matches auth.users.id
          email: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
    };
  };
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderLineItem {
  product_id: string;
  product_name: string;
  style_no: string;
  price_paise: number;
  quantity: number;
  size?: string;
  color?: string;
  custom_values?: Record<string, string>;
}
