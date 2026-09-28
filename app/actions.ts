"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getSupabaseEnv } from "@/lib/supabase/env";

function getPublicSupabaseServerClient() {
  const env = getSupabaseEnv();

  if (!env) {
    return null;
  }

  return createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function submitInquiryAction(formData: FormData) {
  const supabase = getPublicSupabaseServerClient();

  const payload = {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    message: String(formData.get("message") || "").trim(),
  };

  if (!payload.name || !payload.phone || !payload.message) {
    redirect("/contact?status=missing");
  }

  if (!supabase) {
    redirect("/contact?status=env");
  }

  const { error } = await supabase.from("inquiries").insert(payload);

  if (error) {
    redirect("/contact?status=error");
  }

  redirect("/contact?status=success");
}

export async function submitCustomEnquiryAction(formData: FormData) {
  const supabase = getPublicSupabaseServerClient();

  const payload = {
    name: String(formData.get("name") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    box_type: String(formData.get("box_type") || "").trim(),
    box_size: String(formData.get("box_size") || "").trim(),
    message: String(formData.get("message") || "").trim(),
  };

  if (!payload.name || !payload.phone || !payload.box_type) {
    redirect("/enquiry?status=missing");
  }

  if (!supabase) {
    redirect("/enquiry?status=env");
  }

  const { error } = await supabase.from("enquiries").insert(payload);

  if (error) {
    redirect("/enquiry?status=error");
  }

  redirect("/enquiry?status=success");
}