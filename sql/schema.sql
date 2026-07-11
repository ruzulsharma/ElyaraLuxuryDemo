-- ═══════════════════════════════════════════════════════════════════════════
-- Elyara by Sweety — Supabase Schema
-- Run this in the Supabase SQL Editor: supabase.com → your project → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Enum: order status ───────────────────────────────────────────────────────
create type order_status as enum (
  'pending_payment',
  'payment_failed',
  'confirmed',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

-- ── Table: orders ────────────────────────────────────────────────────────────
create table if not exists orders (
  id                  uuid primary key default uuid_generate_v4(),
  order_number        text unique not null,
  status              order_status not null default 'pending_payment',
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text not null,
  shipping_address    jsonb not null,   -- ShippingAddress
  items               jsonb not null,   -- OrderLineItem[]
  subtotal_paise      integer not null check (subtotal_paise >= 0),
  shipping_paise      integer not null default 0,
  total_paise         integer not null check (total_paise >= 0),
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  razorpay_signature  text,
  paid_at             timestamptz,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ── Table: profiles ───────────────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create profile on new user signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table orders enable row level security;
alter table profiles enable row level security;

-- Admins (service role) can do everything — no policy needed for service role.
-- Regular authenticated users can read their own orders.
create policy "Users can view own orders"
  on orders for select
  using (customer_email = auth.jwt() ->> 'email');

-- Users can read/update their own profile
create policy "Users can read own profile"
  on profiles for select using (id = auth.uid());

create policy "Users can update own profile"
  on profiles for update using (id = auth.uid());

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists orders_customer_email_idx on orders (customer_email);
create index if not exists orders_razorpay_order_id_idx on orders (razorpay_order_id);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_created_at_idx on orders (created_at desc);
