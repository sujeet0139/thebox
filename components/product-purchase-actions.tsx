"use client";

import { MessageCircle, PhoneCall } from "lucide-react";
import { useState } from "react";

import { useSiteSettings } from "@/components/site-settings-provider";
import type { Product } from "@/lib/types";
import { buildProductInquiryUrl } from "@/lib/whatsapp";

import { AddToCartButton } from "./add-to-cart-button";

export function ProductPurchaseActions({ product }: { product: Product }) {
  const settings = useSiteSettings();
  const [quantity, setQuantity] = useState(1);
  const whatsappHref = buildProductInquiryUrl(settings.whatsapp, product, quantity);
  const phoneHref = `tel:${settings.phone.replace(/\s+/g, "")}`;

  return (
    <>
      <div className="mb-5 max-w-xs">
        <label htmlFor={`quote-quantity-${product.id}`} className="block text-sm font-semibold text-forest">
          Quantity for quote
        </label>
        <input
          id={`quote-quantity-${product.id}`}
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="mt-2 min-h-11 w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          inputMode="numeric"
        />
        <p className="mt-1.5 text-xs leading-5 text-ink/55">The team will confirm availability and any minimum quantity for this box.</p>
      </div>
      <div className="hidden flex-wrap gap-4 md:flex">
        <AddToCartButton product={product} quantity={quantity} className="w-auto min-w-[180px] px-6" />
        <a
          href={phoneHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest/15 px-6 py-3 text-sm font-semibold text-forest transition hover:bg-sand/50"
        >
          Call Now
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          Request Quote on WhatsApp
        </a>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[65] border-t border-[#d8c2a3]/70 bg-cream/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.85rem)] pt-3 shadow-[0_-14px_40px_rgba(23,59,42,0.16)] backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <AddToCartButton product={product} quantity={quantity} className="min-h-12 px-4" />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
        <a
          href={phoneHref}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-3 text-sm font-semibold text-forest transition hover:bg-sand/50"
        >
          <PhoneCall className="h-4 w-4" />
          Call {settings.phone}
        </a>
      </div>
    </>
  );
}
