// packages/tokens/index.ts
// Portal Estilo Luxo · Brand Tokens v2.0 (Brand Book & Pitch Editorial)

export const colors = {
  // Brand Book Paleta Oficial (Capítulo 8)
  cream: "#FAF7F2",        // Creme Editorial · Fundo principal (65%)
  creamDeep: "#F0EBE0",    // Creme Profundo · Cards e superfícies secundárias
  ink: "#0A0A0A",          // Preto Profundo · Tipografia primária (20%)
  graphite: "#2C2C2C",     // Grafite · Tipografia secundária (5%)
  graphiteSoft: "#4A4A4A", // Grafite suave · Textos de apoio
  gold: "#B8924A",         // Dourado Champagne · Acentos (8%)
  goldDeep: "#8B6B30",     // Dourado Profundo · Preços e destaques itálicos
  goldPale: "#D9BE85",     // Dourado Pálido · Acentos em superfícies escuras
  line: "#C9BFA8",         // Linha Pedra · Divisores e bordas (2%)
  mute: "#8C8275",         // Mute · Legendas e microcopy

  // Backwards compatibility aliases
  bg: "#FAF7F2",
  bgElevated: "#F0EBE0",
  surface: "#FFFFFF",
  surfaceAlt: "#F0EBE0",
  primary: "#0A0A0A",
  primaryDim: "#2C2C2C",
  muted: "#8C8275",
  onAccent: "#0A0A0A",
  accent: "#B8924A",
  accentBright: "#D9BE85",
  accentDeep: "#8B6B30",
  divider: "#C9BFA8",
  success: "#5B8254",
  danger: "#A84E4E",
  warning: "#B8924A",
  figmaAnnotation: "#B8924A",
  obsidian: "#0A0A0A",
  surfaceHover: "#EAE3D5",
  ivory: "#FAF7F2",
  goldLight: "#D9BE85",
  goldDark: "#8B6B30",
  border: "#C9BFA8",
} as const;

export const typography = {
  heading: "'Playfair Display', Georgia, serif",
  serif: "'Playfair Display', Georgia, serif",
  heroItalic: "'Cormorant Garamond', Georgia, serif",
  italicSerif: "'Cormorant Garamond', Georgia, serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', Menlo, monospace",
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
