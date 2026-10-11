/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0908",
        surface: "#141210",
        surfaceHover: "#1E1B18",
        ivory: "#F5EFE6",
        muted: "#A89F91",
        gold: {
          DEFAULT: "#C9A961",
          light: "#DFC484",
          dark: "#9E7E38",
        },
        borderWarm: "#2A2520",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
