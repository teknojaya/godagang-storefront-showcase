# Multi-Tenancy on the Storefront

The storefront never receives a tenant or store id from a client. Every request carries only a subdomain, which is resolved to a `slug`, which is looked up against the public API — and only a store whose status is `published` is ever returned.

## Why "not found" and "not published" look identical

An unknown subdomain and a real store that hasn't published yet both resolve to the exact same outcome: a plain 404 page. Distinguishing them would let a visitor confirm "a store with this name exists, it's just not live," which is a small but unnecessary information leak. See `src/examples/tenant-resolution/api-client.ts`'s `ApiResult` type — `not_found` is one case, not two.

## No cross-store bleed in caching

Because Next.js's data cache is tag-based here (`store:<slug>`, see `docs/caching.md`), invalidating one store's cache can never accidentally invalidate another's — there is no shared "all stores" tag that a bug could touch.

## No cross-store bleed in the cart

Cart state is scoped per store slug in client storage — opening two different merchant subdomains in two tabs never mixes their carts, because the storage key itself includes the slug.
