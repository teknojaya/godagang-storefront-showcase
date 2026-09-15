# Architecture

The storefront is a single Next.js application serving every merchant's public store from one deployment — a merchant subdomain (`<slug>.example.com`) is resolved to a store record on every request, and the response is rendered by whichever of seven templates that store has chosen.

```text
Visitor → merchant subdomain
        │
        ▼
   Next.js App Router (server-rendered)
        │  slug → store lookup (API)
        ▼
  Template registry (7 templates)
        │  shared commerce data & domain logic
        ▼
  Template-specific rendering (theme, layout, components)
```

## Shared foundation, independent presentation

Every template — Classic, Modern, Vibrant, Adventure, Minimal, Editorial, Curated — renders the same underlying data (products, categories, blog, cart, hero/banner images, theme colors) through its own components. Adding an eighth template means writing new presentation components against an existing, already-correct data contract — not re-implementing checkout or cart logic. See `docs/templates.md`.

## Rendering strategy

Store pages are server-rendered with time-based revalidation (ISR), backed by an on-demand revalidation webhook the backend calls right after a merchant saves a change — see `docs/caching.md`. This means a typical visitor gets a fast, cached response, while a merchant who just changed their theme sees the update within seconds, not minutes.

See also: `diagrams/storefront-request-flow.md`.
