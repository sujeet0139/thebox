"use client";

import { Loader2, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useSiteSettings } from "@/components/site-settings-provider";
import type { Product } from "@/lib/types";
import { buildProductInquiryUrl } from "@/lib/whatsapp";

import { useCart } from "./cart-provider";

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  showQuickActions = true,
}: {
  product: Product;
  quantity?: number;
  className?: string;
  showQuickActions?: boolean;
}) {
  const { addItem, openCart } = useCart();
  const { whatsapp } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!showModal) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const safeQuantity = Math.max(1, quantity);
  const whatsappHref = buildProductInquiryUrl(whatsapp, product, safeQuantity);

  const handleAddToCart = () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    addItem(product, safeQuantity);
    window.setTimeout(() => {
      setIsSubmitting(false);
      if (showQuickActions) {
        setShowModal(true);
      }
    }, 250);
  };

  const handleViewCart = () => {
    setShowModal(false);
    openCart();
  };

  const modal = showModal ? (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        onClick={() => setShowModal(false)}
        aria-label="Close quote list confirmation"
      />
      <div className="relative z-[131] w-full max-w-sm overflow-hidden rounded-[28px] border border-[#d8c2a3]/70 bg-cream shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-forest/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Added to Quote List</p>
            <h3 className="mt-1 text-lg font-semibold text-forest">{product.name}</h3>
            <p className="mt-1 text-sm text-ink/65">Quantity: {safeQuantity}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-full border border-forest/15 p-2 text-forest transition hover:bg-white"
            aria-label="Close quote list dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 px-5 py-5">
          <button
            type="button"
            onClick={handleViewCart}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest/90"
          >
            Review Quote List
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,211,102,0.24)] transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Request Quote on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-forest/15 bg-white px-4 py-3 text-sm font-semibold text-forest transition hover:bg-sand/50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isSubmitting}
        className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:opacity-85 ${className}`.trim()}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
        <span>{isSubmitting ? "Adding..." : "Add to Quote List"}</span>
      </button>

      {isMounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
