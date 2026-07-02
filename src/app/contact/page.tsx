import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Isvena studio for orders, trade enquiries, and press.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
      <div className="text-center">
        <p className="eyebrow text-umber">Get in Touch</p>
        <h1 className="mt-4 font-display text-4xl italic sm:text-5xl">Contact Isvena</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          For orders, made-to-order timelines, trade and wholesale enquiries, reach our
          studio directly. We typically respond within two business days.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-10 border-t hairline pt-10 text-sm lg:border-l lg:border-t-0 lg:pt-0 lg:pl-12">
          <div>
            <p className="eyebrow text-umber">Studio</p>
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
            <p className="eyebrow text-umber">Email</p>
            <p className="mt-2 text-ink-soft">hello@isvena.com</p>
          </div>
          <div>
            <p className="eyebrow text-umber">Trade &amp; Wholesale</p>
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
