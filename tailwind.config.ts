import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     "#06080D",   // page background
          surface:  "#0C0F1A",   // card/panel background
          elevated: "#131720",   // hover surface, modals
        },
        accent: {
          purple: "#A78BFA",     // Lesson 1 — Differential Calculus
          teal:   "#6EE7B7",     // Lesson 2 — Integral Calculus
          coral:  "#F47C7C",     // Lesson 3 — Multivariable Calculus
          blue:   "#8BACFF",     // Lesson 4 — Linear Systems
          amber:  "#F0C27A",     // Lesson 5 — Eigen Analysis
        },
        border: {
          DEFAULT: "#1E2333",
          glow:    "rgba(139,172,255,0.25)",
        },
        text: {
          primary:   "#E8EAF2",
          secondary: "#8B8FA8",
          muted:     "#4A4F66",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-serif)", "serif"],
        sans:    ["var(--font-syne)", "sans-serif"],
        mono:    ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "pulse-glow": "pulseGlow 2s ease infinite",
        "shimmer":    "shimmer 1.5s infinite",
        "bounce-dot": "bounceDot 1.2s ease infinite",
        "slide-in":   "slideIn 0.3s ease both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 rgba(139,172,255,0)" },
          "50%":     { boxShadow: "0 0 24px rgba(139,172,255,0.3)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        bounceDot: {
          "0%,80%,100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%":          { transform: "scale(1)",   opacity: "1" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
