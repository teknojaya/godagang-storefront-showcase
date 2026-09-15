# Theming

Each merchant configures up to six colors from their dashboard:

- **Primary**, **Secondary**, **Accent** — free-form hex, used as solid fills (buttons, badges, active states).
- **Section background 1 / 2** — restricted to a curated, deliberately soft/light palette, since these sit behind normal dark body text.
- **Section background 3** — free-form hex, for a merchant who wants a bold, full-width band.

## Resolution, once, not per-component

`resolveStoreTheme` (`src/examples/theme/theme-resolver.ts`) takes a store's raw color columns — which may be `null`, or occasionally an invalid legacy value — and produces one safe, complete theme object. Every template consumes that same resolved object as CSS custom properties (`--brand`, `--color-on-primary`, ...) rather than each component re-validating colors itself.

## Readable text is not optional

A merchant can pick a very light primary/secondary/accent color. Assuming white text on any theme-colored fill would silently produce an unreadable button. `getReadableTextColor` (`src/examples/theme/contrast.ts`) computes a perceptual-luminance approximation and picks dark or light text accordingly — every themed fill in every template goes through this, not a hardcoded `text-white`.

The restricted section-background palette exists specifically to *avoid* needing this calculation for section backgrounds: by construction, every option in that palette is light enough that normal dark body text reads fine on top of it.
