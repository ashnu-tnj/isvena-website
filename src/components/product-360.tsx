"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * A silent 360° turntable of a single piece.
 *
 * Deliberately cheap: `preload="none"` plus a poster frame means the clip is
 * not fetched at all until it scrolls into view, so a product page still
 * loads as fast as a page of stills. It then plays only while on screen, and
 * pauses again on the way out.
 *
 * Under `prefers-reduced-motion` nothing autoplays — the poster stands in and
 * native controls appear, so the spin is still available to anyone who wants
 * it without motion being forced on anyone who does not.
 */
export default function Product360({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // A media query is external state, so subscribe to it rather than mirroring
  // it into an effect: this stays correct if the visitor changes the setting
  // mid-session, and the server snapshot (false) matches the first paint.
  const subscribe = useCallback((onChange: () => void) => {
    const query = window.matchMedia(REDUCED_MOTION);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (low power mode, for one); the
          // poster simply remains, which is a fine resting state.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      controls={reduced}
      aria-label={label}
      className="h-full w-full object-cover"
    >
      {/* VP9 first — about 15% smaller than the H.264 it falls back to. */}
      <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
      <source src={src} type="video/mp4" />
    </video>
  );
}
