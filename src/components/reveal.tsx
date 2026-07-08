import type { ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /**
   * Accepted for API compatibility. Scroll-driven CSS reveals are paced by
   * the element's own entry into the viewport, so a fixed delay no longer
   * applies; the prop is intentionally ignored.
   */
  delay?: number;
}

/**
 * Soft upward fade as the element scrolls into view.
 *
 * Implemented with pure CSS scroll-driven animations (`animation-timeline:
 * view()`), gated behind `@supports` in globals.css. Browsers without
 * support simply render the content fully visible, so nothing is ever
 * hidden from crawlers, no-JS visitors, or older engines — the motion is
 * pure progressive enhancement with no client JavaScript.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  return <Tag className={`reveal-view ${className}`}>{children}</Tag>;
}
