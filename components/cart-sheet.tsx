"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, X, Package, MessageCircle } from "lucide-react";
import { useState } from "react";

import { useSiteSettings } from "@/components/site-settings-provider";
import type { UserDetails } from "@/lib/types";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";

import { useCart } from "./cart-provider";

export function CartSheet() {
  const {
    items,
    totalItems,
    isCartOpen,
    closeCart,
    openCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { whatsapp } = useSiteSettings();

  const [user, setUser] = useState<UserDetails>({ name: "", phone: "", address: "" });

  const hasUserDetails = user.name.trim() && user.phone.trim();

  const whatsappHref =
    items.length > 0
      ? buildCartWhatsAppUrl(whatsapp, items, hasUserDetails ? user : undefined)
      : `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I want help choosing packaging.")}`;

  return (
    <>
      <button
        type="button"
        onClick={openCart}
        className="relative hidden items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white md:inline-flex"
        aria-label="Open quote list"
      >
        <ShoppingBag className="h-4 w-4" />
        Quote list
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-sand px-2 py-0.5 text-xs text-forest">
          {totalItems}
        </span>
      </button>

      {isCartOpen ? (
        <>
          <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm" onClick={closeCart} aria-hidden="true" />

          <aside
            className="fixed right-0 top-0 z-[80] hidden h-full w-full max-w-md flex-col border-l border-forest/10 bg-cream shadow-2xl md:flex"
            aria-label="Quote list panel"
          >
            <CartPanelContent
              items={items}
              totalItems={totalItems}
              user={user}
              setUser={setUser}
              hasUserDetails={!!hasUserDetails}
              whatsappHref={whatsappHref}
              onClose={closeCart}
              onRemove={removeItem}
              onUpdateQty={updateQuantity}
              onClear={clearCart}
            />
          </aside>

          <aside
            className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[92dvh] flex-col rounded-t-[28px] border-t border-forest/10 bg-cream shadow-[0_-20px_60px_rgba(23,59,42,0.18)] md:hidden"
            aria-label="Quote list bottom sheet"
          >
            <div className="flex justify-center pb-1 pt-3">
              <div className="h-1 w-10 rounded-full bg-forest/20" />
            </div>

            <CartPanelContent
              items={items}
              totalItems={totalItems}
              user={user}
              setUser={setUser}
              hasUserDetails={!!hasUserDetails}
              whatsappHref={whatsappHref}
              onClose={closeCart}
              onRemove={removeItem}
              onUpdateQty={updateQuantity}
              onClear={clearCart}
              isMobile
            />
          </aside>
        </>
      ) : null}
    </>
  );
}

function CartPanelContent({
  items,
  totalItems,
  user,
  setUser,
  hasUserDetails,
  whatsappHref,
  onClose,
  onRemove,
  onUpdateQty,
  onClear,
  isMobile = false,
}: {
  items: ReturnType<typeof useCart>["items"];
  totalItems: number;
  user: UserDetails;
  setUser: React.Dispatch<React.SetStateAction<UserDetails>>;
  hasUserDetails: boolean;
  whatsappHref: string;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onClear: () => void;
  isMobile?: boolean;
}) {
  const { whatsapp } = useSiteSettings();

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-forest/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/8">
            <Package className="h-4 w-4 text-forest" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bark">Your Quote List</p>
            <p className="text-base font-semibold text-forest">
              {totalItems === 0 ? "No items yet" : `${totalItems} item${totalItems === 1 ? "" : "s"} added`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-forest/15 p-2 text-forest transition hover:bg-white"
          aria-label="Close cart"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand">
              <ShoppingBag className="h-7 w-7 text-bark" />
            </div>
            <p className="mt-4 text-lg font-semibold text-forest">Your quote list is empty</p>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Add products and quantities, then send your quote request via WhatsApp. Our team will confirm pricing and details.
            </p>
            <Link
              href="/products"
              onClick={onClose}
              className="mt-5 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="space-y-3 px-5 py-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3 rounded-2xl border border-[#d8c2a3]/50 bg-white p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-forest">{item.product.name}</p>
                  <p className="mt-0.5 text-xs text-bark">{item.product.price_label || "Price on request"}</p>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-full border border-forest/15 bg-cream">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-sm font-bold text-forest"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-forest">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-sm font-bold text-forest"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.product.id)}
                      className="text-xs font-medium text-bark/70 transition hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="px-5 pb-4">
            <div className="rounded-2xl border border-forest/10 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bark">Your Details</p>
              <p className="mt-1 text-xs text-ink/55">Add contact details so our team can follow up on your quote.</p>
              <div className="mt-3 space-y-2.5">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={user.name}
                  onChange={(event) => setUser((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-xl border border-forest/10 bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-forest/25 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone number *"
                  value={user.phone}
                  onChange={(event) => setUser((prev) => ({ ...prev, phone: event.target.value }))}
                  className="w-full rounded-xl border border-forest/10 bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-forest/25 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Delivery address (optional)"
                  value={user.address}
                  onChange={(event) => setUser((prev) => ({ ...prev, address: event.target.value }))}
                  className="w-full rounded-xl border border-forest/10 bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-forest/25 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className={`shrink-0 border-t border-forest/10 bg-cream px-5 pt-4 ${isMobile ? "pb-[calc(env(safe-area-inset-bottom)+1rem)]" : "pb-4"}`}>
        {items.length > 0 ? (
          <>
            {!hasUserDetails ? (
              <p className="mb-3 rounded-xl bg-sand px-3 py-2 text-xs text-bark">
                Add your name and phone so our team can follow up on your quote.
              </p>
            ) : null}
            {isMobile ? (
              <div className="space-y-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.3)] transition hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>Request Quote on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClear}
                  className="mx-auto inline-flex min-h-11 items-center justify-center rounded-full border border-forest/15 bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-sand/40"
                  aria-label="Clear cart"
                >
                  Clear Cart
                </button>
              </div>
            ) : (
              <div className="flex gap-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.3)] transition hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Request Quote on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded-full border border-forest/15 px-4 py-3.5 text-xs font-semibold text-forest transition hover:bg-white"
                  aria-label="Clear cart"
                >
                  Clear
                </button>
              </div>
            )}
            <p className="mt-3 text-center text-[11px] text-ink/40">
              No payment needed now - our team will confirm and share pricing.
            </p>
          </>
        ) : (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I need help choosing the right packaging.")}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with us on WhatsApp
          </a>
        )}
      </div>
    </>
  );
}
