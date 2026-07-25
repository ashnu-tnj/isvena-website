"use client";

import { useEffect, useRef } from "react";

interface AutoVideoProps {
  /**
   * Path to the MP4 under /public. A sibling `.webm` is offered first when
   * present — VP9 is smaller and covers browsers built without the
   * proprietary H.264 decoder, while the MP4 keeps Safari/iOS working.
   */
  src: string;
  /** Poster frame shown before playback and as the reduced-motion fallback. */
  poster: string;
  /** Accessible description of the footage. */
  label: string;
  className?: string;
}

/**
 * Silent, looping product film.
 *
 * Plays only while it is on screen (an IntersectionObserver pauses it
 * otherwise, so several clips on one page never decode at once), and never
 * autoplays for visitors who prefer reduced motion — they simply keep the
 * poster frame. With JavaScript unavailable the poster also stands in, so
 * nothing is ever a blank rectangle.
 */
export default function AutoVideo({
  src,
  poster,
  label,
  className = "",
}: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const stopObserving = () => {
      observer?.disconnect();
      observer = undefined;
    };

    const sync = () => {
      if (motionQuery.matches) {
        stopObserving();
        video.pause();
        video.currentTime = 0;
        return;
      }
      if (observer || typeof IntersectionObserver === "undefined") {
        // No observer support: just play.
        if (!observer) video.play().catch(() => {});
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(video);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      stopObserving();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    >
      <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
      <source src={src} type="video/mp4" />
    </video>
  );
}
