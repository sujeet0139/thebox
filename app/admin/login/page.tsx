import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Package, BarChart3, MessageSquare, Settings } from "lucide-react";

import { loginAdminAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Login | TheBoxMakers",
  robots: {
    index: false,
    follow: false,
  },
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "credentials":
      return "Invalid email or password.";
    case "access":
      return "This account is not in the allowed admin email list.";
    case "env":
      return "Supabase environment variables are missing.";
    default:
      return "";
  }
}

const adminFeatures = [
  { icon: Package, label: "Manage product catalog & images" },
  { icon: BarChart3, label: "View enquiries and contact leads" },
  { icon: MessageSquare, label: "Reply via WhatsApp in one click" },
  { icon: Settings, label: "Update pricing and product details" },
];

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const message = getErrorMessage(error);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* ── Left branding panel ── */}
      <div className="relative hidden overflow-hidden bg-forest lg:flex lg:w-[46%] lg:flex-col lg:items-center lg:justify-center lg:p-14">
        <div className="absolute inset-0 bg-eco-grid bg-[size:28px_28px] opacity-[0.07]" />
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-gold/12 blur-[80px]" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-moss/18 blur-[60px]" />

        <div className="relative z-10 w-full max-w-sm text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <Image
              src="/theboxmakers-logo.svg"
              alt="TheBoxMakers"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <h1 className="mt-6 text-4xl text-white">TheBoxMakers</h1>
          <p className="mt-1.5 text-xs uppercase tracking-[0.38em] text-gold/75">Admin Portal</p>
          <p className="mt-5 text-sm leading-7 text-white/55">
            Full control of your packaging catalog, customer enquiries, and WhatsApp lead management.
          </p>

          <div className="mt-10 space-y-3 text-left">
            {adminFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/75">
                <Icon className="h-4 w-4 shrink-0 text-gold" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs text-white/35">
              &copy; {new Date().getFullYear()} TheBoxMakers. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center bg-cream px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#d8c2a3]/60 bg-white shadow-soft">
              <Image src="/theboxmakers-logo.svg" alt="TheBoxMakers logo" fill className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-forest">TheBoxMakers</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-bark/70">Admin Portal</p>
            </div>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-bark">Admin Access</p>
          <h2 className="mt-3 text-4xl text-forest">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-ink/55">
            Enter your admin credentials to access the dashboard.
          </p>

          {message ? (
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-sand px-4 py-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bark" />
              <p className="text-sm text-forest">{message}</p>
            </div>
          ) : null}

          <form action={loginAdminAction} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-bark">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@theboxmakers.in"
                className="w-full rounded-2xl border border-forest/10 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/35 transition focus:border-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-bark">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-forest/10 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink/35 transition focus:border-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/10"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(23,59,42,0.22)] transition hover:-translate-y-0.5 hover:bg-forest/90"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-ink/35">
            Access restricted to authorized admin personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
