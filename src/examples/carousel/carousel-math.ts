// Representative sanitized example — the pure index/layer-stack math
// behind the hero carousel's transition engine. See
// docs/carousel.md for the full engineering case study this code
// supports (the "blinking carousel" bug and its fix).

// Wraps an index into [0, length) in either direction — the basis for
// "next"/"previous"/direct-selection on a circular carousel.
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

// The layer-stack behind the crossfade fix: rather than unmounting the
// outgoing slide the instant the active index changes (which is what
// caused the original blink — see docs/carousel.md), the outgoing
// slide is kept mounted and visible underneath the incoming one for
// the length of a transition. This function decides what the stack
// should look like right after `index` changes.
export function pushCarouselLayer(stack: number[], index: number): number[] {
  if (stack.length > 0 && stack[stack.length - 1] === index) return stack;
  return [...stack, index];
}

// Once a transition has had time to finish, only the most recent layer
// needs to stay mounted — collapses the stack down to it. A no-op if
// there's nothing to collapse, so it's safe to call unconditionally
// from a settle timer.
export function settleCarouselLayers(stack: number[]): number[] {
  if (stack.length <= 1) return stack;
  return [stack[stack.length - 1]];
}
