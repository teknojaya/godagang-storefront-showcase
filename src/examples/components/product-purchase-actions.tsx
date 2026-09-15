"use client";

// Representative sanitized example — the two primary purchase actions
// on a product detail page (Add to Cart, WhatsApp order), simplified
// from the production ProductPurchaseActions component.
//
// Engineering note: this replaced an earlier layout where the
// WhatsApp button owned its own quantity stepper rendered in the same
// row as its anchor — which visually unbalanced the two calls to
// action (Add to Cart's row got the full width; WhatsApp's row lost
// width to the stepper next to it). Quantity now gets its own row
// above both actions, and the two actions sit in an equal-width grid
// that collapses to one full-width action when only one is available
// — so there's never an empty grid column.

import { useState } from "react";

interface Props {
  inStock: boolean;
  onAddToCart: () => void;
  whatsappHref: string | null; // null when WhatsApp ordering isn't available for this product
}

export function ProductPurchaseActions({ inStock, onAddToCart, whatsappHref }: Props) {
  const [quantity, setQuantity] = useState(1);
  const showWhatsApp = whatsappHref !== null;

  return (
    <div className="flex flex-col gap-3">
      {showWhatsApp && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-700">Quantity</span>
          <div className="inline-flex items-center rounded-full border border-neutral-300">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
              −
            </button>
            <span className="min-w-6 text-center text-sm">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(100, q + 1))} aria-label="Increase quantity">
              +
            </button>
          </div>
        </div>
      )}

      <div className={`grid gap-3 ${showWhatsApp ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        <button
          type="button"
          disabled={!inStock}
          onClick={onAddToCart}
          className="w-full rounded-full bg-(--brand) px-6 py-4 text-sm font-semibold text-(--color-on-primary) disabled:opacity-60"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>

        {showWhatsApp && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold text-white"
          >
            Order via WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
