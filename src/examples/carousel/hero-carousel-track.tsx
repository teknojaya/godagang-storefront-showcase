"use client";

// Representative sanitized example — simplified from the production
// HeroCarouselTrack component. Uses a plain <img> here instead of
// next/image to keep this example dependency-light; production code
// uses next/image for optimization and priority-loading control.
//
// See docs/carousel.md for the engineering case study this
// demonstrates: a hero carousel that used to blink on every slide
// change, and why "keep the outgoing slide mounted" fixes it without
// preloading every image.

import { useEffect, useRef, useState } from "react";
import { pushCarouselLayer, settleCarouselLayers, wrapIndex } from "./carousel-math";

const TRANSITION_MS = 600;

interface Slide {
  src: string;
  alt: string;
}

interface Props {
  slides: Slide[]; // length >= 2
  index: number; // which slide is currently active
}

export function HeroCarouselTrack({ slides, index }: Props) {
  const [stack, setStack] = useState<number[]>([index]);
  const [revealed, setRevealed] = useState(true);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adjusting state during render (not inside a useEffect) avoids
  // committing the stale stack for one extra frame — see React's own
  // guidance on "adjusting state when a prop changes."
  const nextStack = pushCarouselLayer(stack, index);
  if (nextStack !== stack) {
    setStack(nextStack);
    setRevealed(false);
  }

  useEffect(() => {
    if (stack.length <= 1) return;

    const raf = requestAnimationFrame(() => setRevealed(true));
    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
      setStack((prev) => settleCarouselLayers(prev));
    }, TRANSITION_MS);

    return () => {
      cancelAnimationFrame(raf);
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    };
  }, [stack]);

  // Only the very next autoplay slide is ever pre-mounted (hidden) —
  // never the full slide list — so a 5-image hero still only ever
  // fetches at most two images ahead of what's on screen.
  const preloadIndex = wrapIndex(index + 1, slides.length);
  const showPreload = preloadIndex !== index && !stack.includes(preloadIndex);

  return (
    <div style={{ position: "relative" }}>
      {stack.map((slideIndex, i) => {
        const isTop = i === stack.length - 1;
        const hidden = isTop && !revealed;
        return (
          <img
            key={slideIndex}
            src={slides[slideIndex].src}
            alt={slides[slideIndex].alt}
            style={{
              position: "absolute",
              inset: 0,
              opacity: hidden ? 0 : 1,
              transition: "opacity 600ms ease-out",
            }}
          />
        );
      })}

      {showPreload && (
        <img
          aria-hidden="true"
          src={slides[preloadIndex].src}
          alt=""
          style={{ position: "absolute", inset: 0, opacity: 0 }}
        />
      )}
    </div>
  );
}
