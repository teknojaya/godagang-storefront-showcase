// Representative sanitized example — a merchant can pick a very light
// primary/secondary/accent color for their store theme. Assuming white
// text on any theme-colored fill would silently produce unreadable
// buttons and badges, so every themed fill picks its text color
// through this function rather than hardcoding one.

export function getReadableTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  // A quick perceptual-luminance approximation — enough to pick a
  // side, not a precise WCAG contrast-ratio calculation.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#ffffff";
}
