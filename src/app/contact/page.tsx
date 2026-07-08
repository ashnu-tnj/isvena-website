import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import JsonLd from "@/components/json-ld";
import { localBusinessSchema } from "@/lib/structured-data";
import { ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Trade Enquiries",
  description:
    "Reach the Isvena studio in Periyamet, Chennai for orders, made-to-order timelines, trade and wholesale enquiries, and press.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact & Trade Enquiries — Isvena",
    description:
      "Reach the Isvena studio in Periyamet, Chennai for orders, trade and wholesale enquiries, and press.",
    url: "/contact",
    images: [ogImage],
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
      <JsonLd data={localBusinessSchema()} />
      <div className="text-center">
        <p className="reveal eyebrow text-gold">Get in Touch</p>
        <h1 className="reveal type-display mt-5 font-display italic" style={{ animationDelay: "0.1s" }}>
          Contact Isvena
        </h1>
        <p
          className="reveal mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft"
          style={{ animationDelay: "0.2s" }}
        >
          For orders, made-to-order timelines, trade and wholesale enquiries, reach our
          studio directly. We typically respond within two business days.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-10 border-t hairline pt-10 text-sm lg:border-l lg:border-t-0 lg:pt-0 lg:pl-12">
          <div>
            <p className="eyebrow text-gold">Studio</p>
            <p className="mt-2 text-ink-soft">
              Isvena — P.M. Rahamathulla &amp; Co
              <br />
              No: 16/14, M.V. Badran Street
              <br />
              Periyamet, Chennai 600 003
              <br />
              Tamil Nadu, India
            </p>
            <p className="mt-2 text-xs text-ink-soft">
              GST: 33ATYPS6349H1ZV · Open Monday–Sunday
            </p>
          </div>
          <div>
            <p className="eyebrow text-gold">Email</p>
            <p className="mt-2 text-ink-soft">hello@isvena.com</p>
          </div>
          <div>
            <p className="eyebrow text-gold">Trade &amp; Wholesale</p>
            <p className="mt-2 text-ink-soft">
              Isvena continues the export relationships built by P.M. Rahamathulla &amp; Co
              since 2016. For bulk or private-label enquiries, please select &ldquo;Trade /
              Wholesale&rdquo; above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
