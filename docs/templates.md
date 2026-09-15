# Storefront Templates

GoDagang ships seven production storefront templates. A merchant picks one from their dashboard; the change propagates to their live storefront through the on-demand revalidation webhook (`docs/caching.md`) within seconds.

| Template | Character |
|---|---|
| **Classic** | Dark hero overlay, simple chevrons, small dot indicators — a familiar, no-frills ecommerce look. |
| **Modern** | Rounded image card hero, polished pill-shaped indicators, a mobile-only sticky purchase bar. |
| **Vibrant** | The most carousel-forward template — bigger pill chevrons, accent-colored hover states, dots that visibly grow when active. |
| **Adventure** | Calmer and more cinematic — minimal chrome, thin ghost chevrons, photography-first framing. |
| **Minimal** | No chevron buttons at all — tiny, understated dots are the only visible carousel control. |
| **Editorial** | Serif numerals ("01 / 03") instead of dots — a magazine caption treatment rather than an app-like control row. |
| **Curated** | Calmer than Vibrant — soft rounded chevron pills inside a rounded-frame hero, a secondary-colored active dot. |

## Shared behavior, independent identity

All seven share the same **transition engine** (`docs/carousel.md`) and the same **data contract** (products, categories, cart, checkout, theme colors) — but each owns its own arrows, dots, overlay treatment, border radius, and typography. The design goal explicitly guards this split: fixing the shared carousel engine (removing a visual bug) must never mean homogenizing seven templates' visual identity into one.

## Why a shared engine matters

Before the current design, an engineering fix to carousel behavior (see `docs/carousel.md`) would otherwise have needed to be applied — and could drift — across seven near-duplicate implementations. A shared, tested transition component fixes the behavior once for all seven, while each template's own file still fully owns how it looks.
