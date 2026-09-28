# TheBoxMakers

Production-ready Next.js App Router website for a carton packaging business, designed for Vercel deployment and Supabase-backed content management.

## Stack

- Next.js 16 App Router
- Tailwind CSS
- Supabase with `@supabase/ssr`
- Vercel-ready deployment

## Features

- SEO-friendly home, products, product detail, about, and contact pages
- Dynamic product routes at `/products/[slug]`
- Supabase inquiry form storage
- Secure admin login using Supabase Auth
- Protected admin dashboard at `/admin`
- Product create, edit, delete, and image upload to Supabase Storage
- `sitemap.xml`, `robots.txt`, Open Graph image, and metadata API usage
- WhatsApp floating button and mobile call CTA
- Google Analytics support via env var

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://www.theboxmakers.in
NEXT_PUBLIC_GA_ID=
ADMIN_EMAILS=admin@example.com
GOOGLE_MAPS_EMBED_URL=
```

## Supabase Setup

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` in the SQL editor.
3. In Supabase Auth, create the admin user you want to use for `/admin/login`.
4. Add that email to `ADMIN_EMAILS`.
5. Confirm the `product-images` storage bucket exists and is public.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables in the Vercel dashboard.
4. Deploy.

## Notes

- If Supabase env vars are missing, the site still renders fallback sample products so the frontend can build.
- Inquiry storage and admin features require Supabase configuration.
- Product image uploads are handled through authenticated storage access, not deprecated Supabase auth helpers.

