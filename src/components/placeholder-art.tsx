type Tone = "cognac" | "umber" | "sand" | "ink" | "olive" | "cream";

const TONES: Record<Tone, { base: string; weave: string; text: string }> = {
  cognac: { base: "#a25a34", weave: "#8a4a29", text: "#f7ede2" },
  umber: { base: "#4a3222", weave: "#3b271a", text: "#e9dcc9" },
  sand: { base: "#d9c9ae", weave: "#c9b492", text: "#3a332b" },
  ink: { base: "#26201a", weave: "#1a150f", text: "#e4d8c2" },
  olive: { base: "#6f6a4e", weave: "#5c5840", text: "#f1ead9" },
  cream: { base: "#efe6d6", weave: "#e2d5ba", text: "#3a332b" },
};

interface PlaceholderArtProps {
  tone?: Tone;
  label?: string;
  caption?: string;
  pattern?: "weave" | "grain" | "plain";
  className?: string;
}

/**
 * Art-directed stand-in for product photography. The palette and woven
 * motif echo Isvena's hand-braided leatherwork so panels read as
 * intentional brand imagery rather than missing images.
 */
export default function PlaceholderArt({
  tone = "cognac",
  label,
  caption,
  pattern = "weave",
  className = "",
}: PlaceholderArtProps) {
  const { base, weave, text } = TONES[tone];
  const id = `${tone}-${pattern}-${label ?? "art"}`.replace(/\s+/g, "-");

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ backgroundColor: base }}
    >
      {pattern !== "plain" && (
        <svg className="absolute inset-0 h-full w-full opacity-90" preserveAspectRatio="none">
          <defs>
            <pattern
              id={id}
              width="34"
              height="34"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              {pattern === "weave" ? (
                <>
                  <rect width="34" height="34" fill={base} />
                  <rect width="34" height="14" fill={weave} opacity="0.55" />
                  <rect y="20" width="34" height="14" fill={weave} opacity="0.35" />
                </>
              ) : (
                <>
                  <rect width="34" height="34" fill={base} />
                  <circle cx="6" cy="6" r="1" fill={weave} opacity="0.4" />
                  <circle cx="20" cy="16" r="0.8" fill={weave} opacity="0.3" />
                </>
              )}
            </pattern>
            <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </svg>
      )}

      {(label || caption) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          {label && (
            <span
              className="font-display text-xl italic tracking-wide sm:text-2xl"
              style={{ color: text }}
            >
              {label}
            </span>
          )}
          {caption && (
            <span
              className="text-[0.65rem] tracking-widest-plus uppercase"
              style={{ color: text, opacity: 0.75 }}
            >
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
