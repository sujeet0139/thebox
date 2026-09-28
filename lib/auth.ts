import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmails } from "@/lib/supabase/env";

export async function requireAdmin() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login?error=env");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const allowedEmails = getAdminEmails();

  if (allowedEmails.length && !allowedEmails.includes(user.email?.toLowerCase() || "")) {
    redirect("/admin/login?error=access");
  }

  return { supabase, user };
}

