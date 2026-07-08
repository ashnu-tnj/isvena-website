import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt =
  "Isvena — hand-braided, vegetable-tanned leather goods since 1936";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Self-contained: no external fonts or assets so the image renders reliably
// at build/edge time regardless of network conditions.
export default function OpengraphImage() {
  const eyebrow = `Since ${site.foundingYear} · Chennai, India`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #2a211a 0%, #201b16 55%, #3a2718 100%)",
          color: "#fbf9f5",
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 38,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#b8935a",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 150,
            fontStyle: "italic",
            marginTop: 24,
            lineHeight: 1,
          }}
        >
          Isvena
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 28,
            maxWidth: 860,
            textAlign: "center",
            color: "#e9dcc9",
            lineHeight: 1.3,
          }}
        >
          Hand-braided, vegetable-tanned leather, woven by hand.
        </div>
        <div
          style={{
            marginTop: 44,
            width: 120,
            height: 3,
            background: "#b8935a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
