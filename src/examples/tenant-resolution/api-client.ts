// Representative sanitized example — every public storefront page
// resolves its data through this one function shape, so "not found"
// vs. "backend unreachable" is decided once, not re-derived per page.
//
// A result type rather than throwing lets every page decide what each
// outcome should render, instead of a try/catch pyramid repeated on
// every route. `not_found` deliberately covers both an unknown slug
// and a slug that exists but isn't published — the public API returns
// 404 for both on purpose, so a visitor (or this client) can never
// distinguish "wrong name" from "not published yet."

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "error"; status?: number };

// Revalidation tags are per-store so an on-demand revalidation webhook
// (see docs/caching.md) can invalidate exactly one store's cached
// pages without needing new caching infrastructure.
export function storeTag(slug: string): string {
  return `store:${slug}`;
}

const DEFAULT_REVALIDATE_SECONDS = 60;

// Next.js augments fetch()'s options with a `next: { revalidate, tags }`
// extension for its data cache — only visible to the type checker
// inside a real Next.js app (via its generated `next-env.d.ts`), so
// this standalone example spells it out explicitly instead.
type NextFetchInit = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export async function fetchStore<T>(
  baseUrl: string,
  slug: string,
  { revalidate = DEFAULT_REVALIDATE_SECONDS }: { revalidate?: number } = {}
): Promise<ApiResult<T>> {
  const init: NextFetchInit = { next: { revalidate, tags: [storeTag(slug)] } };

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/storefront/${slug}`, init);
  } catch {
    return { ok: false, reason: "error" };
  }

  if (res.status === 404) return { ok: false, reason: "not_found" };
  if (!res.ok) return { ok: false, reason: "error", status: res.status };

  try {
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, reason: "error" };
  }
}
