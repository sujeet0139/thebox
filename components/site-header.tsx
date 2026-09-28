"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Menu, X, Youtube } from "lucide-react";

import { CartSheet } from "@/components/cart-sheet";
import { useSiteSettings } from "@/components/site-settings-provider";

const navItems = [
  { href: "/", label: "Shop" },
  { href: "/products", label: "All Products" },
  { href: "/enquiry", label: "Custom Enquiry" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socialIcons = [
  { key: "facebookUrl", label: "Facebook", icon: Facebook },
  { key: "instagramUrl", label: "Instagram", icon: Instagram },
  { key: "linkedinUrl", label: "LinkedIn", icon: Linkedin },
  { key: "youtubeUrl", label: "YouTube", icon: Youtube },
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSiteSettings();
  const phoneHref = `tel:${settings.phone.replace(/\s+/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I need packaging help")}`;
  const socialLinks = socialIcons
    .map((item) => ({ ...item, href: settings[item.key] || "" }))
    .filter((item) => item.href);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8c2a3]/60 bg-cream/90 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3 text-forest">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#d8c2a3]/60 bg-white shadow-[0_10px_24px_rgba(23,59,42,0.08)]">
            <Image src="/theboxmakers-logo.svg" alt="TheBoxMakers logo" fill className="object-cover" priority />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[0.03em]">TheBoxMakers</p>
            <p className="text-xs uppercase tracking-[0.35em] text-bark/75">Packaging Manufacturer</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-ink/75 transition hover:text-forest">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartSheet />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[#d8c2a3]/70 bg-white/70 p-2.5 text-forest transition hover:bg-sand md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-[#d8c2a3]/60 bg-cream/95 px-4 pb-5 pt-3 md:hidden">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-forest transition hover:bg-white/80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={phoneHref} className="flex-1 rounded-full bg-forest px-4 py-3 text-center text-sm font-semibold text-white">
              Call Now
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full border border-[#25D366]/20 bg-white px-4 py-3 text-center text-sm font-semibold text-[#1c8c47]"
            >
              WhatsApp
            </a>
          </div>
          {socialLinks.length ? (
            <div className="mt-4 flex items-center gap-3 px-2 text-forest">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="rounded-full border border-forest/10 bg-white p-2.5">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
