-- ═══════════════════════════════════════════════════════════════════════════
-- Update product image URLs to point to Supabase Storage bucket
-- ═══════════════════════════════════════════════════════════════════════════
-- 
-- INSTRUCTIONS:
-- 1. First upload all images to Supabase Storage → product-images/products/
-- 2. Then run this SQL to update the products table.
--
-- Replace the base URL below with YOUR actual Supabase project URL:
-- https://<YOUR_PROJECT_REF>.supabase.co/storage/v1/object/public/product-images/products/
-- ═══════════════════════════════════════════════════════════════════════════

-- Set your base URL here (change the project ref!)
DO $$
DECLARE
  base_url TEXT := 'https://gsfccgqpsedihunsucln.supabase.co/storage/v1/object/public/product-images/products/';
BEGIN

  -- Mira (Style 001)
  UPDATE products SET images = ARRAY[
    base_url || 'cat1.jpg',
    base_url || 'cat2.jpg'
  ] WHERE style_no = '001';

  -- Paro (Style 002)
  UPDATE products SET images = ARRAY[
    base_url || 'cat3.jpg',
    base_url || 'cat4.jpg'
  ] WHERE style_no = '002';

  -- Inaya (Style 003)
  UPDATE products SET images = ARRAY[
    base_url || 'cat5.jpg',
    base_url || 'cat6.jpg'
  ] WHERE style_no = '003';

  -- Alaya (Style 004)
  UPDATE products SET images = ARRAY[
    base_url || 'cat7.jpg',
    base_url || 'cat8.jpg'
  ] WHERE style_no = '004';

  -- Chaand Corset (Style 005)
  UPDATE products SET images = ARRAY[
    base_url || 'main1.jpg',
    base_url || 'Hero1.jpg'
  ] WHERE style_no = '005';

  -- Noor (Style 006)
  UPDATE products SET images = ARRAY[
    base_url || 'Hero2.jpg',
    base_url || 'main2.jpg'
  ] WHERE style_no = '006';

  -- Aira (Style 007)
  UPDATE products SET images = ARRAY[
    base_url || 'elyara.jpg',
    base_url || 'cat1.jpg'
  ] WHERE style_no = '007';

  -- Roselle (Style 008)
  UPDATE products SET images = ARRAY[
    base_url || 'cat2.jpg',
    base_url || 'cat3.jpg'
  ] WHERE style_no = '008';

  -- Elora (Style 009)
  UPDATE products SET images = ARRAY[
    base_url || 'cat4.jpg',
    base_url || 'cat5.jpg'
  ] WHERE style_no = '009';

  -- Piya (Style 010)
  UPDATE products SET images = ARRAY[
    base_url || 'cat6.jpg',
    base_url || 'cat7.jpg'
  ] WHERE style_no = '010';

  -- Ziva (Style 011)
  UPDATE products SET images = ARRAY[
    base_url || 'cat8.jpg',
    base_url || 'cat1.jpg'
  ] WHERE style_no = '011';

END $$;

-- Verify the update
SELECT style_no, name, images FROM products ORDER BY style_no;
