import { NextRequest } from "next/server";

/**
 * Reports the visitor's country so the client can show approximate local
 * prices. `NextRequest.geo` was removed in Next 15 — on Vercel the value
 * arrives as a header set at the edge.
 *
 * Kept as a tiny endpoint rather than baked into the page so product pages
 * stay statically generated and cacheable; the client asks once per session.
 */
export function GET(request: NextRequest) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    // Useful when running behind another proxy, or locally with an override.
    request.headers.get("cf-ipcountry") ??
    null;

  return Response.json(
    { country },
    // Per-visitor and cheap to recompute; never store it in a shared cache.
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
