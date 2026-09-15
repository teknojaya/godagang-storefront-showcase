# Performance

Real, currently-applied techniques — not a Lighthouse score claim (see the note at the bottom).

## Images

- Only the **first** hero image is ever marked `priority` (eager-loaded) — every other hero/banner image loads lazily by default.
- The hero carousel preloads at most **one** additional image ahead of what's visible (`docs/carousel.md`) — never the full slide list.
- Images render through Next.js's image optimization (`next/image`), which handles responsive sizing and modern formats automatically.

## Layout stability

The hero container reserves its own aspect ratio/dimensions independent of which slide is showing, so a slide transition never shifts surrounding layout (no cumulative layout shift from the carousel itself).

## Client/server boundary

Only components that genuinely need interactivity (the carousel, the cart, purchase actions, forms) are Client Components. Store data resolution, theme resolution, and page-level rendering stay server-side, which keeps the client-side JavaScript sent to a visitor's browser proportional to what's actually interactive, not the whole page.

## Caching

Store pages use time-based revalidation with an on-demand webhook for the moments that need to feel instant (a merchant just changed their template) — see `docs/caching.md`. This avoids treating every page as either "always fresh, always slow" or "always fast, always stale."

## What I'm not claiming

No Lighthouse score is quoted here because I haven't run one against this showcase (it isn't a deployed application). The production storefront has been reviewed for the practices above directly in code, not benchmarked in this repository.
