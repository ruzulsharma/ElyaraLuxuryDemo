-- ═══════════════════════════════════════════════════════════════════════════
-- Add payment screenshot + transaction ID fields to orders table
-- Also add 'created' status to the enum
-- ═══════════════════════════════════════════════════════════════════════════

-- Add new columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_screenshot text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_screenshot text;

-- Add 'created' status (initial state before admin confirms payment)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'created' BEFORE 'pending_payment';

-- ═══════════════════════════════════════════════════════════════════════════
-- Updated RLS policies for orders
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop old SELECT policy (too restrictive)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Anyone can INSERT orders (guests can place orders without login)
DROP POLICY IF EXISTS "Anyone can place orders" ON orders;
CREATE POLICY "Anyone can place orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read orders (app filters by email in code)
CREATE POLICY "Authenticated users can read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can update orders (admin changes status)
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════════
-- Order flow:
-- 1. Customer places order → status = 'created'
-- 2. Admin verifies payment (screenshot/UPI) → updates to 'placed'
-- 3. Admin starts production → 'in_production'
-- 4. Admin ships → 'shipped'
-- 5. Delivered → 'fulfilled'
-- ═══════════════════════════════════════════════════════════════════════════
