-- ═══════════════════════════════════════════════════════════════════════════
-- Newsletter Subscribers table
-- Stores emails from the homepage newsletter signup
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subscribers (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed  boolean NOT NULL DEFAULT false
);

-- RLS: Only service role (admin) can read subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert (subscribe) — no auth needed
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- Index for lookups
CREATE INDEX IF NOT EXISTS subscribers_email_idx ON subscribers (email);


-- ═══════════════════════════════════════════════════════════════════════════
-- Update order_status enum to include new statuses
-- ═══════════════════════════════════════════════════════════════════════════
-- NOTE: If you already have the enum, add missing values:

-- Add 'placed' status (for UPI/WhatsApp orders before payment confirmation)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'placed' BEFORE 'pending_payment';

-- Add 'payment_confirmed' status
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'payment_confirmed' AFTER 'pending_payment';

-- Add 'shipped' status (between in_production and delivered)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'shipped' AFTER 'in_production';

-- Add 'fulfilled' status (synonym for delivered — for admin clarity)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'fulfilled' AFTER 'delivered';

-- Updated status flow:
-- placed → payment_confirmed → in_production → shipped → fulfilled
-- (or: pending_payment → confirmed → in_production → shipped → delivered)
