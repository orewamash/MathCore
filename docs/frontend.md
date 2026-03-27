# MathCore — Frontend Implementation Guide

> This file tells you **exactly what code to use for every part of the site**.
> Every section says: what it is, where it goes, and the full code to paste.

---

## 1. Project Setup

### 1.1 Initialise

```bash
npx create-next-app@latest mathcore \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd mathcore

npm install \
  @anthropic-ai/sdk \
  ai \
  @ai-sdk/anthropic \
  framer-motion \
  lenis \
  katex \
  react-katex \
  zustand \
  zod \
  sonner \
  @radix-ui/react-tooltip \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-slot \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react

npx shadcn@latest init
```

---

### 1.2 Tailwind Config
**File: `tailwind.config.ts`**

```typescript
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
```

---

### 1.3 Global CSS
**File: `src/app/globals.css`**

```css
@import "tailwindcss";
@import "katex/dist/katex.min.css";

@layer base {
  :root {
    --font-dm-serif:   "DM Serif Display";
    --font-syne:       "Syne";
    --font-geist-mono: "Geist Mono";
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page background ── */
  body {
    background-color: #06080D;
    color: #E8EAF2;
    font-family: var(--font-syne), sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  /* ── Custom scrollbar ── */
  ::-webkit-scrollbar       { width: 6px; }
  ::-webkit-scrollbar-track { background: #06080D; }
  ::-webkit-scrollbar-thumb { background: #1E2333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #2a3347; }

  /* ── Skeleton shimmer ── */
  .skeleton {
    background: linear-gradient(
      90deg,
      #0C0F1A 25%,
      #131720 50%,
      #0C0F1A 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
  }

  /* ── KaTeX override — match site font size ── */
  .katex { font-size: 1.1em; }
  .katex-display { overflow-x: auto; padding: 0.5rem 0; }

  /* ── Selection colour ── */
  ::selection { background: rgba(139, 172, 255, 0.25); }
}
```

---

### 1.4 Root Layout with Fonts
**File: `src/app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { DM_Serif_Display, Syne } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// ── Display font (headings, hero text) ──
const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

// ── Body font ──
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

// ── Monospace font (code, math output) ──
const geistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MathCore — Engineering Mathematics 1",
  description: "Learn and practise Engineering Maths 1 with AI-powered step-by-step solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${syne.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 2. Folder Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx              # SiteNav + Footer wrapper
│   │   └── page.tsx                # Landing page
│   │
│   ├── lessons/
│   │   ├── page.tsx                # All 5 lessons grid
│   │   └── [slug]/
│   │       ├── page.tsx            # Lesson overview + sub-topic list
│   │       └── [topic]/
│   │           └── page.tsx        # Topic page — Library + Simulator
│   │
│   ├── search/
│   │   └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── api/
│   │   └── simulator/
│   │       └── route.ts            # POST — receives question, returns solution stream
│   │
│   ├── layout.tsx                  # Root layout (fonts, providers)
│   └── globals.css
│
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── tooltip.tsx
│   │   └── skeleton.tsx
│   │
│   ├── layout/
│   │   ├── SiteNav.tsx             # Top navigation bar
│   │   ├── Footer.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── PageTransition.tsx
│   │
│   ├── marketing/
│   │   ├── HeroSection.tsx
│   │   ├── LessonsGrid.tsx         # 5 lesson cards on landing
│   │   ├── FeatureHighlights.tsx
│   │   └── FloatingPaths.tsx       # SVG animated background
│   │
│   ├── lesson/
│   │   ├── LessonCard.tsx          # Card for each lesson on /lessons
│   │   ├── TopicNav.tsx            # Left sidebar nav within a lesson
│   │   ├── LibrarySection.tsx      # Theory, examples, notes
│   │   ├── SimulatorSection.tsx    # AI input + solution output
│   │   ├── StepCard.tsx            # Single solution step card
│   │   ├── FormulaCard.tsx         # Quick-reference formula block
│   │   ├── ExampleBlock.tsx        # Worked example with toggle
│   │   └── ProgressTracker.tsx     # "Library read / Simulator tried" badges
│   │
│   └── shared/
│       ├── MathRenderer.tsx        # KaTeX wrapper
│       ├── CountUp.tsx
│       ├── GlareCard.tsx
│       ├── Typewriter.tsx
│       ├── EmptyState.tsx
│       ├── LoadingDots.tsx
│       └── SearchBar.tsx
│
├── lib/
│   ├── ai/
│   │   ├── simulator.ts            # Build system prompt per topic
│   │   └── prompts.ts              # All system prompts
│   ├── content/
│   │   ├── lessons.ts              # Lesson metadata
│   │   └── topics.ts               # Topic content (notes, examples)
│   └── utils.ts                    # cn(), formatStep(), etc.
│
├── hooks/
│   ├── useSimulator.ts             # Manages simulator state + streaming
│   ├── useProgress.ts              # Tracks which topics are done
│   └── useMediaQuery.ts
│
├── stores/
│   └── progress.store.ts           # Zustand — tracks read/tried per topic
│
└── types/
    └── app.types.ts
```

---

## 3. Colour Usage Guide

**Use these exact Tailwind classes for the right elements:**

```
Page background:         bg-bg-base         (#06080D)
Card / panel:            bg-bg-surface       (#0C0F1A)
Hover state / modal:     bg-bg-elevated      (#131720)
Default border:          border-border       (#1E2333)
Glow border:             border-border-glow

Primary text:            text-text-primary   (#E8EAF2)
Secondary text:          text-text-secondary (#8B8FA8)
Muted / disabled text:   text-text-muted     (#4A4F66)

Lesson 1 purple:         text-accent-purple  / bg-accent-purple  / border-accent-purple
Lesson 2 teal:           text-accent-teal    / bg-accent-teal    / border-accent-teal
Lesson 3 coral:          text-accent-coral   / bg-accent-coral   / border-accent-coral
Lesson 4 blue:           text-accent-blue    / bg-accent-blue    / border-accent-blue
Lesson 5 amber:          text-accent-amber   / bg-accent-amber   / border-accent-amber
```

---

## 4. Shared Components

### 4.1 `MathRenderer` — Render any LaTeX formula
**File: `src/components/shared/MathRenderer.tsx`**

```typescript
"use client";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  formula: string;
  display?: boolean; // true = block (centred), false = inline
  className?: string;
}

export function MathRenderer({ formula, display = false, className }: MathRendererProps) {
  return (
    <span className={className}>
      {display
        ? <BlockMath math={formula} />
        : <InlineMath math={formula} />
      }
    </span>
  );
}
```

**Usage:**
```tsx
// Inline formula inside a sentence
<MathRenderer formula="f(x,y) = x^2 + y^2" />

// Block formula on its own line
<MathRenderer formula="\frac{\partial f}{\partial x} = 2x" display />
```

---

### 4.2 `GlareCard` — Card with mouse-tracking glare
**File: `src/components/shared/GlareCard.tsx`**

```typescript
"use client";
import { useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;   // default "#8BACFF"
  glareOpacity?: number; // default 0.12
  disabled?: boolean;    // disables on touch devices
}

export function GlareCard({
  children,
  className,
  glareColor = "#8BACFF",
  glareOpacity = 0.12,
  disabled = false,
}: GlareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glare-x", `${x}%`);
    card.style.setProperty("--glare-y", `${y}%`);
    card.style.setProperty("--glare-opacity", String(glareOpacity));
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.setProperty("--glare-opacity", "0");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-bg-surface transition-all duration-200",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
        "before:opacity-[var(--glare-opacity,0)] before:transition-opacity before:duration-300",
        className
      )}
      style={{
        "--glare-color": glareColor,
      } as React.CSSProperties}
    >
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), ${glareColor}, transparent 60%)`,
          opacity: "var(--glare-opacity, 0)",
        }}
      />
      {children}
    </div>
  );
}
```

**Use on:** Lesson cards, topic cards, pricing cards.

---

### 4.3 `CountUp` — Animated number counter
**File: `src/components/shared/CountUp.tsx`**

```typescript
"use client";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number; // ms, default 1000
  decimals?: number;
  className?: string;
}

export function CountUp({ to, duration = 1000, decimals = 0, className }: CountUpProps) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [to, duration, decimals]);

  return <span className={className}>{value.toFixed(decimals)}</span>;
}
```

---

### 4.4 `LoadingDots` — Three bouncing dots
**File: `src/components/shared/LoadingDots.tsx`**

```typescript
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-text-secondary animate-bounce-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  );
}
```

---

### 4.5 `Typewriter` — Animated typing text
**File: `src/components/shared/Typewriter.tsx`**

```typescript
"use client";
import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;     // ms per character, default 40
  delay?: number;     // ms before start, default 0
  className?: string;
  onDone?: () => void;
}

export function Typewriter({ text, speed = 40, delay = 0, className, onDone }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay, onDone]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
```

---

## 5. Layout Components

### 5.1 `SiteNav` — Top navigation bar
**File: `src/components/layout/SiteNav.tsx`**

```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { label: "Lessons", href: "/lessons" },
  { label: "Search", href: "/search" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    // ── Sticky top bar with blur backdrop ──
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="font-display text-xl text-text-primary">
          Math<span className="text-accent-blue">Core</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-text-primary",
                pathname === link.href
                  ? "text-text-primary"
                  : "text-text-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent-blue px-4 py-1.5 text-sm font-medium text-bg-base transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

---

### 5.2 `Footer`
**File: `src/components/layout/Footer.tsx`**

```typescript
import Link from "next/link";

export function Footer() {
  return (
    // ── Footer with top border ──
    <footer className="mt-32 border-t border-border bg-bg-base">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-text-secondary sm:flex-row">
        <p>© 2025 MathCore. Engineering Mathematics 1.</p>
        <div className="flex gap-6">
          <Link href="/lessons" className="hover:text-text-primary transition-colors">Lessons</Link>
          <Link href="/search" className="hover:text-text-primary transition-colors">Search</Link>
        </div>
      </div>
    </footer>
  );
}
```

---

### 5.3 `MobileBottomNav`
**File: `src/components/layout/MobileBottomNav.tsx`**

```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home",    href: "/",        icon: Home },
  { label: "Lessons", href: "/lessons", icon: BookOpen },
  { label: "Search",  href: "/search",  icon: Search },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    // ── Fixed bottom bar, visible only on mobile ──
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-bg-base/95 backdrop-blur-md md:hidden">
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
              active ? "text-accent-blue" : "text-text-muted"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
```

---

### 5.4 `PageTransition`
**File: `src/components/layout/PageTransition.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 6. Marketing Components

### 6.1 `FloatingPaths` — SVG animated background
**File: `src/components/marketing/FloatingPaths.tsx`**

```typescript
import { motion } from "framer-motion";

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M${-200 + i * 50} ${400 + Math.sin(i) * 100} Q${300 + i * 20} ${200 - i * 10} ${700 + i * 40} ${500 + Math.cos(i) * 80}`,
    delay: i * 0.15,
    duration: 6 + Math.random() * 4,
    opacity: 0.04 + (i / 24) * 0.08,
  }));

  return (
    // ── Absolute fill, pointer-events-none so it doesn't block clicks ──
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#8BACFF"
            strokeWidth="0.6"
            fill="none"
            opacity={path.opacity}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: path.opacity }}
            transition={{ duration: path.duration, delay: path.delay, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </svg>
    </div>
  );
}
```

---

### 6.2 `HeroSection`
**File: `src/components/marketing/HeroSection.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FloatingPaths } from "./FloatingPaths";
import { Typewriter } from "@/components/shared/Typewriter";

export function HeroSection() {
  return (
    // ── Full-viewport hero with dark bg and animated paths behind ──
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base">
      <FloatingPaths position={1} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface px-4 py-1.5 text-xs text-accent-blue"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-blue animate-pulse" />
          AI-Powered Engineering Mathematics
        </motion.div>

        {/* Main headline — DM Serif Display font */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 font-display text-5xl leading-tight text-text-primary md:text-7xl"
        >
          Learn Maths.{" "}
          <span className="text-accent-blue">
            <Typewriter text="Solve anything." delay={600} />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mx-auto mb-10 max-w-lg text-lg text-text-secondary"
        >
          5 complete lessons covering every topic in Engineering Maths 1.
          Read the theory, then type your question — the AI solves it step by step.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/lessons"
            className="rounded-xl bg-accent-blue px-8 py-3 text-sm font-medium text-bg-base transition-all hover:opacity-90 hover:scale-[1.02]"
          >
            Start learning
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-xl border border-border px-8 py-3 text-sm text-text-secondary transition-all hover:border-border-glow hover:text-text-primary"
          >
            See how it works
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

---

### 6.3 `LessonsGrid` — 5 lesson cards on landing page
**File: `src/components/marketing/LessonsGrid.tsx`**

```typescript
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlareCard } from "@/components/shared/GlareCard";

const lessons = [
  {
    number: 1,
    title: "Differential Calculus",
    slug: "differential-calculus",
    topics: ["Rolle's Theorem", "LMVT"],
    accent: "accent-purple",
    accentHex: "#A78BFA",
    description: "Understand conditions, conclusions, and geometric meaning of classical theorems.",
  },
  {
    number: 2,
    title: "Integral Calculus",
    slug: "integral-calculus",
    topics: ["Integration by Parts", "Bernoulli's Formula", "Double & Triple Integration"],
    accent: "accent-teal",
    accentHex: "#6EE7B7",
    description: "Master integration techniques from parts to area and volume computation.",
  },
  {
    number: 3,
    title: "Multivariable Calculus",
    slug: "multivariable-calculus",
    topics: ["Euler's Theorem", "Jacobian", "Maxima & Minima", "Lagrange Multiplier"],
    accent: "accent-coral",
    accentHex: "#F47C7C",
    description: "Extend calculus to functions of two or more variables.",
  },
  {
    number: 4,
    title: "Linear Systems",
    slug: "linear-systems",
    topics: ["Gauss Elimination", "Gauss-Jordan", "LU Decomposition"],
    accent: "accent-blue",
    accentHex: "#8BACFF",
    description: "Solve systems of equations with three classic matrix methods.",
  },
  {
    number: 5,
    title: "Eigen Analysis",
    slug: "eigen-analysis",
    topics: ["Eigenvalues", "Eigenvectors", "Cayley-Hamilton Theorem"],
    accent: "accent-amber",
    accentHex: "#F0C27A",
    description: "Find eigenvalues, eigenvectors, and verify the Cayley-Hamilton theorem.",
  },
];

export function LessonsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      {/* Section heading */}
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl text-text-primary">5 Complete Lessons</h2>
        <p className="mt-3 text-text-secondary">Every topic in Engineering Maths 1, explained and solvable.</p>
      </div>

      {/* 5-card grid — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, i) => (
          <motion.div
            key={lesson.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/lessons/${lesson.slug}`}>
              <GlareCard
                glareColor={lesson.accentHex}
                className="group flex h-full flex-col p-6 transition-all hover:-translate-y-1"
              >
                {/* Lesson number */}
                <span
                  className="mb-4 text-xs font-medium"
                  style={{ color: lesson.accentHex }}
                >
                  Lesson {lesson.number}
                </span>

                {/* Title */}
                <h3 className="mb-2 text-lg font-medium text-text-primary group-hover:text-white transition-colors">
                  {lesson.title}
                </h3>

                {/* Description */}
                <p className="mb-5 text-sm text-text-secondary leading-relaxed">
                  {lesson.description}
                </p>

                {/* Topic pills */}
                <div className="mt-auto flex flex-wrap gap-2">
                  {lesson.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md border px-2 py-0.5 text-xs"
                      style={{
                        borderColor: `${lesson.accentHex}30`,
                        color: lesson.accentHex,
                        backgroundColor: `${lesson.accentHex}0D`,
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </GlareCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

---

## 7. Lesson Page Components

### 7.1 `TopicNav` — Left sidebar within a lesson
**File: `src/components/lesson/TopicNav.tsx`**

```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Topic {
  slug: string;
  title: string;
}

interface TopicNavProps {
  lessonSlug: string;
  topics: Topic[];
  accentHex: string;
}

export function TopicNav({ lessonSlug, topics, accentHex }: TopicNavProps) {
  const pathname = usePathname();

  return (
    // ── Sticky left sidebar, hidden on mobile ──
    <nav className="sticky top-20 hidden w-56 shrink-0 md:block">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Topics</p>
      <ul className="space-y-1">
        {topics.map((topic) => {
          const href = `/lessons/${lessonSlug}/${topic.slug}`;
          const active = pathname === href;
          return (
            <li key={topic.slug}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                  active
                    ? "bg-bg-elevated text-text-primary"
                    : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
                )}
              >
                {/* Accent dot on active item */}
                {active && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: accentHex }}
                  />
                )}
                {topic.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

---

### 7.2 `FormulaCard` — Quick-reference formula block
**File: `src/components/lesson/FormulaCard.tsx`**

```typescript
import { MathRenderer } from "@/components/shared/MathRenderer";

interface FormulaCardProps {
  title: string;
  formula: string;
  accentHex: string;
  note?: string;
}

export function FormulaCard({ title, formula, accentHex, note }: FormulaCardProps) {
  return (
    // ── Highlighted card for key formula ──
    // Background: bg-bg-surface | Left accent border in lesson colour
    <div
      className="rounded-xl border border-border bg-bg-surface p-5"
      style={{ borderLeftWidth: "3px", borderLeftColor: accentHex }}
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: accentHex }}>
        {title}
      </p>
      {/* Large centred formula */}
      <div className="py-3 text-center text-text-primary">
        <MathRenderer formula={formula} display />
      </div>
      {note && (
        <p className="mt-3 text-sm text-text-secondary">{note}</p>
      )}
    </div>
  );
}
```

**Usage:**
```tsx
<FormulaCard
  title="Rolle's Theorem"
  formula="f'(c) = 0 \text{ for some } c \in (a,b)"
  accentHex="#A78BFA"
  note="Conditions: f must be continuous on [a,b], differentiable on (a,b), and f(a) = f(b)."
/>
```

---

### 7.3 `ExampleBlock` — Worked example with toggle
**File: `src/components/lesson/ExampleBlock.tsx`**

```typescript
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MathRenderer } from "@/components/shared/MathRenderer";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  formula?: string;
  text?: string;
}

interface ExampleBlockProps {
  number: number;
  question: string;
  steps: Step[];
  answer: string;
  accentHex: string;
}

export function ExampleBlock({ number, question, steps, answer, accentHex }: ExampleBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    // ── Collapsible worked example ──
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-bg-elevated transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-medium"
            style={{ background: `${accentHex}20`, color: accentHex }}
          >
            {number}
          </span>
          <span className="text-sm text-text-primary">{question}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-5 py-5">
              {/* Steps */}
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="mt-0.5 text-xs text-text-muted">Step {i + 1}</span>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-text-primary">{step.label}</p>
                    {step.formula && <MathRenderer formula={step.formula} display />}
                    {step.text && <p className="text-sm text-text-secondary">{step.text}</p>}
                  </div>
                </div>
              ))}
              {/* Final answer box */}
              <div
                className="rounded-lg px-4 py-3 text-center"
                style={{ background: `${accentHex}15`, border: `1px solid ${accentHex}30` }}
              >
                <p className="mb-1 text-xs" style={{ color: accentHex }}>Answer</p>
                <MathRenderer formula={answer} display />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 7.4 `LibrarySection` — Theory, notes, and examples
**File: `src/components/lesson/LibrarySection.tsx`**

```typescript
import { FormulaCard } from "./FormulaCard";
import { ExampleBlock } from "./ExampleBlock";
import { MathRenderer } from "@/components/shared/MathRenderer";

interface LibrarySectionProps {
  topic: {
    title: string;
    plainEnglish: string;       // definition in plain words
    intuition: string;          // geometric / physical "why"
    formalStatement: string;    // LaTeX formula
    conditions: string[];       // list of conditions
    commonMistakes: string[];   // list of mistakes
    examples: any[];            // ExampleBlock props
  };
  accentHex: string;
}

export function LibrarySection({ topic, accentHex }: LibrarySectionProps) {
  return (
    <div className="space-y-10">
      {/* ── What it is ── */}
      <section>
        <h2 className="mb-4 font-display text-3xl text-text-primary">{topic.title}</h2>
        <p className="text-base leading-relaxed text-text-secondary">{topic.plainEnglish}</p>
      </section>

      {/* ── The formula ── */}
      <FormulaCard
        title="Formula"
        formula={topic.formalStatement}
        accentHex={accentHex}
      />

      {/* ── Conditions ── */}
      <section>
        <h3 className="mb-3 text-base font-medium text-text-primary">Conditions</h3>
        <ul className="space-y-2">
          {topic.conditions.map((c, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accentHex }}
              />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Intuition box ── */}
      <section className="rounded-xl border border-border bg-bg-elevated px-5 py-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Intuition</p>
        <p className="text-sm leading-relaxed text-text-secondary">{topic.intuition}</p>
      </section>

      {/* ── Worked examples ── */}
      <section>
        <h3 className="mb-4 text-base font-medium text-text-primary">Worked Examples</h3>
        <div className="space-y-3">
          {topic.examples.map((ex, i) => (
            <ExampleBlock key={i} number={i + 1} accentHex={accentHex} {...ex} />
          ))}
        </div>
      </section>

      {/* ── Common mistakes ── */}
      <section>
        {/* Amber warning box */}
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 px-5 py-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent-amber">
            Common mistakes
          </p>
          <ul className="space-y-2">
            {topic.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
```

---

### 7.5 `StepCard` — A single step in the simulator output
**File: `src/components/lesson/StepCard.tsx`**

```typescript
"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MathRenderer } from "@/components/shared/MathRenderer";

interface StepCardProps {
  stepNumber: number;
  title: string;
  formula?: string;
  explanation: string;
  whyNote?: string;    // expandable "why does this work?" note
  accentHex: string;
}

export function StepCard({ stepNumber, title, formula, explanation, whyNote, accentHex }: StepCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    // ── Numbered step card ──
    // Left border in lesson accent colour
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: stepNumber * 0.08 }}
      className="rounded-xl border border-border bg-bg-surface overflow-hidden"
      style={{ borderLeftWidth: "2px", borderLeftColor: accentHex }}
    >
      <div className="px-5 py-4">
        {/* Step number + title */}
        <div className="mb-3 flex items-center gap-3">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium"
            style={{ background: `${accentHex}25`, color: accentHex }}
          >
            {stepNumber}
          </span>
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </div>

        {/* Formula if present */}
        {formula && (
          <div className="mb-3 rounded-lg border border-border bg-bg-elevated px-4 py-3">
            <MathRenderer formula={formula} display />
          </div>
        )}

        {/* Explanation */}
        <p className="text-sm text-text-secondary">{explanation}</p>

        {/* Why does this work — expandable */}
        {whyNote && (
          <div className="mt-3">
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${showWhy ? "rotate-180" : ""}`}
              />
              Why does this step work?
            </button>
            <AnimatePresence>
              {showWhy && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 overflow-hidden text-xs leading-relaxed text-text-secondary"
                >
                  {whyNote}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

---

### 7.6 `SimulatorSection` — AI input + solution display
**File: `src/components/lesson/SimulatorSection.tsx`**

```typescript
"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw } from "lucide-react";
import { StepCard } from "./StepCard";
import { MathRenderer } from "@/components/shared/MathRenderer";
import { LoadingDots } from "@/components/shared/LoadingDots";

interface SimulatorSectionProps {
  topicTitle: string;
  placeholder: string;    // example question text
  accentHex: string;
  topicSlug: string;
}

interface SolutionStep {
  title: string;
  formula?: string;
  explanation: string;
  whyNote?: string;
}

interface Solution {
  steps: SolutionStep[];
  finalAnswer: string;
  theorem: string;
}

export function SimulatorSection({ topicTitle, placeholder, accentHex, topicSlug }: SimulatorSectionProps) {
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auto-resize textarea as user types ──
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  // ── Submit on Cmd+Enter ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const res = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, topic: topicSlug }),
      });
      if (!res.ok) throw new Error("Solver failed. Please try again.");
      const data = await res.json();
      setSolution(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setSolution(null);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-text-primary">Simulator</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Type any {topicTitle} question — the AI solves it step by step.
          </p>
        </div>
        {solution && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-surface transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New question
          </button>
        )}
      </div>

      {/* ── Input area ── */}
      <div
        className="rounded-xl border bg-bg-surface transition-all duration-200 focus-within:border-opacity-60"
        style={{
          borderColor: question.length > 0 ? `${accentHex}50` : "#1E2333",
        }}
      >
        <textarea
          ref={textareaRef}
          value={question}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none bg-transparent px-5 pt-4 text-sm text-text-primary placeholder-text-muted outline-none"
          style={{ minHeight: "80px", maxHeight: "200px" }}
        />
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <span className="text-xs text-text-muted">Cmd+Enter to solve</span>
          <div className="flex items-center gap-3">
            <span
              className="text-xs"
              style={{ color: question.length > 1800 ? "#F47C7C" : "#4A4F66" }}
            >
              {question.length} / 2000
            </span>
            <button
              onClick={handleSubmit}
              disabled={!question.trim() || loading}
              className="flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition-all disabled:opacity-40"
              style={{
                background: accentHex,
                color: "#06080D",
              }}
            >
              {loading ? <LoadingDots /> : <><Send className="h-3.5 w-3.5" /> Solve</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="rounded-xl border border-accent-coral/30 bg-accent-coral/5 px-5 py-4 text-sm text-accent-coral">
          {error}
        </div>
      )}

      {/* ── Solution output ── */}
      <AnimatePresence>
        {solution && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Which theorem/rule applies */}
            <div
              className="rounded-xl px-5 py-3 text-sm"
              style={{ background: `${accentHex}10`, border: `1px solid ${accentHex}25` }}
            >
              <span className="text-xs font-medium" style={{ color: accentHex }}>
                Applying:
              </span>{" "}
              <span className="text-text-primary">{solution.theorem}</span>
            </div>

            {/* Step-by-step cards */}
            <div className="space-y-3">
              {solution.steps.map((step, i) => (
                <StepCard
                  key={i}
                  stepNumber={i + 1}
                  accentHex={accentHex}
                  {...step}
                />
              ))}
            </div>

            {/* Final answer */}
            <div
              className="rounded-xl px-5 py-5 text-center"
              style={{
                background: `${accentHex}12`,
                border: `1px solid ${accentHex}35`,
              }}
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: accentHex }}>
                Final Answer
              </p>
              <MathRenderer formula={solution.finalAnswer} display />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 7.7 `ProgressTracker` — Shows read/tried badges per topic
**File: `src/components/lesson/ProgressTracker.tsx`**

```typescript
"use client";
import { Check } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface ProgressTrackerProps {
  topicSlug: string;
  accentHex: string;
}

export function ProgressTracker({ topicSlug, accentHex }: ProgressTrackerProps) {
  const { markRead, markTried, isRead, isTried } = useProgress();
  const read = isRead(topicSlug);
  const tried = isTried(topicSlug);

  return (
    // ── Two small badge buttons at top of topic page ──
    <div className="flex items-center gap-3">
      <button
        onClick={() => markRead(topicSlug)}
        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all"
        style={
          read
            ? { borderColor: `${accentHex}40`, color: accentHex, background: `${accentHex}10` }
            : { borderColor: "#1E2333", color: "#4A4F66" }
        }
      >
        {read && <Check className="h-3 w-3" />}
        Library read
      </button>
      <button
        onClick={() => markTried(topicSlug)}
        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all"
        style={
          tried
            ? { borderColor: `${accentHex}40`, color: accentHex, background: `${accentHex}10` }
            : { borderColor: "#1E2333", color: "#4A4F66" }
        }
      >
        {tried && <Check className="h-3 w-3" />}
        Simulator tried
      </button>
    </div>
  );
}
```

---

## 8. State Management

### 8.1 Progress Store
**File: `src/stores/progress.store.ts`**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressStore {
  readTopics:  Set<string>;
  triedTopics: Set<string>;
  markRead:    (slug: string) => void;
  markTried:   (slug: string) => void;
  isRead:      (slug: string) => boolean;
  isTried:     (slug: string) => boolean;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      readTopics:  new Set(),
      triedTopics: new Set(),
      markRead:  (slug) => set((s) => ({ readTopics: new Set([...s.readTopics, slug]) })),
      markTried: (slug) => set((s) => ({ triedTopics: new Set([...s.triedTopics, slug]) })),
      isRead:    (slug) => get().readTopics.has(slug),
      isTried:   (slug) => get().triedTopics.has(slug),
    }),
    { name: "mathcore-progress" }
  )
);
```

---

## 9. API Route — Simulator

### 9.1 Simulator endpoint
**File: `src/app/api/simulator/route.ts`**

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { question, topic } = await req.json();

  if (!question || !topic) {
    return NextResponse.json({ error: "Missing question or topic" }, { status: 400 });
  }

  const systemPrompt = `
You are a precise engineering mathematics tutor for the topic: "${topic}".
Your job is to solve a student's question with crystal-clear step-by-step working.

Respond ONLY with a valid JSON object in this exact structure:
{
  "theorem": "Name of the theorem or rule being applied",
  "steps": [
    {
      "title": "Short name for this step",
      "formula": "LaTeX formula if applicable, otherwise omit this field",
      "explanation": "Plain English explanation of what was done",
      "whyNote": "Optional: deeper reason why this step works"
    }
  ],
  "finalAnswer": "LaTeX formula for the final answer"
}

Rules:
- All formulas must be valid KaTeX-compatible LaTeX
- Explain each step so a first-year engineering student understands it
- Keep step titles short (3–6 words)
- The finalAnswer must be the complete boxed result
- Never include markdown, only pure JSON
`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown fences
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Simulator error:", err);
    return NextResponse.json({ error: "Solver failed. Please try again." }, { status: 500 });
  }
}
```

---

## 10. Hooks

### 10.1 `useProgress`
**File: `src/hooks/useProgress.ts`**

```typescript
import { useProgressStore } from "@/stores/progress.store";
export const useProgress = () => useProgressStore();
```

### 10.2 `useMediaQuery`
**File: `src/hooks/useMediaQuery.ts`**

```typescript
"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

// Usage:
// const isMobile = useMediaQuery("(max-width: 640px)");
```

---

## 11. Utility Functions
**File: `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Merge Tailwind classes safely ──
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Get lesson accent colour by slug ──
export function getLessonAccent(slug: string): string {
  const accents: Record<string, string> = {
    "differential-calculus":  "#A78BFA",
    "integral-calculus":      "#6EE7B7",
    "multivariable-calculus": "#F47C7C",
    "linear-systems":         "#8BACFF",
    "eigen-analysis":         "#F0C27A",
  };
  return accents[slug] ?? "#8BACFF";
}

// ── Truncate text with ellipsis ──
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}
```

---

## 12. Responsive Breakpoints

| Breakpoint | What changes |
|---|---|
| `< 640px` mobile | `MobileBottomNav` replaces `SiteNav` links, `TopicNav` hidden (becomes dropdown), charts full-width stacked |
| `640px–768px` sm | 2-column lesson card grid |
| `768px–1024px` md | `TopicNav` sidebar visible, 2-column content layout |
| `1024px+` lg | Full 3-column lesson grid, wide content area |

**Mobile-specific notes:**
- `GlareCard` glare disabled on touch devices (check `ontouchstart` in window)
- All `framer-motion` animations wrapped in `useReducedMotion()` check
- `TopicNav` becomes a scrollable horizontal chip row on mobile

---

## 13. Error & Loading States

**Every data component follows this three-state pattern:**

```
Loading  → <div className="skeleton h-32 rounded-xl" />
Error    → <EmptyState message="..." retryFn={...} />
Success  → <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>...</motion.div>
```

**Simulator-specific states:**
- Submitting → Button shows `<LoadingDots />`, textarea disabled
- API error → Red coral bordered box with error text
- Empty response → "No solution found. Try rephrasing your question."
- Success → Steps animate in one by one (0.08s stagger)
