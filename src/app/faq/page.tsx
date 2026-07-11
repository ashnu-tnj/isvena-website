import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import Reveal from "@/components/reveal";
import { faqs } from "@/data/faqs";
import { faqSchema, breadcrumbSchema } from "@/lib/structured-data";
import { ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about Isvena's hand-braided, vegetable-tanned leather goods — what chrome-free tanning means, where pieces are made, made-to-order timelines, worldwide shipping, leather care, custom orders and wholesale.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    title: "Frequently Asked Questions — Isvena",
    description:
      "Answers about Isvena's vegetable-tanned, chrome-free leather goods: materials, made-to-order timelines, worldwide shipping, care and custom orders.",
    url: "/faq",
    images: [ogImage],
  },
};

export default function FaqPage() {
  const breadcrumbs = breadcrumbSchema([{ name: "FAQ", path: "/faq" }]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbs} />

      <header className="text-center">
        <p className="reveal eyebrow text-gold">Answers</p>
        <h1
          className="reveal type-display mt-5 font-display"
          style={{ animationDelay: "0.1s" }}
        >
          Frequently Asked Questions
        </h1>
        <p
          className="reveal mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft"
          style={{ animationDelay: "0.2s" }}
        >
          Everything about our leather, how it&rsquo;s made, and how it reaches
          you. Still curious?{" "}
          <Link href="/contact" className="link-line text-ink">
            Reach the studio
          </Link>
          .
        </p>
      </header>

      <dl className="mt-16 divide-y divide-sand-line border-t hairline">
        {faqs.map((f) => (
          <Reveal key={f.q} as="div" className="py-8">
            <dt className="font-display text-lg sm:text-xl">{f.q}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-ink-soft">
              {f.a}
            </dd>
          </Reveal>
        ))}
      </dl>

      <div className="mt-16 border-t hairline pt-10 text-center">
        <p className="text-sm text-ink-soft">
          Ready to find your piece?
        </p>
        <Link href="/shop" className="btn btn-solid mt-6">
          Shop the Collection
        </Link>
      </div>
    </div>
  );
}
