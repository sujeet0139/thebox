import Image from "next/image";
import type { Metadata } from "next";

import {
  createCategoryAction,
  createProductAction,
  deleteCategoryAction,
  createSliderAction,
  updateSliderAction,
  deleteSliderAction,
  deleteProductAction,
  logoutAdminAction,
  updateCategoryAction,
  updateProductAction,
  updateSiteSettingsAction,
} from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/products";
import { getCategories, getSiteSettings, getSliderData } from "@/lib/site-settings";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | TheBoxMakers",
  robots: {
    index: false,
    follow: false,
  },
};

const dimensionUnits = ["mm", "cm", "inch", "ft"];

function getStatusMessage(status?: string) {
  switch (status) {
    case "created":
      return "Product created successfully.";
    case "updated":
      return "Product updated successfully.";
    case "deleted":
      return "Product deleted successfully.";
    case "missing":
      return "Please fill the required product fields.";
    case "category-created":
      return "Category created successfully.";
    case "category-updated":
      return "Category updated successfully.";
    case "category-deleted":
      return "Category deleted successfully.";
    case "category-missing":
      return "Please complete the required category fields.";
    case "settings-saved":
      return "Site settings updated successfully.";
    case "slider-created":
      return "Slider created successfully.";
    case "slider-updated":
      return "Slider updated successfully.";
    case "slider-deleted":
      return "Slider deleted successfully.";
    case "settings-error":
      return "Site settings could not be saved. Please check the table exists in Supabase.";
    case "category-error":
      return "Category changes could not be saved. Please check the categories table in Supabase.";
    case "error":
      return "Something went wrong while saving the product.";
    default:
      return "";
  }
}

function formatDimensionValue(product: Product) {
  const values = [product.length, product.width, product.height].filter((value) => typeof value === "number");

  if (!values.length) {
    return "";
  }

  return `${values.join(" x ")} ${product.dimension_unit || ""}`.trim();
}

async function getEnquiries(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]) {
  try {
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return data || [];
  } catch {
    return [];
  }
}

async function getInquiries(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]) {
  try {
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return data || [];
  } catch {
    return [];
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; tab?: string }> }) {
  const { user, supabase } = await requireAdmin();
  const products = await getProducts();
  const categories = await getCategories({ includeFallback: false });
  const settings = await getSiteSettings();
  const { status, tab = "products" } = await searchParams;
  const message = getStatusMessage(status);
  const slides = await getSliderData();

  const enquiries = await getEnquiries(supabase);
  const inquiries = await getInquiries(supabase);

  return (
    <section className="container-shell py-16">
      <div className="flex flex-col gap-4 rounded-[32px] bg-forest p-8 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sand/70">Admin Dashboard</p>
          <h1 className="mt-3 text-5xl text-sand">TheBoxMakers</h1>
          <p className="mt-3 text-sm text-sand/80">Signed in as {user.email}</p>
        </div>
        <form action={logoutAdminAction}>
          <button className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">Logout</button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "Products", value: products.length },
          { label: "Categories", value: categories.length },
          { label: "Enquiries", value: enquiries.length },
          { label: "Contact Msgs", value: inquiries.length },
          { label: "Slides", value: slides.length },
          { label: "Total Leads", value: enquiries.length + inquiries.length },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-5 text-center">
            <p className="text-3xl font-semibold text-forest">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-bark">{stat.label}</p>
          </div>
        ))}
      </div>

      {message ? <p className="mt-6 rounded-2xl bg-sand px-4 py-3 text-sm text-forest">{message}</p> : null}

      <div className="mt-8 flex flex-wrap gap-2 border-b border-forest/10 pb-2">
        {[
          { key: "products", label: "Products" },
          { key: "categories", label: `Categories (${categories.length})` },
          { key: "settings", label: "Site Settings" },
          { key: "enquiries", label: `Enquiries (${enquiries.length})` },
          { key: "contacts", label: `Contact Msgs (${inquiries.length})` },
          { key: "slider", label: `Slider (${slides.length})` },
        ].map((item) => (
          <a
            key={item.key}
            href={`/admin?tab=${item.key}`}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              tab === item.key ? "bg-forest text-white" : "border border-forest/10 text-slate-600 hover:text-forest"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      {tab === "products" ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="card-surface p-8">
            <h2 className="text-4xl text-forest">Add Product</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Set display order, category, and optional box dimensions from here.</p>
            <form action={createProductAction} className="mt-6 space-y-4">
              <input name="name" required placeholder="Product name *" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <input name="slug" placeholder="Slug (auto-generated if empty)" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <textarea name="description" required rows={4} placeholder="Short description *" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="price_label" placeholder="Price label" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="sort_order" type="number" min="0" defaultValue="0" placeholder="Sort order" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              </div>
              <select name="category" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3">
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <div className="grid gap-4 sm:grid-cols-4">
                <input name="length" type="number" step="0.01" min="0" placeholder="Length" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="width" type="number" step="0.01" min="0" placeholder="Width" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="height" type="number" step="0.01" min="0" placeholder="Height" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <select name="dimension_unit" defaultValue="cm" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3">
                  <option value="">Unit</option>
                  {dimensionUnits.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <textarea name="features" rows={4} placeholder="Features, one per line" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <textarea name="use_cases" rows={4} placeholder="Use cases, one per line" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">Product Image *</label>
                <input name="image" type="file" accept="image/*" required className="mt-2 w-full rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-3" />
              </div>
              <button className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Create Product</button>
            </form>
          </div>

          <div className="space-y-6">
            {products.map((product) => {
              const dimensions = formatDimensionValue(product);

              return (
                <div key={product.id} className="card-surface overflow-hidden p-6">
                  <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                    <div className="relative h-48 overflow-hidden rounded-[24px]">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl text-forest">{product.name}</h2>
                          <p className="mt-1 text-sm text-slate-500">/{product.slug}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {product.category ? (
                              <span className="inline-block rounded-full bg-sand px-3 py-1 text-xs font-semibold text-bark">{product.category}</span>
                            ) : null}
                            <span className="inline-block rounded-full bg-forest/5 px-3 py-1 text-xs font-semibold text-forest">Order #{product.sort_order || 0}</span>
                            {dimensions ? (
                              <span className="inline-block rounded-full bg-forest/5 px-3 py-1 text-xs font-semibold text-forest">{dimensions}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <form action={updateProductAction} className="mt-5 space-y-3">
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="current_image" value={product.image_url} />
                        <input type="hidden" name="current_slug" value={product.slug} />
                        <input name="name" defaultValue={product.name} required className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        <input name="slug" defaultValue={product.slug} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        <textarea name="description" defaultValue={product.description} rows={3} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input name="price_label" defaultValue={product.price_label || ""} placeholder="Price label" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                          <input name="sort_order" type="number" min="0" defaultValue={product.sort_order || 0} placeholder="Sort order" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        </div>
                        <select name="category" defaultValue={product.category || ""} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm">
                          <option value="">No category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                          ))}
                        </select>
                        <div className="grid gap-3 sm:grid-cols-4">
                          <input name="length" type="number" min="0" step="0.01" defaultValue={product.length ?? ""} placeholder="Length" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                          <input name="width" type="number" min="0" step="0.01" defaultValue={product.width ?? ""} placeholder="Width" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                          <input name="height" type="number" min="0" step="0.01" defaultValue={product.height ?? ""} placeholder="Height" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                          <select name="dimension_unit" defaultValue={product.dimension_unit || ""} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm">
                            <option value="">Unit</option>
                            {dimensionUnits.map((unit) => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                        <textarea name="features" defaultValue={(product.features || []).join("\n")} rows={3} placeholder="Features, one per line" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        <textarea name="use_cases" defaultValue={(product.use_cases || []).join("\n")} rows={3} placeholder="Use cases, one per line" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">Replace image (optional)</label>
                          <input name="image" type="file" accept="image/*" className="mt-2 w-full rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-3 text-sm" />
                        </div>
                        <button className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">Save Changes</button>
                      </form>

                      <form action={deleteProductAction} className="mt-3">
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="slug" value={product.slug} />
                        <button className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600">Delete Product</button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "categories" ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="card-surface p-8">
            <h2 className="text-4xl text-forest">Manage Categories</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Create your product categories once, then reuse them in the product form.</p>
            <form action={createCategoryAction} className="mt-6 space-y-4">
              <input name="name" required placeholder="Category name *" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <input name="slug" placeholder="Slug (auto-generated if empty)" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <input name="sort_order" type="number" min="0" defaultValue="0" placeholder="Sort order" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <label className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm font-medium text-forest">
                  <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded border-forest/20" />
                  Active
                </label>
              </div>
              <button className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Add Category</button>
            </form>
          </div>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="card-surface p-6">
                <form action={updateCategoryAction} className="grid gap-3 lg:grid-cols-[1.1fr_1fr_140px_auto_auto] lg:items-center">
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="old_name" value={category.name} />
                  <input name="name" defaultValue={category.name} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                  <input name="slug" defaultValue={category.slug} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                  <input name="sort_order" type="number" min="0" defaultValue={category.sort_order || 0} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                  <label className="flex items-center gap-2 rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm font-medium text-forest">
                    <input type="checkbox" name="is_active" defaultChecked={category.is_active !== false} className="h-4 w-4 rounded border-forest/20" />
                    Active
                  </label>
                  <button className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white">Save</button>
                </form>
                <form action={deleteCategoryAction} className="mt-3">
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="name" value={category.name} />
                  <button className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600">Delete Category</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.85fr]">
          <div className="card-surface p-8">
            <h2 className="text-4xl text-forest">Site Settings</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Update contact details and social links used across the storefront.</p>
            <form action={updateSiteSettingsAction} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input name="phone" defaultValue={settings.phone} placeholder="Phone" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="whatsapp" defaultValue={settings.whatsapp} placeholder="WhatsApp number" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              </div>
              <input name="email" defaultValue={settings.email} placeholder="Email" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <textarea name="address" defaultValue={settings.address} rows={3} placeholder="Address" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <input name="map_url" defaultValue={settings.mapUrl || ""} placeholder="Google Maps link" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <div className="grid gap-4 md:grid-cols-2">
                <input name="facebook_url" defaultValue={settings.facebookUrl || ""} placeholder="Facebook URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="instagram_url" defaultValue={settings.instagramUrl || ""} placeholder="Instagram URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="linkedin_url" defaultValue={settings.linkedinUrl || ""} placeholder="LinkedIn URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
                <input name="youtube_url" defaultValue={settings.youtubeUrl || ""} placeholder="YouTube URL" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              </div>
              <button className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Save Site Settings</button>
            </form>
          </div>

          <div className="card-surface p-8">
            <h3 className="text-3xl text-forest">Live Summary</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Phone</p>
                <p className="mt-1">{settings.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">WhatsApp</p>
                <p className="mt-1">{settings.whatsapp}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Email</p>
                <p className="mt-1">{settings.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Address</p>
                <p className="mt-1">{settings.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Social Links</p>
                <ul className="mt-2 space-y-2">
                  {[settings.facebookUrl, settings.instagramUrl, settings.linkedinUrl, settings.youtubeUrl].filter(Boolean).length ? (
                    [
                      { label: "Facebook", value: settings.facebookUrl },
                      { label: "Instagram", value: settings.instagramUrl },
                      { label: "LinkedIn", value: settings.linkedinUrl },
                      { label: "YouTube", value: settings.youtubeUrl },
                    ]
                      .filter((item) => item.value)
                      .map((item) => <li key={item.label}>{item.label}: {item.value}</li>)
                  ) : (
                    <li>No social links added yet.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "slider" ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="card-surface p-8">
            <h2 className="text-4xl text-forest">Manage Slider</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Add, update, or remove slides for the homepage slider.</p>
            <form action={createSliderAction} className="mt-6 space-y-4">
              <input name="title" required placeholder="Slider title *" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <input name="link_url" required placeholder="Link URL (e.g., /products/box-a) *" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <input name="order" type="number" min="0" defaultValue="0" placeholder="Sort order" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">Slider Image *</label>
                <input name="image" type="file" accept="image/*" required className="mt-2 w-full rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-3" />
              </div>
              <button className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Add Slide</button>
            </form>
          </div>

          <div className="space-y-4">
            {slides.map((slide) => (
              <div key={slide.id} className="card-surface p-6">
                <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
                  <div className="relative h-32 overflow-hidden rounded-2xl">
                    <Image src={slide.image_url} alt={slide.title} fill className="object-cover" />
                  </div>
                  <div>
                    <form action={updateSliderAction} className="space-y-3">
                      <input type="hidden" name="id" value={slide.id} />
                      <input type="hidden" name="current_image_url" value={slide.image_url} />
                      <input name="title" defaultValue={slide.title} required className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                      <input name="link_url" defaultValue={slide.link_url} required className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                      <div className="grid grid-cols-2 gap-3">
                        <input name="order" type="number" min="0" defaultValue={slide.order || 0} className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm" />
                        <button className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">Save</button>
                      </div>
                      <div>
                        <label className="mt-1 block text-xs font-semibold uppercase tracking-[0.28em] text-bark">Replace image (optional)</label>
                        <input name="image" type="file" accept="image/*" className="mt-2 w-full rounded-2xl border border-dashed border-forest/20 bg-cream px-4 py-3 text-sm" />
                      </div>
                    </form>
                    <form action={deleteSliderAction} className="mt-3">
                      <input type="hidden" name="id" value={slide.id} />
                      <input type="hidden" name="image_url" value={slide.image_url} />
                      <button className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600">Delete Slide</button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "enquiries" ? (
        <div className="mt-8">
          <h2 className="text-3xl text-forest">Custom Enquiries</h2>
          <p className="mt-2 text-sm text-slate-500">Submitted from the /enquiry page with box size and type details.</p>
          {enquiries.length === 0 ? (
            <div className="card-surface mt-6 p-8 text-center">
              <p className="text-slate-500">No enquiries yet.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {(enquiries as Array<Record<string, string>>).map((enquiry, index) => (
                <div key={enquiry.id || index} className="card-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-forest">{enquiry.name}</p>
                      <a href={`tel:${enquiry.phone}`} className="text-sm text-bark">{enquiry.phone}</a>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString("en-IN") : ""}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {enquiry.box_type ? <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-bark">{enquiry.box_type}</span> : null}
                    {enquiry.box_size ? <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-bark">Size: {enquiry.box_size}</span> : null}
                  </div>
                  {enquiry.message ? <p className="mt-3 text-sm leading-6 text-slate-600">{enquiry.message}</p> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "contacts" ? (
        <div className="mt-8">
          <h2 className="text-3xl text-forest">Contact Messages</h2>
          <p className="mt-2 text-sm text-slate-500">Submitted from the /contact page.</p>
          {inquiries.length === 0 ? (
            <div className="card-surface mt-6 p-8 text-center">
              <p className="text-slate-500">No contact messages yet.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {(inquiries as Array<Record<string, string>>).map((inquiry, index) => (
                <div key={inquiry.id || index} className="card-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-forest">{inquiry.name}</p>
                      <a href={`tel:${inquiry.phone}`} className="text-sm text-bark">{inquiry.phone}</a>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString("en-IN") : ""}
                    </div>
                  </div>
                  {inquiry.message ? <p className="mt-3 text-sm leading-6 text-slate-600">{inquiry.message}</p> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
