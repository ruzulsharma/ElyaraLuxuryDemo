# Elyara CMS & Commerce — Technical Specification

> Status: Draft v1.0  
> Author: Elyara Engineering  
> Scope: Product Catalog CMS · Customisation Engine · Order Management · Razorpay Integration

---

## 1. Overview

Three self-contained feature modules, each with its own API surface and data layer:

| Module | Description |
|--------|-------------|
| **Catalog CMS** | CRUD for products, images, and categories |
| **Customisation Engine** | Dynamic bespoke-order field schemas per product |
| **Commerce & Payments** | Order lifecycle + Razorpay payment flow |

All modules share a single Prisma schema and Next.js App Router API routes under `/src/app/api/`.

---

## 2. Tech Stack Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Database | **PostgreSQL** via [Neon](https://neon.tech) (serverless) | Free tier, edge-compatible, works with Vercel |
| ORM | **Prisma** | Type-safe, generates client from schema |
| File Storage | **Cloudinary** | Image upload + optimised delivery CDN |
| Auth (admin) | **NextAuth.js v5** (credentials) | Simple email/password for the admin panel |
| Payments | **Razorpay** | INR-first, UPI + cards + net banking |
| Validation | **Zod** | Schema validation shared client + server |

---

## 3. Module A — Product Catalog CMS

### 3.1 Data Model

```prisma
// prisma/schema.prisma

model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  sortOrder Int       @default(0)
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id               String            @id @default(cuid())
  name             String
  slug             String            @unique
  description      String
  price            Int               // stored in paise (₹ × 100)
  originalPrice    Int?
  status           ProductStatus     @default(AVAILABLE)
  isBestseller     Boolean           @default(false)
  isNew            Boolean           @default(false)
  isCustomizable   Boolean           @default(true)
  collection       String
  categoryId       String
  category         Category          @relation(fields: [categoryId], references: [id])
  images           ProductImage[]
  customSchema     CustomSchema?     // null = not customisable
  orderItems       OrderItem[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model ProductImage {
  id           String   @id @default(cuid())
  productId    String
  product      Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  cloudinaryId String   // e.g. "elyara/products/ely-001-main"
  url          String
  altText      String   @default("")
  sortOrder    Int      @default(0)
}

enum ProductStatus {
  AVAILABLE
  MADE_TO_ORDER
  LIMITED
  SOLD_OUT
}
```

### 3.2 API Routes

```
POST   /api/admin/products          → createProduct()
GET    /api/admin/products          → listProducts()
PATCH  /api/admin/products/[id]     → updateProduct()
DELETE /api/admin/products/[id]     → deleteProduct()

POST   /api/admin/products/[id]/images   → uploadProductImage()  (multipart)
DELETE /api/admin/images/[imageId]       → deleteProductImage()

GET    /api/products                → public product listing (paginated)
GET    /api/products/[slug]         → public product detail
```

### 3.3 Image Upload Flow

```
Client → POST /api/admin/products/[id]/images
  → Server validates auth (NextAuth session)
  → Streams file to Cloudinary via `cloudinary.uploader.upload_stream`
  → Stores { cloudinaryId, url } in ProductImage table
  → Returns { url, cloudinaryId }
```

All public image URLs go through `next/image` with `remotePatterns` already configured for `res.cloudinary.com`.

---

## 4. Module B — Customisation Engine

### 4.1 Design Principle

Each customisable product owns a `CustomSchema` — a JSON document describing its fields. Adding or removing a field (e.g. "Fabric Type") requires only an admin UI write; zero code deploys.

### 4.2 Data Model

```prisma
model CustomSchema {
  id        String        @id @default(cuid())
  productId String        @unique
  product   Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  fields    CustomField[]
  updatedAt DateTime      @updatedAt
}

model CustomField {
  id             String          @id @default(cuid())
  schemaId       String
  schema         CustomSchema    @relation(fields: [schemaId], references: [id], onDelete: Cascade)
  label          String          // e.g. "Waist (inches)"
  key            String          // e.g. "waist_inches" — used as form field name
  fieldType      CustomFieldType
  isRequired     Boolean         @default(false)
  placeholder    String?
  maxLength      Int?
  options        String[]        // for SELECT type — e.g. ["Cotton", "Silk", "Linen"]
  sortOrder      Int             @default(0)
}

enum CustomFieldType {
  TEXT        // free-text (e.g. height, unique requirements)
  NUMBER      // numeric measurement input
  SELECT      // dropdown (e.g. fabric type, rise type)
  TEXTAREA    // long notes
}
```

### 4.3 API Routes

```
GET    /api/admin/products/[id]/schema        → getCustomSchema()
PUT    /api/admin/products/[id]/schema        → upsertCustomSchema()
POST   /api/admin/products/[id]/schema/fields → addField()
PATCH  /api/admin/schema/fields/[fieldId]     → updateField()
DELETE /api/admin/schema/fields/[fieldId]     → deleteField()

GET    /api/products/[slug]/schema            → public: returns fields for the
                                                CustomOrderForm to render
```

### 4.4 Runtime Form Rendering

`CustomOrderForm` (already built at `src/components/custom-order/CustomOrderForm.tsx`) will be updated to:

1. Fetch schema from `GET /api/products/[slug]/schema` on mount.
2. Dynamically render fields based on `fieldType`.
3. Validate via a Zod schema generated from the field definitions.
4. Submit the collected values as `customValues: Record<string, string>` in the order payload.

---

## 5. Module C — Order Management & Razorpay

### 5.1 Data Model

```prisma
model Order {
  id               String        @id @default(cuid())
  orderNumber      String        @unique  // e.g. "ELY-2025-0042"
  status           OrderStatus   @default(PENDING_PAYMENT)
  customerName     String
  customerEmail    String
  customerPhone    String
  shippingAddress  Json
  items            OrderItem[]
  subtotalPaise    Int
  shippingPaise    Int           @default(0)
  totalPaise       Int
  razorpayOrderId  String?       @unique
  razorpayPaymentId String?
  razorpaySignature String?
  paidAt           DateTime?
  notes            String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model OrderItem {
  id           String   @id @default(cuid())
  orderId      String
  order        Order    @relation(fields: [orderId], references: [id])
  productId    String
  product      Product  @relation(fields: [productId], references: [id])
  productName  String   // snapshot at time of order
  pricePaise   Int      // snapshot at time of order
  quantity     Int      @default(1)
  selectedSize String?
  selectedColor String?
  customValues Json?    // { waist_inches: "28", height_cms: "165", ... }
}

enum OrderStatus {
  PENDING_PAYMENT
  PAYMENT_FAILED
  CONFIRMED
  IN_PRODUCTION
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

### 5.2 Razorpay Integration Architecture

#### Flow Diagram

```
[Client: Checkout]
      │
      ▼
POST /api/orders/create-razorpay-order
  → Validates cart + customer data (Zod)
  → Creates Order record (status: PENDING_PAYMENT)
  → Calls razorpay.orders.create({ amount, currency: "INR", receipt })
  → Returns { razorpayOrderId, amount, currency, key_id }
      │
      ▼
[Client: Razorpay Checkout JS opens]
  → User completes payment
  → Razorpay returns { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      │
      ▼
POST /api/orders/verify-payment
  → Server reconstructs expected signature:
      HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)
  → Compares with razorpay_signature (constant-time comparison)
  → On match: updates Order { status: CONFIRMED, razorpayPaymentId, razorpaySignature, paidAt }
  → Returns { success: true, orderNumber }
      │
      ▼
[Client: redirects to /order-confirmed/[orderNumber]]
```

#### API Route Signatures

```typescript
// POST /api/orders/create-razorpay-order
// Body: CreateOrderPayload (see Zod schema below)
// Returns: RazorpayOrderResponse

// POST /api/orders/verify-payment
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
// Returns: { success: boolean; orderNumber?: string }
```

#### Zod Payload Schema (shared client + server)

```typescript
// src/lib/validations/order.ts

export const CreateOrderSchema = z.object({
  customerName:  z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: z.object({
    line1:   z.string().min(5),
    line2:   z.string().optional(),
    city:    z.string().min(2),
    state:   z.string().min(2),
    pincode: z.string().length(6),
  }),
  items: z.array(z.object({
    productId:    z.string().cuid(),
    quantity:     z.number().int().min(1),
    selectedSize: z.string().optional(),
    selectedColor: z.string().optional(),
    customValues: z.record(z.string()).optional(),
  })).min(1),
});
```

#### Environment Variables Required

```bash
# .env.local
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=        # rzp_test_...  /  rzp_live_...
RAZORPAY_KEY_SECRET=    # keep server-side only — never expose to client

NEXT_PUBLIC_RAZORPAY_KEY_ID=   # rzp_test_... (safe to expose — read-only)
```

---

## 6. Admin Panel Routes

All routes under `/admin/*` — protected by NextAuth middleware.

```
/admin                          → Dashboard (order stats, low-stock alerts)
/admin/products                 → Product list + create
/admin/products/[id]            → Edit product, manage images
/admin/products/[id]/schema     → Visual schema builder for custom fields
/admin/categories               → Create / reorder categories
/admin/orders                   → Order list with status filters
/admin/orders/[id]              → Order detail + status update
```

---

## 7. Implementation Order (Recommended)

```
Phase 1 — Foundation
  1. Install Prisma + init PostgreSQL connection
  2. Run migrations for all models above
  3. Seed database with existing PRODUCTS from src/lib/data.ts

Phase 2 — Catalog CMS
  4. Admin auth (NextAuth credentials)
  5. Product CRUD API routes
  6. Cloudinary image upload
  7. Replace static src/lib/data.ts with DB-backed API calls

Phase 3 — Customisation Engine
  8. Custom schema API routes
  9. Update CustomOrderForm to render dynamic fields
 10. Admin schema builder UI

Phase 4 — Commerce
 11. Cart state (Zustand or React Context)
 12. Checkout page + shipping address form
 13. Razorpay order creation API route
 14. Razorpay verification API route
 15. Order confirmation page

Phase 5 — Admin Operations
 16. Orders list + detail views
 17. Order status update (with email notification via Resend)
```

---

## 8. Security Checklist

- [ ] `RAZORPAY_KEY_SECRET` never sent to client — server-side only
- [ ] Signature verification uses `crypto.timingSafeEqual` (not `===`)
- [ ] All admin API routes check `getServerSession()` before executing
- [ ] Zod validation on every POST/PATCH body — no raw `req.body` usage
- [ ] Cloudinary upload signed server-side — direct browser uploads disabled
- [ ] `Content-Security-Policy` header configured in `next.config.ts`
- [ ] Rate-limit `/api/orders/*` routes (recommended: `@upstash/ratelimit`)

---

*End of Specification*
