import { NextRequest } from "next/server";

/**
 * Reports the visitor's country so the client can show approximate local
 * prices. `NextRequest.geo` was removed in Next 15 — on Vercel the value
 * arrives as a header set at the edge.
 *
 * Kept as a tiny endpoint rather than baked into the page so product pages
 * stay statically generated and cacheable; the client asks once per session.
 */
/**
 * Headers that may carry a two-letter country code, in order of preference.
 * `x-geo-country` is the one to set yourself when self-hosting behind nginx
 * (see SETUP.md); the others come from Vercel and Cloudflare.
 */
const COUNTRY_HEADERS = [
  "x-geo-country",
  "x-vercel-ip-country",
  "cf-ipcountry",
] as const;

export function GET(request: NextRequest) {
  let country: string | null = null;
  for (const header of COUNTRY_HEADERS) {
    const value = request.headers.get(header)?.trim();
    // Proxies commonly emit "XX" or an empty value when the lookup misses.
    if (value && value.length === 2 && value !== "XX") {
      country = value.toUpperCase();
      break;
    }
  }

  return Response.json(
    { country },
    // Per-visitor and cheap to recompute; never store it in a shared cache.
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
