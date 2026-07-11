import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt =
  "Isvena — hand-braided, vegetable-tanned leather goods since 1936";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Self-contained: the real Isvena wordmark is embedded as a data URI so the
// share card is pixel-exact to the brand, with no network fetch at render.
export default async function OpengraphImage() {
  const eyebrow = `Since ${site.foundingYear} · Chennai, India`;
  const wordmark = await readFile(
    join(process.cwd(), "public/brand/isvena-wordmark-cream.png")
  );
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`;

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
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#b8935a",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {eyebrow}
        </div>
        <img
          src={wordmarkSrc}
          alt=""
          width={720}
          height={127}
          style={{ marginTop: 52 }}
        />
        <div
          style={{
            fontSize: 38,
            marginTop: 56,
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
