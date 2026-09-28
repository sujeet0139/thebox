"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Factory, MessageCircleMore, Package, ShieldCheck, Truck } from "lucide-react";

import { siteConfig } from "@/lib/site";
import type { Product } from "@/lib/types";

const capabilityPoints = [
  "Custom box sizes and board grades for shipping, storage, and retail packaging.",
  "Print-ready mailers, export cartons, and protective corrugated solutions.",
  "Fast WhatsApp-led ordering with team follow-up for final specifications.",
];

const trustStats = [
  { value: "48 hrs", label: "Quote and sampling response" },
  { value: "3-7 Ply", label: "Corrugation strength options" },
  { value: "100%", label: "Focus on recyclable materials" },
];

export function DesignPreviewShowcase({ products }: { products: Product[] }) {
  const bannerSlides = useMemo(
    () =>
      products.slice(0, 3).map((product, index) => ({
        id: product.id,
        title: product.name,
        copy:
          index === 0
            ? "Engineered carton packaging for modern e-commerce and warehouse movement."
            : index === 1
              ? "Export-ready corrugated strength with cleaner brand presentation."
              : "Custom printed packaging built to protect products and elevate unboxing.",
        image: product.gallery?.[0] || product.image_url,
      })),
    [products],
  );

  const [activeBanner, setActiveBanner] = useState(0);
  const productRailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bannerSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % bannerSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [bannerSlides.length]);

  const slideProductRail = (direction: "left" | "right") => {
    const rail = productRailRef.current;
    if (!rail) {
      return;
    }

    const amount = rail.clientWidth * 0.82;
    rail.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="bg-[#edf2f6] text-slate-900">
      <section className="relative overflow-hidden border-b border-[#d7e0e8] bg-[#163247] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]" />
        <div className="container-shell relative py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#dbe8f2] backdrop-blur">
                Carton Site Showcase
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl leading-[0.96] text-white sm:text-6xl">
                Full professional carton website concept for client approval.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#dbe8f2] sm:text-lg sm:leading-8">
                This version is designed to impress with a rotating banner, stronger product storytelling, and a cleaner corporate packaging look that feels closer to a final client-facing website.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I reviewed the full showcase concept and want to share feedback.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Share Feedback
                </a>
                <Link href="/design-preview-professional" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Compare Professional Theme
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {trustStats.map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-2xl text-white">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-[#dbe8f2]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#102536] shadow-[0_28px_80px_rgba(0,0,0,0.25)]">
              <div className="relative aspect-[5/4] overflow-hidden">
                {bannerSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === activeBanner ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,30,0.15),rgba(10,20,30,0.78))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f5d69b]">Banner Slide {index + 1}</p>
                      <h2 className="mt-3 max-w-2xl text-2xl leading-tight text-white sm:text-4xl">{slide.title}</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-[#dce8f1] sm:text-base">{slide.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
                <div className="flex gap-2">
                  {bannerSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveBanner(index)}
                      className={`h-2.5 rounded-full transition-all ${index === activeBanner ? "w-10 bg-white" : "w-2.5 bg-white/35"}`}
                      aria-label={`View banner slide ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-[#dce8f1]">Sliding hero preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10 sm:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {capabilityPoints.map((point, index) => {
            const Icon = index === 0 ? Package : index === 1 ? ShieldCheck : MessageCircleMore;
            return (
              <div key={point} className="rounded-[28px] border border-[#d7e0e8] bg-white p-6 shadow-[0_22px_60px_rgba(22,50,71,0.06)]">
                <Icon className="h-6 w-6 text-[#244a66]" />
                <p className="mt-4 text-base leading-7 text-[#26465f]">{point}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-shell pb-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#60788c]">Sliding Product Showcase</p>
            <h2 className="mt-3 max-w-4xl text-3xl text-[#163247] sm:text-5xl">
              Product descriptions feel fuller, cleaner, and more suitable for a professional carton company site.
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => slideProductRail("left")}
              className="rounded-full border border-[#c9d6e1] bg-white p-3 text-[#163247] transition hover:bg-[#f8fbfd]"
              aria-label="Slide products left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => slideProductRail("right")}
              className="rounded-full border border-[#c9d6e1] bg-white p-3 text-[#163247] transition hover:bg-[#f8fbfd]"
              aria-label="Slide products right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={productRailRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <article key={product.id} className="min-w-[86%] snap-start overflow-hidden rounded-[30px] border border-[#d7e0e8] bg-white shadow-[0_22px_65px_rgba(22,50,71,0.07)] md:min-w-[46%] xl:min-w-[32%]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#dce7ef]">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 86vw, (max-width: 1280px) 46vw, 32vw" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#60788c]">{product.price_label || "Price on request"}</p>
                <h3 className="mt-3 text-2xl text-[#163247]">{product.name}</h3>
                <p className="mt-4 text-sm leading-7 text-[#597082]">{product.description}</p>
                <div className="mt-5 space-y-3">
                  {(product.features?.slice(0, 3) || []).map((feature) => (
                    <div key={feature} className="flex gap-3 text-sm leading-6 text-[#26465f]">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#244a66]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/products/${product.slug}`} className="rounded-full border border-[#c9d6e1] px-5 py-3 text-sm font-semibold text-[#163247] transition hover:bg-[#f8fbfd]">
                    View Details
                  </Link>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(`Hi TheBoxMakers, I want details for ${product.name}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#163247] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2636]"
                  >
                    WhatsApp Inquiry
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#d7e0e8] bg-white">
        <div className="container-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#60788c]">Why This Looks Strong</p>
            <h2 className="mt-3 text-3xl text-[#163247] sm:text-5xl">Professional sections that make the site feel like a real packaging brand.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Factory, title: "Manufacturing focus", copy: "Production-ready language and industrial credibility." },
              { icon: Truck, title: "Dispatch confidence", copy: "Built around logistics, handling, and delivery flow." },
              { icon: ShieldCheck, title: "Protection promise", copy: "Stronger emphasis on board strength and product safety." },
            ].map((item) => (
              <div key={item.title} className="rounded-[26px] bg-[#f6f9fb] p-5">
                <item.icon className="h-5 w-5 text-[#244a66]" />
                <h3 className="mt-4 text-xl text-[#163247]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#597082]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-10 sm:py-14">
        <div className="rounded-[34px] border border-[#d7e0e8] bg-[linear-gradient(135deg,#163247_0%,#224761_100%)] p-6 text-white shadow-[0_26px_70px_rgba(22,50,71,0.18)] sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#dce8f1]">Approval Route</p>
          <h2 className="mt-3 max-w-4xl text-3xl sm:text-5xl">If the client wants a full website-style presentation, this is the strongest preview route to show.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#dce8f1] sm:text-lg sm:leading-8">
            It combines banner movement, product storytelling, and a more established carton-site structure. This makes it feel closer to a final premium business website than a simple landing page mockup.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, approve the full showcase website concept.")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#163247] transition hover:bg-[#eef3f7]"
            >
              Approve Showcase Concept
            </a>
            <Link href="/design-preview" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Compare Eye-Catching Theme
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}