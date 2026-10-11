export const colors = {
  bg: "#0A0908",
  bgElevated: "#14110E",
  surface: "#1C1814",
  surfaceAlt: "#25201A",
  primary: "#F5EFE6",
  primaryDim: "#C9C2B6",
  muted: "#8A8278",
  onAccent: "#0A0908",
  accent: "#C9A961",
  accentBright: "#E0C47C",
  accentDeep: "#8B7355",
  divider: "#2A2520",
  success: "#7FA66B",
  danger: "#C97264",
  warning: "#D4A547",
  figmaAnnotation: "#4FC3F7",
  // Aliases backwards-compatible
  obsidian: "#0A0908",
  surfaceHover: "#1C1814",
  ivory: "#F5EFE6",
  gold: "#C9A961",
  goldLight: "#E0C47C",
  goldDark: "#8B7355",
  border: "#2A2520",
} as const;

export const typography = {
  heading: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
  serif: "'Cormorant Garamond', Georgia, serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', Menlo, monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

export const spacing = {
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
} as const;
