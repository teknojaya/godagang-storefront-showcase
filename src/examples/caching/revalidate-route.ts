// Representative sanitized example — a Next.js Route Handler the
// backend calls right after a merchant saves a store change, so the
// storefront doesn't have to wait out its normal time-based
// revalidation window to pick up something like a template switch.
//
// Framework note: `revalidateTag`/`Response.json` are Next.js APIs —
// this file is written the way it would be inside a real Next.js App
// Router project (`src/app/api/revalidate/route.ts`).

import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { storeTag } from "../tenant-resolution/api-client";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: Request) {
  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!REVALIDATE_SECRET || !secretsMatch(provided, REVALIDATE_SECRET)) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ revalidated: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const slug = isRecord(body) && typeof body.slug === "string" ? body.slug : null;
  if (!slug) {
    return Response.json({ revalidated: false, message: "Missing 'slug'" }, { status: 400 });
  }

  // `{ expire: 0 }` rather than a stale-while-revalidate profile: a
  // webhook-triggered call like this one should expire the cached
  // data immediately, not serve one more stale response first.
  revalidateTag(storeTag(slug), { expire: 0 });

  return Response.json({ revalidated: true, slug });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Constant-time compare — a secret this endpoint gates is worth not
// leaking through response-time differences, even though the blast
// radius of guessing it (forcing extra revalidations) is low.
function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
