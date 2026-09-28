import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on /admin AND every sub-route under /admin
  matcher: ["/admin", "/admin/:path*"],
};
