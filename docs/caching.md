# Caching & Revalidation

## The problem

A merchant's storefront should feel fast for visitors (cached, server-rendered pages), but a merchant who just changed their theme or template shouldn't have to wait out a cache window to see it take effect.

## The approach

- Every store data fetch is tagged per-store (`store:<slug>`, see `src/examples/tenant-resolution/api-client.ts`) and revalidates on a normal time-based schedule by default (Next.js ISR).
- When a merchant saves a change in the dashboard, the backend fires a **fire-and-forget** webhook to a dedicated Next.js Route Handler (`src/examples/caching/revalidate-route.ts`), authenticated with a shared secret compared in constant time.
- That handler calls `revalidateTag` for exactly that store's tag, with `{ expire: 0 }` — the cached data is invalidated immediately, not served once more before catching up.

## Why per-store tags, not a single global tag

A single "all stores" cache tag would mean one merchant's save invalidates (and forces a re-render of) every other merchant's storefront too. Tagging per store means the blast radius of any revalidation is exactly one store, regardless of how many merchants are on the platform.

## Why the webhook call is fire-and-forget on the backend side

The dashboard's save request must never be slowed down or failed by a storefront hiccup (a deploy in progress, a cold start). The backend never awaits this call — a failed revalidation just means the merchant sees their change on the next normal cache cycle instead of immediately, not a broken save.
