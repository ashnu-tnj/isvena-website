import type { Metadata } from "next";
import PlaceholderArt from "@/components/placeholder-art";

export const metadata: Metadata = {
  title: "Our Heritage",
  description:
    "Isvena traces its roots to P.M. Rahamathulla & Co, a leather workshop in Ambur, Tamil Nadu, manufacturing and exporting hand-braided leather goods since 2016.",
};

const steps = [
  {
    n: "01",
    title: "Sourcing",
    body: "We work with a small number of tanneries that vegetable-tan and full-grain finish hides to our specification, selecting only leather with enough temper to hold a tight braid.",
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
    body: "Edges are burnished, hardware is set in solid brass, and every piece is inspected by hand before it leaves Ambur.",
  },
];

export default function HeritagePage() {
  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <PlaceholderArt tone="ink" pattern="weave" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
          <p className="eyebrow text-cream/80">Our Heritage</p>
          <h1 className="mt-5 max-w-xl font-display text-4xl italic leading-tight sm:text-5xl">
            A workshop in Ambur, since 2016.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="eyebrow text-umber">The Beginning</p>
          <h2 className="mt-4 font-display text-3xl italic sm:text-4xl">
            From export orders to a name of our own
          </h2>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-ink-soft">
          <p>
            Isvena began life as P.M. Rahamathulla &amp; Co, a family-run manufacturer and
            exporter of leather goods founded in 2016 in Ambur, Tamil Nadu — a region with a
            leatherworking tradition that stretches back generations. For years, our workshop
            produced hand-braided bags, wallets, belts and clutches for buyers around the
            world, refining a weaving technique few workshops still practice at this scale.
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
            <p className="eyebrow text-umber">How a Piece is Made</p>
            <h2 className="mt-3 font-display text-3xl italic sm:text-4xl">
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

      <section className="grid gap-1 sm:grid-cols-3">
        <div className="relative aspect-square">
          <PlaceholderArt tone="cognac" caption="Cutting the Hide" className="h-full w-full" />
        </div>
        <div className="relative aspect-square">
          <PlaceholderArt tone="umber" caption="The Braid" className="h-full w-full" />
        </div>
        <div className="relative aspect-square">
          <PlaceholderArt tone="sand" caption="Hand-Finishing" className="h-full w-full" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="font-display text-2xl italic leading-relaxed sm:text-3xl">
          &ldquo;A machine can stitch a bag. It cannot braid one. That difference is the
          entire business.&rdquo;
        </p>
        <p className="mt-6 eyebrow text-umber">P.M. Rahamathulla &amp; Co. — Founded 2016</p>
      </section>
    </div>
  );
}
