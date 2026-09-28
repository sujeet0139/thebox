import type { Metadata } from "next";
import Link from "next/link";

import { EnquiryForm } from "@/components/enquiry-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbList } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Custom Box Enquiry | TheBoxMakers",
  description:
    "Request a custom packaging quote from TheBoxMakers. Tell us your box size, type, and requirements and our team will get back to you.",
};

function getStatusMessage(status?: string) {
  switch (status) {
    case "success":
      return "Thanks! Your enquiry has been saved. Our team will contact you on WhatsApp or phone shortly.";
    case "missing":
      return "Please fill in all required fields before submitting.";
    case "env":
      return "Our system is being set up. Please contact us directly on WhatsApp or call us.";
    case "error":
      return "Something went wrong. Please WhatsApp us directly at +91 8920894998.";
    default:
      return "";
  }
}

export default async function EnquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const message = getStatusMessage(status);

  return (
    <section className="container-shell py-16 sm:py-20">
      <JsonLd data={breadcrumbList([{ name: "Home", path: "/" }, { name: "Custom Enquiry", path: "/enquiry" }])} />
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-bark">Custom Enquiry</p>
        <h1 className="mt-4 text-4xl text-forest sm:text-5xl">Tell us what you need</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Share your packaging requirements and we will follow up with the best options, pricing, and lead time.
        </p>

        {message ? (
          <div className={`mt-6 rounded-2xl px-5 py-4 text-sm font-medium ${status === "success" ? "bg-moss/15 text-forest" : "bg-sand text-bark"}`}>
            {message}
            {status === "success" ? (
              <div className="mt-3">
                <Link href="/products" className="inline-flex rounded-full bg-forest px-5 py-2.5 text-xs font-semibold text-white">
                  Browse more products
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="card-surface mt-8 p-6 sm:p-8">
          <EnquiryForm />
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Prefer to talk directly?{" "}
          <a
            href="https://wa.me/918920894998?text=Hi%20TheBoxMakers%2C%20I%20have%20a%20custom%20packaging%20enquiry"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#1c8c47]"
          >
            WhatsApp us now
          </a>
        </div>
      </div>
    </section>
  );
}
