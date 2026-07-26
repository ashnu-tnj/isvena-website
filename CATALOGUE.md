# Product catalogue — Google Sheet workflow

The catalogue lives in code at `src/data/products.ts`. A mirror of it is
maintained as a Google Sheet so products can be edited without touching
TypeScript:

**Sheet:** *Isvena — Product Catalogue (with images)*
<https://docs.google.com/spreadsheets/d/1IVjWmTnwXJi6qQxYNelwFB-MSUTwEnAH2nmpmVJJUT8/edit>
(kept in the same Drive folder as the product photography)

## How to use it

Edit the sheet, then ask for the site to be updated from it. The sheet is
the thing you change; `products.ts` is regenerated to match.

### Seeing the thumbnails

`preview`, `preview_2`, `preview_3` and `video_preview` are live
`=IMAGE()` formulas pointing at the deployed site. Rows import at the
default height, so the images look like slivers until you select all rows
and set a row height of roughly 120px — then every thumbnail scales to
fit its cell.

They resolve against `https://isvena-website.vercel.app`. If the site
moves to a custom domain and the Vercel URL stops serving, those formulas
need the new host swapped in — the underlying data is unaffected.

## Columns

| Column | Notes |
|---|---|
| `preview`, `preview_2`, `preview_3` | Thumbnails of the 1st/2nd/3rd entry in `images`. Generated — edit `images`, not these. |
| `video_preview` | Thumbnail of the film's poster frame. |
| `slug` | **Key — do not edit.** It is the page URL (`/product/<slug>`). Changing it breaks the live URL and any links to it. To rename a product, change `name` only. |
| `name` | Display name, shown on cards and the detail page. |
| `category` | Must be exactly one of: `Hand-Braided Totes`, `Sling & Crossbody`, `Baskets & Home`, `Clutches & Potli`. |
| `price_usd` | Number only, no `$`. |
| `description` | Short selling paragraph. Also used as the meta description. |
| `craftsmanship` | Longer "how it's made" paragraph on the detail page. |
| `materials` | Also shown as the sub-label on product cards. |
| `dimensions` | Free text. |
| `weight` | Optional; leave blank if not applicable. |
| `colors` | Comma-separated. Each becomes a selectable swatch. A colour with no swatch defined falls back to cognac — see `colorDot()` in `src/components/product-card.tsx`. |
| `images` | Filenames under `public/products/`, separated by ` \| `. **First image is the primary** (cards, listings, social preview). |
| `video` | Optional filename under `public/video/`. A matching `.webm` and `.jpg` poster must exist alongside it. When set, the film leads the detail gallery. |
| `featured` | `yes` puts it on the homepage "Favourites" row and adds a *Signature* badge. Blank otherwise. |
| `tone` | Brand palette key used for fallback art: `cognac`, `umber`, `sand`, `ink`, `olive`, `cream`. |
| `label` | Short word drawn on fallback art when a product has no photo. |

## Adding a product

Add a row and fill at least `slug`, `name`, `category`, `price_usd`,
`description`, `materials`, `colors`, `tone`, `label`. Use a lowercase
hyphenated `slug`. If `images` is blank the product still renders, using
the woven placeholder art.

## Removing a product

Delete the row. The product page, its sitemap entry and its structured
data all disappear with it; the old URL then returns a 404.

## What the sheet does not cover

Categories themselves (`src/data/categories.ts`), page copy, the FAQ
(`src/data/faqs.ts`) and brand facts (`src/lib/site.ts`) are still edited
in code.
