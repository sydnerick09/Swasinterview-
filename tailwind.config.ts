import type { Config } from "tailwindcss";

// Monochrome (black & white) design system.
// A single neutral grayscale is reused for every semantic colour so the entire UI
// renders in black, white and grays only.
const mono = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
  950: "#09090b",
};

// Primary/brand scale — darker end is pure black so primary actions read as black.
const brand = {
  50: "#f6f6f6",
  100: "#e7e7e7",
  200: "#d1d1d1",
  300: "#b4b4b4",
  400: "#888888",
  500: "#404040",
  600: "#111111",
  700: "#000000",
  800: "#000000",
  900: "#1a1a1a",
  950: "#141414",
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Full screen list (root, not extend) so `xs` sorts before `sm` and never
    // overrides larger breakpoints on wide screens.
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand,
        // Remap every semantic + neutral colour to the same grayscale.
        gray: mono,
        slate: mono,
        zinc: mono,
        neutral: mono,
        red: mono,
        green: mono,
        amber: mono,
        yellow: mono,
        blue: mono,
        purple: mono,
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-lg":
          "0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
