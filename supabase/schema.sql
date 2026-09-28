create extension if not exists pgcrypto;

-- -------------------------------------------------------
-- Products
-- -------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  image_url text not null,
  price_label text,
  category text,
  features text[] default '{}',
  gallery text[] default '{}',
  use_cases text[] default '{}',
  sort_order integer not null default 0,
  stock integer not null default 0,
  length numeric,
  breadth numeric,
  width numeric,
  height numeric,
  dimension_unit text,
  weight numeric,
  weight_unit text,
  volume numeric,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.products add column if not exists price_label text;
alter table public.products add column if not exists category text;
alter table public.products add column if not exists sort_order integer not null default 0;
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists length numeric;
alter table public.products add column if not exists breadth numeric;
alter table public.products add column if not exists width numeric;
alter table public.products add column if not exists height numeric;
alter table public.products add column if not exists dimension_unit text;
alter table public.products add column if not exists weight numeric;
alter table public.products add column if not exists weight_unit text;
alter table public.products add column if not exists volume numeric;
alter table public.products add column if not exists is_active boolean not null default true;

-- -------------------------------------------------------
-- Product categories
-- -------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.categories add column if not exists sort_order integer not null default 0;
alter table public.categories add column if not exists is_active boolean not null default true;

-- -------------------------------------------------------
-- Site settings singleton
-- -------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key default 1,
  phone text,
  whatsapp text,
  email text,
  address text,
  map_url text,
  facebook_url text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (
  id,
  phone,
  whatsapp,
  email,
  address
)
values (
  1,
  '+91 8920894998',
  '918920894998',
  'sales@theboxmakers.com',
  'Sector 102, Gurugram, Haryana 122505'
)
on conflict (id) do nothing;

-- -------------------------------------------------------
-- Contact inquiries (from /contact page)
-- -------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

-- -------------------------------------------------------
-- Custom enquiries (from /enquiry page)
-- -------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  box_type text,
  box_size text,
  message text,
  created_at timestamptz not null default timezone('utc', now())
);

-- -------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.site_settings enable row level security;
alter table public.inquiries enable row level security;
alter table public.enquiries enable row level security;

-- Products policies
drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select using (true);

drop policy if exists "Authenticated users manage products" on public.products;
create policy "Authenticated users manage products"
  on public.products for all to authenticated
  using (true) with check (true);

-- Categories policies
drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories"
  on public.categories for select using (true);

drop policy if exists "Authenticated users manage categories" on public.categories;
create policy "Authenticated users manage categories"
  on public.categories for all to authenticated
  using (true) with check (true);

-- Site settings policies
drop policy if exists "Anyone can read site settings" on public.site_settings;
create policy "Anyone can read site settings"
  on public.site_settings for select using (true);

drop policy if exists "Authenticated users manage site settings" on public.site_settings;
create policy "Authenticated users manage site settings"
  on public.site_settings for all to authenticated
  using (true) with check (true);

-- Inquiries policies
drop policy if exists "Anyone can create inquiries" on public.inquiries;
create policy "Anyone can create inquiries"
  on public.inquiries for insert to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can read inquiries" on public.inquiries;
create policy "Authenticated users can read inquiries"
  on public.inquiries for select to authenticated
  using (true);

-- Enquiries policies
drop policy if exists "Anyone can create enquiries" on public.enquiries;
create policy "Anyone can create enquiries"
  on public.enquiries for insert to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can read enquiries" on public.enquiries;
create policy "Authenticated users can read enquiries"
  on public.enquiries for select to authenticated
  using (true);

-- -------------------------------------------------------
-- Storage bucket for product images
-- -------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can update product images" on storage.objects;
create policy "Authenticated users can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');