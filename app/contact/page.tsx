import type { Metadata } from "next";

import { submitInquiryAction } from "@/app/actions";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site";
import { breadcrumbList } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact | TheBoxMakers",
  description:
    "Contact TheBoxMakers for corrugated boxes, custom packaging boxes, and eco friendly packaging material. Request a quote or speak with our team.",
};

function getStatusMessage(status?: string) {
  switch (status) {
    case "success":
      return "Thanks, your inquiry has been saved and our team will contact you shortly.";
    case "missing":
      return "Please fill in all fields before sending your inquiry.";
    case "env":
      return "Supabase is not configured yet. Add the environment variables to start storing inquiries.";
    case "error":
      return "We could not save your inquiry right now. Please call or WhatsApp us directly.";
    default:
      return "";
  }
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const message = getStatusMessage(status);
  const mapEmbedUrl =
    process.env.GOOGLE_MAPS_EMBED_URL ||
    "https://maps.google.com/maps?q=28.4737023,76.9619544&z=15&output=embed";

  return (
    <section className="container-shell py-20">
      <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-bark">Contact</p>
      <h1 className="mt-4 text-6xl text-forest">Talk to our packaging team</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="card-surface p-8">
            <h2 className="text-4xl text-forest">Direct Contact</h2>
            <div className="mt-5 space-y-3 text-base text-slate-600">
              <a className="block" href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>{siteConfig.phone}</a>
              <a className="block" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <p>{siteConfig.address}</p>
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-forest/15 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-sand/50"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
          <div className="card-surface overflow-hidden">
            <iframe title="TheBoxMakers location map" src={mapEmbedUrl} className="h-[360px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
        <div className="card-surface p-8">
          <h2 className="text-4xl text-forest">Request a Quote</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Share your carton size, quantity, print requirement, or packaging challenge and we will follow up with the best recommendation.
          </p>
          {message ? <p className="mt-5 rounded-2xl bg-sand px-4 py-3 text-sm text-forest">{message}</p> : null}
          <form action={submitInquiryAction} className="mt-8 space-y-4">
            <input name="name" required placeholder="Your name" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <input name="phone" required placeholder="Phone number" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <textarea name="message" required rows={6} placeholder="Tell us what kind of custom packaging boxes or corrugated boxes you need" className="w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3" />
            <button className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
}
