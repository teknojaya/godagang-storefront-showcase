# GoDagang Storefront — Next.js Engineering Showcase

> Sanitized showcase of the multi-tenant storefront architecture behind GoDagang, a production multi-tenant SaaS commerce platform for Indonesian merchants (UMKM).

**The production source is proprietary and remains private.** This repository contains selected sanitized examples, architectural documentation, security/performance patterns, and tests derived from the real production system — not the complete application.

---

## 1. Overview

Every GoDagang merchant gets a live, public storefront on their own subdomain, rendered by one shared Next.js application. This repository documents and demonstrates that storefront: multi-tenant rendering by subdomain, seven independently-styled templates over one shared commerce foundation, merchant-controlled theming, a hero carousel, product/category/blog pages, cart, checkout, WhatsApp ordering, and a cache/revalidation strategy that keeps pages fast without going stale.

## 2. Architecture

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

Full docs: [`docs/architecture.md`](docs/architecture.md), [`diagrams/storefront-request-flow.md`](diagrams/storefront-request-flow.md).

## 3. Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, semantic CSS custom properties for per-store theming
- **Data:** Server-side fetches to the backend API, tag-based caching + on-demand revalidation
- **Commerce:** Client-side cart (store-scoped), server-validated checkout, WhatsApp ordering
- **Infrastructure:** AWS EC2 + PM2 (Node runtime), CloudFront/S3 for merchant-uploaded media, GitHub Actions → AWS SSM deploys

## 4. Key Engineering Challenges

- **One codebase, seven visual identities** — sharing commerce/data logic across seven templates without forcing them to look alike. See §5/§7.
- **A carousel that blinked** — a real, previously-shipped bug and its fix. See §7's case study.
- **Instant-feeling updates on a cached site** — a merchant's save should show up in seconds, not at the mercy of a cache TTL. See §9.
- **Readable text over merchant-chosen colors** — a free-form brand color can be arbitrarily light or dark. See §8.

## 5. Multi-Tenant Rendering

No client ever supplies a tenant or store id — only a subdomain, resolved to a `slug`, resolved to a store record. An unknown subdomain and a real-but-unpublished store both resolve to the same plain 404, on purpose. Details: [`docs/multi-tenancy.md`](docs/multi-tenancy.md), [`src/examples/tenant-resolution/api-client.ts`](src/examples/tenant-resolution/api-client.ts).

## 6. Storefront Templates

Seven templates — Classic, Modern, Vibrant, Adventure, Minimal, Editorial, Curated — share the same data contract and transition engine while keeping independent arrows/dots/overlays/typography. Full breakdown: [`docs/templates.md`](docs/templates.md).

## 7. Hero Carousel — Engineering Case Study

**Problem:** the hero carousel blinked on every slide change — the outgoing image unmounted immediately, and the incoming one faded in from nothing, producing a visible flash whenever it hadn't already finished loading.

**Solution:** keep the outgoing slide mounted and visible underneath the incoming one for the length of a ~600ms crossfade, and keep only the *next* autoplay slide preloaded — never the whole slide list. No blank frame, no full preloading, `prefers-reduced-motion` respected without ever exposing one either.

Full case study: [`docs/carousel.md`](docs/carousel.md). Code: [`src/examples/carousel/carousel-math.ts`](src/examples/carousel/carousel-math.ts) (pure, tested), [`src/examples/carousel/hero-carousel-track.tsx`](src/examples/carousel/hero-carousel-track.tsx) (the component).

## 8. Theming

Merchant-controlled Primary/Secondary/Accent colors plus three section-background colors, resolved once into a complete, safe theme object and applied as CSS custom properties everywhere. Text color over any themed fill is chosen by a contrast helper, not assumed. Details: [`docs/theming.md`](docs/theming.md).

## 9. Caching & Revalidation

Time-based revalidation by default, with a fire-and-forget, secret-authenticated webhook the backend calls on save so a merchant's change is reflected within seconds via a per-store cache tag — never a global "invalidate everything" tag. Details: [`docs/caching.md`](docs/caching.md), [`src/examples/caching/revalidate-route.ts`](src/examples/caching/revalidate-route.ts).

## 10. Performance

Only the first hero image is priority-loaded; the carousel preloads at most one image ahead; layout dimensions stay stable across slide transitions; only genuinely interactive components run on the client. No fabricated Lighthouse score — see [`docs/performance.md`](docs/performance.md) for exactly what is and isn't claimed.

## 11. Accessibility

Carousel controls with position-aware labels and `aria-current`, reduced-motion support that never exposes a blank frame, contrast-aware themed text, and real `alt` text on every content image. Details: [`docs/accessibility.md`](docs/accessibility.md).

## 12. Testing Strategy

Pure logic (carousel layer math, theme/contrast resolution) is tested directly with `node:test` — no component-rendering framework needed to verify it. This project has no component-rendering test infrastructure by design (the same reasoning `docs/testing` conventions in the sibling backend showcase follow): behavior that genuinely needs a browser is verified manually against the deployed site instead of through a brittle, high-maintenance rendering harness.

```bash
npm install
npm run typecheck
npm test
```

## 13. Selected Code Examples

```text
src/examples/
├── carousel/
│   ├── carousel-math.ts           — pure layer-stack/wrap-index math (tested)
│   └── hero-carousel-track.tsx    — the crossfade component itself
├── theme/
│   ├── contrast.ts                — readable-text-color helper
│   └── theme-resolver.ts          — safe theme resolution + CSS variables
├── tenant-resolution/
│   └── api-client.ts              — slug → store resolution, cache tags
├── caching/
│   └── revalidate-route.ts        — on-demand revalidation webhook handler
└── components/
    └── product-purchase-actions.tsx — balanced Add to Cart / WhatsApp layout
```

Every file above is marked as a **representative sanitized example** in its own header comment.

## 14. Live Product

GoDagang is live in production, with every merchant's storefront served by this codebase on their own subdomain: https://godagang.id

## 15. My Role

I designed and implemented major parts of GoDagang across the merchant dashboard, backend API, multi-tenant storefront, security architecture, and production deployment workflow.

For this repository specifically: the Next.js multi-tenant rendering architecture, all seven storefront templates and their shared transition engine, the theming/contrast system, the cart/checkout/WhatsApp-ordering flow, the caching and on-demand revalidation strategy, and the hero carousel fix documented in §7.

## 16. Production vs. Showcase

**Included here:** architecture documentation, the carousel and theming case studies, a handful of simplified representative components, and tests verifying their pure logic.

**Intentionally private:** the full template implementations, the real API integration layer, real environment values, the checkout/order backend integration, and the complete product/category/blog page implementations.

## 17. Related Repositories

- [GoDagang Backend Showcase](https://github.com/teknojaya/godagang-backend-showcase)
- [GoDagang Frontend Showcase](https://github.com/teknojaya/godagang-frontend-showcase)
- [InvoiceQuo Showcase](https://github.com/teknojaya/invoicequo-showcase)

## 18. Portfolio

- Portfolio: https://rismanarung.com
- GitHub: https://github.com/teknojaya

---

## License / Usage

This repository is provided for technical review and portfolio purposes. It is not the complete GoDagang production source code. See [`LICENSE.md`](LICENSE.md).
