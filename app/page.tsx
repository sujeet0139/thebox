import type { Metadata } from "next";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

import { ProductInquiryGrid } from "@/lib/product-inquiry-grid";
import { ScrollToProducts } from "@/components/scroll-to-products";
import { JsonLd } from "@/components/json-ld";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom Packaging Boxes Manufacturer in India | Corrugated & Carton Boxes",
  description:
    "Explore custom corrugated boxes and packaging options from TheBoxMakers in Gurugram, India. Request pricing for your box size, quantity, printing, and delivery location.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Custom Packaging Boxes Manufacturer in India | Corrugated & Carton Boxes",
    description:
      "Explore custom corrugated boxes and packaging options from TheBoxMakers in Gurugram, India. Request pricing for your box size, quantity, printing, and delivery location.",
    url: "/",
    type: "website",
  },
};

const stats = [
  { value: "3–7 ply", label: "Corrugated options" },
  { value: "Custom", label: "Dimensions & print" },
  { value: "India", label: "Delivery enquiries" },
  { value: "Quote-led", label: "Order process" },
];

const homeFaqs = [
  {
    question: "Do you provide custom box sizes?",
    answer: "Yes, we manufacture boxes based on your required dimensions and specifications.",
  },
  {
    question: "Do you deliver across India?",
    answer: "Yes, we provide delivery services across India.",
  },
  {
    question: "What is the minimum order quantity?",
    answer: "Minimum order depends on box type, but we support both small and bulk orders.",
  },
  {
    question: "Can I get printed boxes with my logo?",
    answer: "Yes, we offer custom printing services for branding and packaging needs.",
  },
  {
    question: "What details should I include in a quote request?",
    answer: "Share the box type, internal dimensions, quantity, printing or strength requirements, and delivery city. If you are unsure, describe the product and our team can discuss suitable options.",
  },
  {
    question: "How is the box price calculated?",
    answer: "Pricing depends on dimensions, board construction, order quantity, printing or finishes, and delivery location. Request a quote for your specifications rather than relying on a generic per-unit price.",
  },
  {
    question: "Can I request a sample before placing an order?",
    answer: "Please mention that you need a sample in your enquiry. Availability, cost, and timing depend on the box design and will be confirmed by our team.",
  },
  {
    question: "How long will production and delivery take?",
    answer: "Timing depends on the box design, quantity, and delivery location. Ask our team to confirm the schedule for your specific requirement before placing an order.",
  },
  {
    question: "Can you confirm packaging suitable for food contact?",
    answer: "Tell us the food type and intended use. Our team must confirm the material and any food-contact suitability for the specific box before you order.",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const settings = await getSiteSettings();
  const socialProfiles = [settings.facebookUrl, settings.instagramUrl, settings.linkedinUrl, settings.youtubeUrl].filter(
    (url): url is string => Boolean(url),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/theboxmakers-logo.svg`,
        email: siteConfig.email,
        telephone: siteConfig.phone.replace(/\s+/g, ""),
        ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#local-business`,
        name: siteConfig.name,
        url: siteConfig.url,
        telephone: siteConfig.phone.replace(/\s+/g, ""),
        email: siteConfig.email,
        parentOrganization: { "@id": `${siteConfig.url}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Sector 102",
          addressLocality: "Gurugram",
          addressRegion: "Haryana",
          postalCode: "122505",
          addressCountry: "IN",
        },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <div className="pb-28 md:pb-20">
      <JsonLd data={structuredData} />
      <ScrollToProducts />
      <section className="relative overflow-hidden bg-forest">
        <div className="absolute inset-0 bg-eco-grid bg-[size:28px_28px] opacity-[0.07]" />
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/95 to-[#0b1f12]" />
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-moss/20 blur-[60px]" />

        <div className="container-shell relative z-10 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">
              <Package className="h-3 w-3" />
              Corrugated &amp; Custom Packaging
            </div>
            <h1 className="mt-6 text-4xl font-normal leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Custom Packaging Boxes Manufacturer in <span className="text-gold">India</span>
            </h1>
            <p className="mt-6 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Corrugated boxes and custom packaging options for businesses. Share your dimensions, quantity, print requirements, and delivery city to get a quote tailored to your order.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#products"
                className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-forest shadow-[0_20px_50px_rgba(197,154,92,0.35)] transition hover:-translate-y-0.5 hover:bg-gold/90"
              >
                Explore Products
              </a>
              <Link
                href="/enquiry"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5">
          <div className="container-shell grid grid-cols-2 md:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="border-r border-white/10 py-5 text-center last:border-r-0">
                <p className="text-2xl font-semibold text-gold sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-xs text-white/55">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-bark">Your Partner</p>
            <h2 className="mt-2 text-3xl text-forest sm:text-4xl">Packaging options for your product and dispatch needs</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70 sm:text-base">
              At The Box Makers, we specialize in manufacturing high-quality corrugated boxes, carton boxes, and custom packaging solutions for businesses of all sizes. Whether you
              run an e-commerce store, warehouse, or manufacturing unit, we provide packaging that ensures product safety and professional presentation.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70 sm:text-base">
              Our boxes are designed for durability, affordability, and customization. From small businesses to bulk industrial orders, we deliver reliable packaging solutions
              across India.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How to Order</h2>
        <p>Share your requirements and confirm the specifications before ordering.</p>

        <div className="steps">
          <div className="step">
            <h3>01 &ndash; Browse Products</h3>
            <p>Explore our packaging solutions as per your needs.</p>
          </div>

          <div className="step">
            <h3>02 &ndash; Request a Quote</h3>
            <p>Submit your requirement via enquiry form.</p>
          </div>

          <div className="step">
            <h3>03 &ndash; Get Confirmation</h3>
            <p>Our team will contact you with pricing and order details.</p>
          </div>
        </div>

        <div className="trust-points">
          <p>&#10003; Custom dimensions</p>
          <p>&#10003; 3-ply to 7-ply options</p>
          <p>&#10003; Printing options</p>
          <p>&#10003; Quotes confirmed for your requirements</p>
        </div>

        <div className="cta">
          <Link href="/enquiry" className="btn">
            Request a Quote
          </Link>
        </div>
      </section>

      <section id="products" className="relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 -z-10 bg-eco-grid bg-[size:24px_24px] opacity-25" />
        <div className="container-shell">
          <div className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-bark">Our Packaging</p>
            <h2 className="mt-2 text-3xl text-forest sm:text-4xl">Our Packaging Solutions</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70 sm:text-base">
              Explore packaging options and add products to a quote list. Share dimensions, quantity, printing, and delivery location so our team can confirm pricing and suitability.
            </p>
            <p className="mt-2 text-xs text-ink/55">Product visuals are illustrations. Final appearance depends on the confirmed specifications and finish.</p>
          </div>
          <ProductInquiryGrid products={products} whatsappNumber={settings.whatsapp || ""} />
        </div>
      </section>

      <section className="bg-[#f0ece4]/60 py-16 sm:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-bark">Trust</p>
            <h2 className="mt-3 text-3xl text-forest sm:text-4xl">Why Businesses Trust The Box Makers</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-ink/70 sm:text-base">
              Review the available box styles, then share the product details needed to confirm fit, construction, pricing, and delivery.
            </p>

            <ul className="mx-auto mt-8 grid max-w-4xl gap-3 text-left text-sm leading-7 text-ink/75 sm:grid-cols-2 sm:text-base">
              <li>&#10003; Corrugated board from 3-ply to 7-ply options</li>
              <li>&#10003; Custom sizes and designs available</li>
              <li>&#10003; Printing options for selected box types</li>
              <li>&#10003; Quote based on your dimensions and quantity</li>
              <li>&#10003; Delivery details confirmed for your location</li>
              <li>&#10003; Custom die-cut and mailer options</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-bark">Industries</p>
            <h2 className="mt-2 text-3xl text-forest sm:text-4xl">Industries We Serve</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70 sm:text-base">We provide packaging solutions for a wide range of industries:</p>
            <ul className="mx-auto mt-6 grid max-w-3xl gap-3 text-left text-sm leading-7 text-ink/75 sm:grid-cols-2 sm:text-base">
              <li>E-commerce businesses</li>
              <li>Retail and wholesalers</li>
              <li>Manufacturing industries</li>
              <li>Food and FMCG packaging</li>
              <li>Electronics and fragile item shipping</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="faq bg-[#f6f1e8]/55 py-14 sm:py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.38em] text-bark">FAQ</p>
            <h2 className="mt-2 text-center text-3xl text-forest sm:text-4xl">Frequently Asked Questions</h2>

            <div className="mx-auto mt-10 grid gap-4">
              {homeFaqs.map((faq) => (
                <details key={faq.question} className="card-surface group p-6">
                  <summary className="cursor-pointer list-none text-base font-semibold text-forest">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-ink/70 sm:text-base">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-shell">
          <div className="highlights">
            <div className="highlight">
              <h3>Hassle-Free Ordering</h3>
              <p>Quick and simple ordering process designed for a smooth and efficient customer experience.</p>
            </div>

            <div className="highlight">
              <h3>Transparent &amp; Flexible Pricing</h3>
              <p>Get clear pricing and confirm your order with flexible payment options tailored to your business needs.</p>
            </div>

            <div className="highlight">
              <h3>Dedicated Customer Support</h3>
              <p>Connect with our team for quick assistance, customization support, and real-time order updates.</p>
            </div>
          </div>

          <p className="trust-line">Request confirmation of material, box specifications, pricing, and delivery schedule for your order.</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-shell">
          <div className="quote-cta relative overflow-hidden rounded-[32px] bg-forest px-8 py-12 sm:px-14 sm:py-16">
            <div className="absolute inset-0 bg-eco-grid bg-[size:24px_24px] opacity-[0.07]" />
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/12 blur-[60px]" />
            <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold/80">Get a Quote Now</p>
                <h2 className="mt-3 text-3xl text-white sm:text-4xl">Tell us your requirement</h2>
                <p className="mt-3 text-sm leading-7 text-white/60">Our team will assist you with the best pricing and solution.</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link
                  href="/enquiry"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-forest shadow-[0_20px_50px_rgba(197,154,92,0.3)] transition hover:-translate-y-0.5"
                >
                  Request a Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
