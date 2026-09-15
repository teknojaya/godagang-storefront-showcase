# Accessibility

- **Carousel:** arrows and dots carry `aria-label`s stating position ("Image 2 of 5"), the current slide is marked with `aria-current`, and keyboard focus on any control pauses autoplay the same way hovering does. `prefers-reduced-motion` disables the crossfade animation without ever producing a blank frame — see `docs/carousel.md`.
- **Color contrast:** every themed fill (a merchant's chosen primary/secondary/accent color) picks its text color through a contrast helper rather than assuming white text works — see `docs/theming.md`.
- **Forms:** required fields are marked programmatically, not by color alone; validation errors are associated with their field rather than shown only in a floating toast.
- **Images:** every product/hero/banner image has a real `alt` attribute — merchant-provided where set, a sensible generated fallback ("Store Name — hero image 2 of 5") otherwise, never left empty on a content image.

This is a working list, not a certification claim — no formal WCAG audit has been run against the production storefront, and this repository doesn't claim one.
