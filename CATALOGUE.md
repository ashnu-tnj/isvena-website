# Product catalogue

The catalogue lives in code at `src/data/products.ts`. It holds **The
Signature Collection, 2026** — fifteen pieces, references `ISV-001` to
`ISV-015`, taken from the house catalogue document.

> **The old Google Sheet is out of date.** It mirrors the previous
> 14-product range, which has been removed entirely — different products,
> different categories, different photography. Ask for it to be regenerated
> from the current catalogue before editing anything there.

## The collection

| Ref | Name | Piece | Category |
|---|---|---|---|
| ISV-001 | Verona | Tall Shoulder Tote — Espresso | Totes & Carryalls |
| ISV-002 | Siena | Handheld Basket Tote — Cognac | Totes & Carryalls |
| ISV-003 | Rosa | Wide-Weave Market Tote — Antique Rose | Totes & Carryalls |
| ISV-004 | Lucca | Zigzag Basket Tote — Toffee | Totes & Carryalls |
| ISV-005 | Oliva | Grand Basket Tote — Forest Green | Totes & Carryalls |
| ISV-006 | Capri | Shoulder Basket Tote — Caramel | Totes & Carryalls |
| ISV-007 | Sofia | Slouch Hobo — Tan | Shoulder & Hobo |
| ISV-008 | Luna | Crescent Shoulder Bag — Mahogany | Shoulder & Hobo |
| ISV-009 | Stella | Flap Shoulder Bag — Metallic Silver | Shoulder & Hobo |
| ISV-010 | Piccola | Mini Basket Crossbody — Nero | Crossbody & Belt |
| ISV-011 | Vita | Woven Belt Bag — Cognac | Crossbody & Belt |
| ISV-012 | Sera | Wristlet Clutch — Dark Chocolate | Clutches & Minis |
| ISV-013 | Gioia | Drawstring Bucket — Chestnut | Clutches & Minis |
| ISV-014 | Treccia | Hand-Braided Belt — Dark Brown | Small Leather Goods |
| ISV-015 | Milano | Woven Bifold Wallet — Oxblood | Small Leather Goods |

## Colours

The house range lives in `src/data/colors.ts` — fourteen colours, one per
piece in the collection, with the swatch hex **sampled from that piece's
own packshot** rather than guessed, so a dot on the site matches the
leather in the photograph.

Nothing is held in stock: every piece is cut and woven to order, so any
silhouette can be made in any of the fourteen. The table above names the
colour each piece was *photographed* in, which is what `photographedIn`
records — it leads the swatch row and the card dots (`coloursFor()`) so the
first swatch matches the images beside it, and it is the fallback the
checkout uses when a submitted colour is not one the workshop makes.

Adding a colour means one entry in `colors.ts`; every product picks it up.

## Photography

Every piece is shot three ways, named by slug in `public/products/`:

| Suffix | Shot |
|---|---|
| `-hero.jpg` | Packshot on a plain ground — the card and listing image |
| `-life.jpg` | Styled in a room setting |
| `-weave.jpg` | Macro of the weave |

`src/data/products.ts` builds these paths with the `shots()` helper, so a
new product needs only a matching set of three files. A piece with fewer
photographs can list them explicitly instead, and the gallery fills the
empty slot with woven placeholder art.

The Milano weave macro only ever existed at 362×362, so it has been
resampled to 724×724 (Lanczos plus a restrained unsharp pass) to stop
high-density screens scaling it up themselves — sharper edges, but no
detail that was not in the original. It is the one soft image left in the
collection; a re-export at 1000px or more would drop straight in over it.

Weave macros are the one place cropping is wanted: the tile is 1:1 and the
texture should fill it, so a wide macro is centre-cropped rather than
padded.

## 360° films

Every piece has a silent turntable clip in `public/video/`, named by slug:

| File | |
|---|---|
| `<slug>-360.mp4` | H.264, the universal fallback |
| `<slug>-360.webm` | VP9, ~15% smaller, offered first |
| `<slug>-360.jpg` | Poster frame, shown before playback |

`products.ts` attaches them with the `spin()` helper, so a new product needs
only a matching set of three files. Source clips were 4:3 at 864–960px wide;
they are encoded to 800px wide, 24fps, silent.

The film closes the detail gallery — packshot, then the two detail tiles,
then the turntable — in a 4:3 frame of its own. It is deliberately *not*
placed in the 4:5 or 1:1 frames the stills use, since either would crop a
landscape clip.

`Product360` gives it `preload="none"` and a poster, so no video is fetched
until playback actually starts, and an IntersectionObserver pauses it once
it scrolls out of view. Under `prefers-reduced-motion` it never autoplays —
the poster stands in and native controls appear instead.

`hero-editorial.jpg` is the homepage hero (currently the Capri styled
shot). `workshop.jpg`, `process-cutting.jpg` and `process-braiding.jpg` are
heritage-page imagery and are not tied to any product.

## Prices

The catalogue document carries no prices. The current ladder was set
against size, weave complexity and finishing — Oliva at the top (largest,
triple-dipped), Piccola at the bottom. Review before launch; they are a
starting point, not a quote from the workshop.

## Fields

| Field | Notes |
|---|---|
| `slug` | **Key — do not edit.** It is the page URL (`/product/<slug>`). Changing it breaks the live URL and any links to it. To rename a product, change `name`. |
| `sku` | Catalogue reference (`ISV-001`). |
| `name` | House name — Verona, Siena, Luna. |
| `subName` | The line beneath the name, e.g. "Tall Shoulder Tote — Espresso". Also the sub-label on product cards. |
| `category` | One of: `totes-carryalls`, `shoulder-hobo`, `crossbody-belt`, `clutches-minis`, `small-leather-goods`. |
| `price` | Number only, USD, no `$`. |
| `description` | Short selling paragraph. Also the meta description. |
| `craftsmanship` | How it is made — shown on the detail page. |
| `materials`, `dimensions`, `strap`, `weave`, `fits` | Specification rows on the detail page, quoted from the catalogue. |
| `strapLabel` | Optional heading for the `strap` row (defaults to "Strap"). Treccia uses "Sizes", Milano uses "Interior". |
| `weight` | Optional; omitted where the catalogue gives none. |
| `note` | Closing detail — closure, finish. Shown in italic beneath the spec list. |
| `photographedIn` | The house colour this piece was shot in. **Not a restriction** — see [Colours](#colours). It leads the swatch row so the first dot matches the photographs. |
| `images` | Built by `shots(slug)`. First entry is the primary image. |
| `featured` | Puts it in the homepage "Favourites" row and adds a *Signature* badge. The first featured product also fills the homepage signature editorial — currently Siena, which the catalogue calls "the silhouette that defines the house". |
| `tone` | Brand palette key used for fallback art: `cognac`, `umber`, `sand`, `ink`, `olive`, `cream`. |
| `label` | Short word drawn on fallback art when a product has no photo. |

## Adding a product

Add an entry with at least `slug`, `sku`, `name`, `subName`, `category`,
`price`, `description`, `materials`, `dimensions`, `strap`, `weave`,
`fits`, `photographedIn`, `tone`, `label`. Drop the three photographs into
`public/products/` named `<slug>-hero.jpg`, `-life.jpg`, `-weave.jpg`, and
set `images: shots("<slug>")`. Without images the product still renders,
using the woven placeholder art.

## Removing a product

Delete the entry. The product page, its sitemap entry and its structured
data all disappear with it; the old URL then returns a 404.

## What this does not cover

Categories (`src/data/categories.ts`), page copy, the FAQ
(`src/data/faqs.ts`), brand facts (`src/lib/site.ts`) and the answer-engine
manifest (`public/llms.txt`) are edited separately — all of them describe
the collection and need revisiting when it changes.
