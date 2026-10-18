/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        creamDeep: "#F0EBE0",
        ink: "#0A0A0A",
        graphite: "#2C2C2C",
        graphiteSoft: "#4A4A4A",
        gold: {
          DEFAULT: "#B8924A",
          deep: "#8B6B30",
          pale: "#D9BE85",
          light: "#D9BE85",
          dark: "#8B6B30",
        },
        line: "#C9BFA8",
        mute: "#8C8275",
        // Compatibilidade retroativa
        obsidian: "#0A0A0A",
        surface: "#FFFFFF",
        surfaceHover: "#F0EBE0",
        ivory: "#FAF7F2",
        muted: "#8C8275",
        borderWarm: "#C9BFA8",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        italicSerif: ["'Cormorant Garamond'", "Georgia", "serif"],
        heroItalic: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
