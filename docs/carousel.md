# Case Study: Fixing the Hero Carousel Blink

## Problem

Every template's hero carousel mounted only the currently-active slide (a deliberate performance choice: a 5-image hero shouldn't fetch all 5 images upfront). When the active slide changed, the outgoing image unmounted immediately, and the freshly-mounted incoming image faded in from nothing.

That's fine when the incoming image is already in the browser's cache — but the first time a visitor reaches a given slide, it hasn't been fetched yet. The result was a visible blink: a blank frame between the outgoing image disappearing and the incoming one finishing its fetch/decode.

## Constraint

The fix could not simply preload every hero image — that reintroduces the performance problem the original "mount only the active slide" design was solving, and would hurt LCP for the very first, priority-loaded slide.

## Solution

Keep the outgoing slide mounted and fully visible *underneath* the incoming one for the length of a transition, instead of removing it immediately:

1. A small layer stack (`pushCarouselLayer` / `settleCarouselLayers`, `src/examples/carousel/carousel-math.ts`) always ends with the current slide on top. Anything beneath it is already fully rendered and stays untouched until a settle timer collapses the stack back down to one layer.
2. The incoming layer fades in (~600ms, opacity only) on top of the still-visible outgoing layer — so even in the worst case (the incoming image hasn't finished loading yet), what's visible is the outgoing image showing through a low-opacity layer, never a blank frame.
3. Separately, the *next* autoplay slide (`index + 1`) is kept preloaded at all times, invisible and non-interactive — so the common case (autoplay advancing one slide at a time) crossfades onto an already-loaded image. A manual jump to some other slide isn't preloaded; it simply loads on demand behind the still-visible current slide, same "never blank" guarantee.

This never mounts more than **current + one other slide** — a 5-image hero still only ever has at most two images in the DOM at once.

## Accessibility

Under `prefers-reduced-motion`, the opacity transition is skipped entirely rather than shortened — the swap becomes instant. Because the outgoing slide is still the thing being covered (not removed first), an instant swap still never produces a blank frame; it just isn't animated.

## Testing

The layer-stack math is pure and tested in isolation (`tests/showcase.test.mjs`) — no test-rendering infrastructure is needed to verify that rapid, repeated navigation never drops an intermediate layer, or that the stack correctly collapses once a transition has had time to finish.

See the working example: `src/examples/carousel/hero-carousel-track.tsx`.
