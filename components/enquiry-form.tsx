"use client";

import { useState, useRef } from "react";
import { submitCustomEnquiryAction } from "@/app/actions";

const boxTypes = [
  "Standard Corrugated Box",
  "Custom Printed Mailer Box",
  "Heavy-Duty Shipping Box",
  "Luxury Gift Box",
  "Food & Takeaway Packaging Box",
  "Custom Die-Cut Box",
  "Other / Not Sure",
];

function validatePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Mobile number is required.";
  if (digits.length !== 10) return "Enter a valid 10-digit mobile number.";
  if (!/^[6-9]/.test(digits)) return "Mobile number must start with 6, 7, 8, or 9.";
  return "";
}

export function EnquiryForm() {
  const [phoneError, setPhoneError] = useState("");
  const [phone, setPhone] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (phoneError) setPhoneError(validatePhone(val));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validatePhone(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError("");

    const data = new FormData(e.currentTarget);
    // ensure cleaned phone value
    data.set("phone", phone);
    const quantity = String(data.get("quantity") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (quantity) data.set("message", [`Quantity: ${quantity}`, message].filter(Boolean).join("\n\n"));
    await submitCustomEnquiryAction(data);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">
          Your Name *
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="e.g. Rahul Sharma"
          className="mt-2 w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm focus:border-forest focus:outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">
          Mobile Number *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          maxLength={10}
          value={phone}
          onChange={handlePhoneChange}
          onBlur={() => setPhoneError(validatePhone(phone))}
          placeholder="e.g. 9876543210"
          className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none ${
            phoneError
              ? "border-red-400 bg-red-50 focus:border-red-400"
              : "border-forest/10 bg-cream focus:border-forest"
          }`}
        />
        {phoneError ? (
          <p className="mt-1.5 text-xs font-medium text-red-500">{phoneError}</p>
        ) : (
          <p className="mt-1 text-[11px] text-ink/40">10-digit Indian mobile number</p>
        )}
      </div>

      {/* Box type */}
      <div>
        <label htmlFor="box_type" className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">
          Box Type *
        </label>
        <select
          id="box_type"
          name="box_type"
          required
          defaultValue=""
          className="mt-2 w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm focus:border-forest focus:outline-none"
        >
          <option value="" disabled>Select box type</option>
          {boxTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Box size */}
      <div>
        <label htmlFor="box_size" className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">
          Box Size / Dimensions
        </label>
        <input
          id="box_size"
          name="box_size"
          placeholder="e.g. 30cm x 20cm x 15cm or Small / Medium / Large"
          className="mt-2 w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm focus:border-forest focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="quantity" className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">
          Quantity Required
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          placeholder="e.g. 500"
          className="mt-2 w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm focus:border-forest focus:outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.28em] text-bark">
          Additional Requirements
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Printing or logo, strength, intended use, delivery city, or anything else we should know..."
          className="mt-2 w-full rounded-2xl border border-forest/10 bg-cream px-4 py-3 text-sm focus:border-forest focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-forest/90"
      >
        Request a Quote
      </button>
    </form>
  );
}
