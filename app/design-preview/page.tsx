import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, MessageCircleMore, Palette, Rows3, Sparkles, Star } from "lucide-react";

import { getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Design Preview | TheBoxMakers",
  description:
    "Alternate storefront design preview for client approval. Review a more eye-catching visual direction before replacing the live homepage.",
};

const previewPoints = [
  {
    icon: Rows3,
    title: "Products hit first",
    copy: "The design pushes the product wall right into view so buyers feel the catalog instantly.",
  },
  {
    icon: Palette,
    title: "Bolder visual identity",
    copy: "A louder pattern system, richer color blocks, and oversized type create a premium branded feel.",
  },
  {
    icon: MessageCircleMore,
    title: "Approval-safe preview",
    copy: "This stays separate from the live homepage so the client can approve confidently before rollout.",
  },
];

const notes = [
  "Keep the current homepage live while the client reviews this concept.",
  "Use this page to validate visual energy, layout balance, and product visibility.",
  "After approval, we can promote this exact direction into the main index page.",
];

export default async function DesignPreviewPage() {
  const products = await getProducts();

  return (
    <div className="relative overflow-hidden bg-[#f4ead8] pb-20 text-slate-900">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.9),transparent_18%),radial-gradient(circle_at_85%_12%,rgba(31,77,54,0.18),transparent_24%),radial-gradient(circle_at_78%_82%,rgba(196,145,72,0.22),transparent_20%),linear-gradient(160deg,#f8f0df_0%,#f0dfbf_48%,#eeddb7_100%)]" />
      <div className="absolute inset-0 -z-20 opacity-60 [background-image:linear-gradient(rgba(31,77,54,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(31,77,54,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute -left-24 top-28 -z-10 h-72 w-72 rounded-full bg-[#1f4d36]/15 blur-3xl" />
      <div className="absolute right-0 top-0 -z-10 h-80 w-80 translate-x-24 -translate-y-12 rounded-full bg-[#c49148]/25 blur-3xl" />

      <section className="container-shell pt-8 sm:pt-12">
        <div className="relative overflow-hidden rounded-[36px] border border-forest/10 bg-[#173a2a] px-5 py-6 text-white shadow-[0_30px_100px_rgba(31,77,54,0.28)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.08))]" />
          <div className="absolute right-[-60px] top-[-40px] h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute bottom-[-70px] left-[-40px] h-56 w-56 rounded-full border border-white/10" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#f7e8c8] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Concept B / Client Preview
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                A louder, sharper storefront that feels more premium at first glance.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#f5f0e5]/82 sm:text-lg sm:leading-8">
                This direction is built to feel more eye-catching: stronger contrast, oversized type, layered pattern work, and a product wall that looks more intentional when a client opens the page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I reviewed the Concept B preview and want to share feedback.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Share Feedback
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  View Live Homepage
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {previewPoints.map((point) => (
                <div key={point.title} className="rounded-[26px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <point.icon className="h-5 w-5 text-[#f7e8c8]" />
                  <h2 className="mt-4 text-xl text-white">{point.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#f5f0e5]/78">{point.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pt-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-bark">Product Wall / Concept B</p>
            <h2 className="mt-3 max-w-4xl text-3xl leading-tight text-forest sm:text-5xl">
              Bigger cards, richer colors, and a gallery that feels built for approval.
            </h2>
          </div>
          <div className="rounded-[24px] border border-white/60 bg-white/70 px-4 py-3 text-sm leading-6 text-bark shadow-lg backdrop-blur">
            Designed to feel more premium and memorable in the first 5 seconds.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {products.map((product, index) => {
            const theme =
              index % 3 === 0
                ? "bg-[#173a2a] text-white"
                : index % 3 === 1
                  ? "bg-white text-slate-900"
                  : "bg-[#c49148] text-[#1d1d1d]";

            const chipTheme =
              index % 3 === 0
                ? "bg-white/10 text-white"
                : index % 3 === 1
                  ? "bg-sand text-bark"
                  : "bg-white/50 text-[#4f3210]";

            const bodyTheme = index % 3 === 0 ? "text-[#f5f0e5]/84" : index % 3 === 1 ? "text-slate-600" : "text-[#4a3416]";
            const priceTheme = index % 3 === 0 ? "text-[#f7e8c8]" : index % 3 === 1 ? "text-bark" : "text-[#5e3d14]";

            return (
              <article
                key={product.id}
                className={`group relative overflow-hidden rounded-[30px] border border-black/5 shadow-[0_28px_80px_rgba(31,77,54,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_rgba(31,77,54,0.2)] ${theme}`}
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%)]" />
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur sm:left-5 sm:top-5">
                    <Star className="h-3 w-3" />
                    Featured Look
                  </div>
                </div>
                <div className="relative p-4 sm:p-6">
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${priceTheme}`}>
                    {product.price_label || "Price on request"}
                  </p>
                  <h3 className="mt-3 text-lg leading-6 sm:text-[1.75rem] sm:leading-8">{product.name}</h3>
                  <p className={`mt-3 line-clamp-3 text-xs leading-5 sm:text-sm sm:leading-6 ${bodyTheme}`}>
                    {product.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(product.features?.slice(0, 2) || []).map((feature) => (
                      <span key={feature} className={`rounded-full px-3 py-1 text-[11px] font-semibold ${chipTheme}`}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-shell pt-10">
        <div className="relative overflow-hidden rounded-[36px] border border-forest/10 bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#c49148]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#1f4d36]/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-bark">Approval Notes</p>
            <h2 className="mt-3 max-w-4xl text-3xl text-forest sm:text-4xl">
              If the client likes this energy, we can move this design language into the main homepage next.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {notes.map((note) => (
                <div key={note} className="flex gap-3 rounded-[24px] bg-[#f7efdf] px-4 py-4 text-sm leading-6 text-forest">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, approve Concept B and use it for the homepage.")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest/90"
              >
                Approve This Direction
              </a>
              <Link href="/products" className="rounded-full border border-forest/15 px-5 py-3 text-sm font-semibold text-forest transition hover:bg-sand">
                Compare With Product Page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}