import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { breadcrumbList } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About | TheBoxMakers",
  description:
    "Learn about TheBoxMakers, our carton packaging capabilities, eco-conscious manufacturing approach, and vision for Indian packaging brands.",
};

const capabilities = [
  "Custom box sizing and sampling",
  "Kraft and duplex board combinations",
  "Printed mailers and transit cartons",
  "Bulk production for repeat dispatch cycles",
];

export default function AboutPage() {
  return (
    <section className="container-shell py-20">
      <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])} />
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-bark">About Us</p>
      <h1 className="mt-4 max-w-4xl text-6xl text-forest">A modern packaging company focused on durable and responsible carton solutions</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="card-surface p-8 lg:col-span-2">
          <h2 className="text-4xl text-forest">Company Introduction</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            TheBoxMakers serves growing businesses that need reliable corrugated box supply, thoughtful custom packaging development, and a partner who understands logistics realities. We work with e-commerce sellers, manufacturers, and exporters to create packaging that protects products and presents brands professionally.
          </p>
        </div>
        <div className="card-surface p-8">
          <h2 className="text-4xl text-forest">Capabilities</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            {capabilities.map((capability) => (
              <li key={capability} className="flex gap-3">
                <span className="text-forest">•</span>
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="card-surface p-8">
          <h2 className="text-4xl text-forest">Vision</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            To become the preferred carton packaging manufacturer in India for brands that want stronger operations and lower material waste.
          </p>
        </div>
        <div className="card-surface p-8">
          <h2 className="text-4xl text-forest">Mission</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            To deliver dependable, eco-friendly packaging solutions with responsive service, sensible engineering, and scalable manufacturing support.
          </p>
        </div>
      </div>
    </section>
  );
}
