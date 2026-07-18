-- ═══════════════════════════════════════════════════════════════════════════
-- Add new order statuses to the enum
-- Run this in Supabase SQL Editor AFTER the initial schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- Add 'placed' status (for UPI/WhatsApp orders before payment)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'placed' BEFORE 'pending_payment';

-- Add 'payment_confirmed' status (admin manually confirms UPI payment)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'payment_confirmed' AFTER 'pending_payment';

-- Add 'fulfilled' status (order completed and handed over)
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'fulfilled' AFTER 'delivered';

-- ═══════════════════════════════════════════════════════════════════════════
-- Order flow:
--
-- UPI/WhatsApp:  placed → payment_confirmed → in_production → shipped → fulfilled
-- Razorpay:      pending_payment → confirmed → in_production → shipped → fulfilled
-- ═══════════════════════════════════════════════════════════════════════════
