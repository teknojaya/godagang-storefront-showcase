// Representative sanitized example — turns a merchant's stored theme
// columns (which may be null, or occasionally an invalid value from
// an older record) into a safe, render-ready set of CSS custom
// properties every template consumes the same way.

import { getReadableTextColor } from "./contrast.ts";

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const DEFAULTS = {
  primary: "#111827",
  secondary: "#6B7280",
  accent: "#F59E0B",
};

function safeHex(value: string | null | undefined, fallback: string): string {
  return value && HEX_COLOR_REGEX.test(value) ? value : fallback;
}

export interface StoreThemeInput {
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
}

export interface ResolvedTheme {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  accent: string;
  onAccent: string;
}

export function resolveStoreTheme(store: StoreThemeInput): ResolvedTheme {
  const primary = safeHex(store.primary_color, DEFAULTS.primary);
  const secondary = safeHex(store.secondary_color, DEFAULTS.secondary);
  const accent = safeHex(store.accent_color, DEFAULTS.accent);

  return {
    primary,
    onPrimary: getReadableTextColor(primary),
    secondary,
    onSecondary: getReadableTextColor(secondary),
    accent,
    onAccent: getReadableTextColor(accent),
  };
}

// Every template renders these as CSS custom properties on a wrapping
// element (`--brand`, `--color-on-primary`, ...) rather than each
// component computing its own contrast — one resolved theme, applied
// once, consumed everywhere.
export function toCssVariables(theme: ResolvedTheme): Record<string, string> {
  return {
    "--brand": theme.primary,
    "--color-on-primary": theme.onPrimary,
    "--brand-secondary": theme.secondary,
    "--color-on-secondary": theme.onSecondary,
    "--brand-accent": theme.accent,
    "--color-on-accent": theme.onAccent,
  };
}
