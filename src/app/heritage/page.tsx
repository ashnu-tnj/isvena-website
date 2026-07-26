import type { Metadata } from "next";
import Image from "next/image";
import PlaceholderArt from "@/components/placeholder-art";
import { ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Heritage — A Family in Leather Since 1936",
  description:
    "Isvena's story begins in 1936 with founder P.M. Rahmathulla, apprentice leather trader in British Colombo — through PMR & Co's vegetable-tanned exports to the UK and Italy, to today's Chennai workshop.",
  alternates: { canonical: "/heritage" },
  openGraph: {
    type: "article",
    title: "Our Heritage — A Family in Leather Since 1936",
    description:
      "From an apprenticeship in British Colombo in 1936 to a Chennai workshop shipping worldwide — one family, four generations, one material.",
    url: "/heritage",
    images: [ogImage],
  },
};

const milestones = [
  {
    year: "1936",
    title: "The Apprentice",
    body: "Founder P.M. Rahmathulla begins his career as a leather trader, apprenticing under his father P. Mohamed Ismail — a renowned supplier of leather to book binders in British Colombo.",
  },
  {
    year: "1944",
    title: "The Tannery",
    body: "After eight years in the trade, Rahmathulla commences his own tanning operation, working the hides himself.",
  },
  {
    year: "1950",
    title: "PMR & Co",
    body: "PMR & Co is established. The tannery works mainly in cow hides, producing farm-related goods sold to local farmers.",
  },
  {
    year: "1966",
    title: "The Export Era",
    body: "The family registers its trademark brand to export vegetable-tanned cow hides. Rahmathulla pioneers a unique process for cow calf skins — an instant success in the United Kingdom and Italy.",
  },
  {
    year: "1990",
    title: "End of an Era",
    body: "India bans the export of vegetable-tanned leather, closing the chapter on the veg-tan trade that had defined the house for a generation.",
  },
  {
    year: "2000",
    title: "Back to the Trade",
    body: "The family returns to the leather trade in Chennai as a wholesale trader, exporter and importer — waist bags, baskets, woven totes and straw bags moving through the city's Periyamet leather quarter.",
  },
  {
    year: "2016",
    title: "A New Workshop",
    body: "The family name returns to leather: P.M. Rahamathulla & Co is founded in Periyamet, Chennai — this time as a manufacturer and exporter of finished goods, from hand-braided totes to woven baskets.",
  },
  {
    year: "Today",
    title: "Isvena",
    body: "Nearly ninety years after that first apprenticeship, Isvena carries the family's craft directly to a global wardrobe.",
  },
];

const steps = [
  {
    n: "01",
    title: "Sourcing",
    body: "We work with tanneries that specialize in vegetable-tanned, chrome-free hides — the same method that made our family's name 90 years ago. This leather is safer for skin, fully biodegradable, and develops a rich patina with age.",
  },
  {
    n: "02",
    title: "Cutting",
    body: "Every hide is inspected and hand-cut into strips as narrow as 4mm, sized to the pattern of the piece it will become.",
  },
  {
    n: "03",
    title: "Braiding",
    body: "Our senior artisans, many trained in the workshop for over a decade, interlace each strip by hand — a single tote can take upward of a full day to weave.",
  },
  {
    n: "04",
    title: "Finishing",
    body: "Edges are burnished, hardware is set in solid brass, and every piece is inspected by hand before it leaves the Chennai workshop.",
  },
];

export default function HeritagePage() {
  return (
    <div>
      <section className="relative h-[68vh] min-h-[460px] w-full overflow-hidden">
        <PlaceholderArt
          tone="ink"
          pattern="weave"
          className="ken-burns absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/25 to-ink/55" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
          <p className="reveal eyebrow text-cream/80" style={{ animationDelay: "0.1s" }}>
            Our Heritage
          </p>
          <h1
            className="reveal type-hero mt-6 max-w-2xl font-display italic"
            style={{ animationDelay: "0.25s" }}
          >
            In leather since 1936.
          </h1>
          <p
            className="reveal mt-6 max-w-md text-sm leading-relaxed text-cream/85"
            style={{ animationDelay: "0.4s" }}
          >
            From an apprenticeship in British Colombo to a Chennai workshop shipping
            worldwide — one family, four generations, one material.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
        <div className="mb-16 text-center">
          <p className="eyebrow text-gold">The Legacy</p>
          <h2 className="mt-3 type-display font-display italic">
            Ninety years, one material
          </h2>
        </div>
        <ol className="relative space-y-14 border-l hairline pl-8 sm:pl-12">
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span
                className="absolute -left-[2.05rem] top-2 h-2 w-2 rounded-full bg-cognac sm:-left-[3.05rem]"
                aria-hidden="true"
              />
              <p className="font-display text-2xl italic text-cognac">{m.year}</p>
              <h3 className="mt-1 font-display text-lg">{m.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{m.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 border-t hairline px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="eyebrow text-gold">The Modern Chapter</p>
          <h2 className="mt-4 type-display font-display italic">
            From export orders to a name of our own
          </h2>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-ink-soft">
          <p>
            The current workshop, P.M. Rahamathulla &amp; Co, was founded in 2016 in Chennai,
            Tamil Nadu — returning the family to the material it has worked since 1936. For
            years, it has produced hand-braided totes, woven leather baskets, slings
            and clutches for buyers around the world, refining a weaving technique few
            workshops still practice at this scale.
          </p>
          <p>
            Isvena is the next chapter of that same workshop: the same artisans, the same
            hides, the same braid — now built as a direct-to-you house rather than a name on
            a private label. Every piece we sell today is made in the same hands that have
            been perfecting this craft since our first year in business.
          </p>
          <p>
            We remain a small operation by design. Growth, for us, means training more
            artisans in the braid, not shortcuts in the leather.
          </p>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="mb-14 text-center">
            <p className="eyebrow text-gold">How a Piece is Made</p>
            <h2 className="mt-3 type-display font-display italic">
              From hide to hand-braid
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="border-t hairline pt-5">
                <span className="font-display text-sm italic text-cognac">{s.n}</span>
                <h3 className="mt-2 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t hairline bg-sand-50 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <p className="eyebrow text-gold">Why Vegetable-Tanned Leather</p>
            <h2 className="mt-3 type-display font-display italic">
              Chrome-free, safe, and built to last centuries
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-lg">Safe for Your Skin</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Vegetable-tanned leather is chrome-free and non-toxic. Unlike chrome-tanned leather, which uses heavy metals and can cause allergic reactions, our leather is safe to wear directly against your skin every day, without concerns.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg">Fully Biodegradable</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Our leather breaks down naturally at the end of its life, returning to the earth. Chrome-tanned leather can take decades to decompose. Vegetable-tanning uses plant extracts — a process as old as leather itself.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg">Develops Character</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Vegetable-tanned leather ages beautifully, developing a rich patina and deepening in color with time and use. Your Isvena piece becomes uniquely yours, improving with every year you carry it.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg">Built to Last Centuries</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Vegetable-tanned leather from well-maintained pieces can last 100 years or more. This is the leather that bound medieval manuscripts and still survives in museums today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process imagery — a third panel ("Hand-Finishing") joins once that
          photograph exists; two read as a deliberate pair until then. */}
      <section className="grid gap-1 sm:grid-cols-2">
        <figure className="relative aspect-[4/5] overflow-hidden sm:aspect-square">
          <Image
            src="/products/process-cutting.jpg"
            alt="An artisan's hands cutting a vegetable-tanned hide into narrow strips against a steel rule"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-[0.62rem] uppercase tracking-widest-plus text-cream">
            Cutting the Hide
          </figcaption>
        </figure>
        <figure className="relative aspect-[4/5] overflow-hidden sm:aspect-square">
          <Image
            src="/products/process-braiding.jpg"
            alt="An artisan's hands interlacing tan leather strips into the workshop's hand-braided weave"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-[0.62rem] uppercase tracking-widest-plus text-cream">
            The Braid
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="font-display text-2xl italic leading-relaxed sm:text-3xl">
          &ldquo;A machine can stitch a bag. It cannot braid one. That difference is the
          entire business.&rdquo;
        </p>
        <p className="mt-6 eyebrow text-gold">P.M. Rahamathulla &amp; Co. — In leather since 1936</p>
      </section>
    </div>
  );
}
