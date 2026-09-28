"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Ruler } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { useSiteSettings } from "@/components/site-settings-provider";
import type { Product } from "@/lib/types";
import { buildProductInquiryUrl } from "@/lib/whatsapp";

function formatDimensions(product: Product) {
  const values = [product.length, product.width, product.height].filter((value) => typeof value === "number");

  if (!values.length) {
    return "";
  }

  return `${values.join(" x ")} ${product.dimension_unit || ""}`.trim();
}

export function ProductCard({ product }: { product: Product }) {
  const { whatsapp } = useSiteSettings();
  const [quantity, setQuantity] = useState(1);
  const priceLabel = product.price_label || "Quote for your specifications";
  const dimensions = formatDimensions(product);

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden rounded-[20px] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(23,59,42,0.15)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.category ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-bark backdrop-blur-sm">
            {product.category}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/80 to-transparent px-3 py-2.5">
          <p className="text-xs font-bold text-white drop-shadow">{priceLabel}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-forest sm:text-base sm:leading-6">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-4 text-ink/60 sm:leading-5">{product.description}</p>
          {dimensions ? (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest sm:text-[11px]">
              <Ruler className="h-3 w-3" />
              <span>{dimensions}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-auto grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="inline-flex w-full items-center justify-between rounded-full border border-[#d8c2a3]/70 bg-white text-forest sm:w-auto sm:justify-start">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="px-3 py-2 text-sm font-bold leading-none transition hover:bg-sand/60"
              aria-label={`Decrease quantity for ${product.name}`}
            >
              -
            </button>
            <span className="min-w-8 text-center text-xs font-semibold sm:min-w-7">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="px-3 py-2 text-sm font-bold leading-none transition hover:bg-sand/60"
              aria-label={`Increase quantity for ${product.name}`}
            >
              +
            </button>
          </div>
          <AddToCartButton product={product} quantity={quantity} className="py-2.5 text-xs sm:text-sm" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <a
            href={buildProductInquiryUrl(whatsapp, product, quantity)}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#25D366]/20 bg-white px-3 py-2 text-[11px] font-semibold text-[#1c8c47] transition hover:bg-[#25D366]/8 sm:text-xs"
          >
            <MessageCircle className="h-3 w-3" />
            Ask on WhatsApp
          </a>
          <Link
            href={`/products/${product.slug}`}
            className="flex min-h-10 items-center justify-center rounded-full border border-forest/15 bg-white px-3 py-2 text-[11px] font-semibold text-forest transition hover:bg-sand sm:text-xs"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
