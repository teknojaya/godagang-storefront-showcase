import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("wrapIndex wraps forward and backward around a circular slide list", async () => {
  const { wrapIndex } = await import("../src/examples/carousel/carousel-math.ts");

  assert.equal(wrapIndex(3, 3), 0);
  assert.equal(wrapIndex(-1, 3), 2);
  assert.equal(wrapIndex(0, 0), 0);
});

test("pushCarouselLayer never drops an intermediate layer during rapid navigation", async () => {
  const { pushCarouselLayer } = await import("../src/examples/carousel/carousel-math.ts");

  let stack = [0];
  stack = pushCarouselLayer(stack, 1);
  stack = pushCarouselLayer(stack, 2);
  assert.deepEqual(stack, [0, 1, 2]);

  // Re-pushing the already-active index is a no-op (same reference),
  // which is what stops an unrelated re-render from restarting a
  // transition that's already finished.
  assert.equal(pushCarouselLayer(stack, 2), stack);
});

test("settleCarouselLayers collapses down to only the most recent layer", async () => {
  const { settleCarouselLayers } = await import("../src/examples/carousel/carousel-math.ts");

  assert.deepEqual(settleCarouselLayers([0, 1, 2]), [2]);
  assert.deepEqual(settleCarouselLayers([5]), [5]);
});

test("getReadableTextColor picks dark text on a light fill and white text on a dark fill", async () => {
  const { getReadableTextColor } = await import("../src/examples/theme/contrast.ts");

  assert.equal(getReadableTextColor("#FFFFFF"), "#111827");
  assert.equal(getReadableTextColor("#111827"), "#ffffff");
});

test("resolveStoreTheme falls back to safe defaults for null or invalid colors", async () => {
  const { resolveStoreTheme } = await import("../src/examples/theme/theme-resolver.ts");

  const resolved = resolveStoreTheme({ primary_color: null, secondary_color: "not-a-color", accent_color: "#F59E0B" });

  assert.equal(resolved.primary, "#111827");
  assert.equal(resolved.secondary, "#6B7280");
  assert.equal(resolved.accent, "#F59E0B");
});

test("showcase does not include production infrastructure or secrets", () => {
  const forbidden = [".env", ".env.production", ".env.local", "src/app/api", "src/lib/api/client.ts"];

  for (const path of forbidden) {
    assert.equal(fs.existsSync(path), false, `${path} should not exist in the public showcase`);
  }
});
