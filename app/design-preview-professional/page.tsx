import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, LayoutGrid, MessageCircleMore, ShieldCheck, SwatchBook } from "lucide-react";

import { getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Professional Design Preview | TheBoxMakers",
  description:
    "Professional storefront preview with a calm color combination and easy-to-use layout for client approval.",
};

const features = [
  {
    icon: ShieldCheck,
    title: "Professional tone",
    copy: "A more corporate, trustworthy look for clients who prefer clarity over visual drama.",
  },
  {
    icon: LayoutGrid,
    title: "Easy scanning",
    copy: "Soft blue-gray cards and structured spacing make products easier to compare quickly.",
  },
  {
    icon: MessageCircleMore,
    title: "Simple action path",
    copy: "The page still supports the same fast WhatsApp-led order conversation after approval.",
  },
];

const notes = [
  "Uses a calmer navy, slate, and warm white combination.",
  "Feels easier to use for traditional business clients.",
  "Keeps strong product visibility without looking flashy.",
];

export default async function ProfessionalPreviewPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#eef3f7] pb-20 text-slate-900">
      <div className="border-b border-[#d7e1ea] bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
        <section className="container-shell py-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cfdbe6] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#38536b]">
                <SwatchBook className="h-3.5 w-3.5" />
                Concept C / Professional Theme
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl leading-tight text-[#163247] sm:text-6xl">
                A cleaner professional theme with calmer colors and easier client usability.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#597082] sm:text-lg sm:leading-8">
                This direction is designed for clients who want a polished, trustworthy, business-friendly design. It uses a softer navy and slate palette, clearer spacing, and a simpler browsing experience.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I reviewed the professional design preview and want to share feedback.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#163247] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2636]"
                >
                  Share Feedback
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/design-preview" className="rounded-full border border-[#cfdbe6] bg-white px-5 py-3 text-sm font-semibold text-[#163247] transition hover:bg-[#f8fbfd]">
                  View Eye-Catching Version
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {features.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-[#d7e1ea] bg-white p-5 shadow-[0_18px_45px_rgba(22,50,71,0.06)]">
                  <item.icon className="h-5 w-5 text-[#38536b]" />
                  <h2 className="mt-4 text-xl text-[#163247]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#597082]">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="container-shell pt-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#5d7486]">Professional Product Grid</p>
            <h2 className="mt-3 max-w-4xl text-3xl text-[#163247] sm:text-5xl">
              Soft contrast, clear cards, and a layout that feels dependable.
            </h2>
          </div>
          <div className="rounded-[22px] border border-[#d7e1ea] bg-white px-4 py-3 text-sm leading-6 text-[#597082]">
            Better for conservative or business-focused client presentations.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[28px] border border-[#d7e1ea] bg-white shadow-[0_20px_55px_rgba(22,50,71,0.06)] transition hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(22,50,71,0.12)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#dfe8ef]">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5d7486]">
                  {product.price_label || "Price on request"}
                </p>
                <h3 className="mt-3 text-lg leading-6 text-[#163247] sm:text-2xl">{product.name}</h3>
                <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#597082] sm:text-sm sm:leading-6">
                  {product.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(product.features?.slice(0, 2) || []).map((feature) => (
                    <span key={feature} className="rounded-full bg-[#eef3f7] px-3 py-1 text-[11px] font-semibold text-[#38536b]">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell pt-10">
        <div className="rounded-[32px] border border-[#d7e1ea] bg-white p-6 shadow-[0_20px_55px_rgba(22,50,71,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5d7486]">Why This Theme Works</p>
          <h2 className="mt-3 max-w-4xl text-3xl text-[#163247] sm:text-4xl">
            A safer color combination for clients who want professional polish and easy reading.
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {notes.map((note) => (
              <div key={note} className="flex gap-3 rounded-[22px] bg-[#f6f9fb] px-4 py-4 text-sm leading-6 text-[#38536b]">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, approve the professional theme preview for client use.")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#163247] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2636]"
            >
              Approve Professional Theme
            </a>
            <Link href="/" className="rounded-full border border-[#cfdbe6] px-5 py-3 text-sm font-semibold text-[#163247] transition hover:bg-[#f8fbfd]">
              Back to Live Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}