/**
 * Renders a JSON-LD structured-data block. Server component — the schema
 * ships in the initial HTML so crawlers and generative engines read it
 * without executing JavaScript.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, build-time content (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
