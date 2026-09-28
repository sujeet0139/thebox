"use client";

import Image from "next/image";
import Link from "next/link";

import { useSiteSettings } from "@/components/site-settings-provider";

export function SiteFooter() {
  const settings = useSiteSettings();
  const socialLinks = [
    { label: "Facebook", href: settings.facebookUrl },
    { label: "Instagram", href: settings.instagramUrl },
    { label: "LinkedIn", href: settings.linkedinUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-[#d8c2a3]/60 bg-[#f7efe4]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.45fr_1fr_1fr_1.1fr]">
        <div>
          <div className="flex items-center gap-3 text-forest">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#d8c2a3]/60 bg-white">
              <Image src="/theboxmakers-logo.svg" alt="TheBoxMakers logo" fill className="object-cover" />
            </div>
            <div>
              <p className="font-display text-3xl text-forest">TheBoxMakers</p>
              <p className="text-xs uppercase tracking-[0.32em] text-bark/75">Packaging Manufacturer</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-ink/72">
            Explore packaging options, build a quote list, and send your requirements on WhatsApp. Share dimensions, quantity, and delivery city so our team can confirm the details.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bark">Shop</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-ink/72">
            <Link href="/" className="hover:text-forest">Shop Home</Link>
            <Link href="/products" className="hover:text-forest">All Products</Link>
            <Link href="/enquiry" className="hover:text-forest">Custom Enquiry</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bark">Company</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-ink/72">
            <Link href="/about" className="hover:text-forest">About Us</Link>
            <Link href="/contact" className="hover:text-forest">Contact</Link>
            {socialLinks.length ? socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="hover:text-forest">
                {item.label}
              </a>
            )) : null}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-bark">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-ink/72">
            <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="block hover:text-forest">
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className="block hover:text-forest">
              {settings.email}
            </a>
            <p>{settings.address}</p>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi TheBoxMakers, I need packaging help.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/15 bg-white px-4 py-2 text-xs font-semibold text-[#1c8c47] hover:bg-[#25D366]/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#d8c2a3]/60 py-4 text-center text-xs text-bark/70">
        {"\u00A9"} {new Date().getFullYear()} TheBoxMakers. All rights reserved.
      </div>
    </footer>
  );
}
