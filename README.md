# MathCore

A premium Next.js platform for **Engineering Mathematics 1** that pairs a complete theory **Library** with an **AI Simulator** for step-by-step problem solving. Spanning five modules — from Differential Calculus to Eigen Analysis — with a sleek, color-coded dark design, KaTeX-rendered math, and a fully offline algorithmic solver engine.

## Modules

| Module | Accent | Topics |
|--------|--------|--------|
| Differential Calculus | `#A78BFA` | Rolle's Theorem, Lagrange Mean Value Theorem (LMVT) |
| Integral Calculus | `#6EE7B7` | Integration by Parts, Bernoulli's Formula, Double Integration, Triple Integration |
| Multivariable Calculus | `#F47C7C` | Euler's Theorem, Jacobian, Maxima & Minima of Two Variables, Lagrange Multiplier |
| Linear Systems | `#8BACFF` | Gauss Elimination, Gauss-Jordan Method, LU Decomposition |
| Eigen Analysis | `#F0C27A` | Eigenvalues, Eigenvectors, Cayley-Hamilton Theorem |

Each topic page combines three layers:

- **Simulator** — type a problem in plain text, conversational English, or a visual matrix grid and get a step-by-step solution with KaTeX-rendered formulas and explanations.
- **Mathematical Foundation** — the formal statement, required conditions, geometric/physical intuition, and a "Common Mistakes & Pitfalls" panel.
- **Library** — plain-English theory with collapsible worked examples.

## The Simulator

The solver engine is **deterministic-first**: every topic has a strict rule-based solver built on `mathjs`. The AI never produces the answer — it only translates.

1. A rule-based solver (`solveRollesTheorem`, `solveLMVT`, `solveGaussJordan`, `solveEigenvalues`, ...) parses your input directly.
2. If parsing fails, **Google Gemini 2.0 Flash** translates a conversational word problem (e.g. "verify rolles theorem for x squared") into a normalized math string, and the algorithmic solver re-runs.
3. Otherwise the input is matched against curated worked examples.

Every step is returned as `{ theorem, steps: [{ title, formula?, explanation, whyNote? }], finalAnswer }` with all formulas as LaTeX for KaTeX.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| AI | Vercel AI SDK v6 + Google Gemini 2.0 Flash (`@ai-sdk/google`) |
| Math rendering | KaTeX (`react-katex`) |
| Solver engine | mathjs |
| 3D / WebGL | three.js, OGL (galaxy & orb backgrounds) |
| Animation | GSAP + Framer Motion + Lenis (smooth scroll) |
| Styling | Tailwind CSS v4, shadcn-style Radix / Base UI primitives |
| State | Zustand (persisted progress via localStorage) |

## Getting Started

```bash
git clone https://github.com/orewamash/MathCore.git
cd MathCore
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local`:

```bash
# Optional: enables AI translation of conversational word problems in the simulator.
# Matrix/linear-algebra topics still solve algorithmically without it.
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Pages

- `/` — marketing homepage with the module grid and feature cards
- `/features/[slug]` — deep-dives into the Library, Simulator, and Progress features
- `/lessons` — the five "Mastery Modules"
- `/lessons/[slug]/[topic]` — topic pages with Simulator, Foundation, and Library
- `/search` — client-side full-text search across every topic
