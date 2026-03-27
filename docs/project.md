# MathCore — Engineering Mathematics 1
## Project Overview

---

## What Is MathCore?

MathCore is a web-based learning platform for Engineering Mathematics 1. It is two things at once:

- **A Library** — Every concept is explained in plain English with theory, intuition, worked examples, and common mistakes. Students read and understand here.
- **A Simulator** — Every topic has an AI-powered input box. The student types a real exam question, and the system returns a full step-by-step solution with explanations at each step.

Both layers live inside every topic page. Students move freely between reading and solving.

---

## The 5 Lessons

### Lesson 1 — Differential Calculus
**Colour accent: Purple (#A78BFA)**

Topics covered:
- Rolle's Theorem
- Lagrange Mean Value Theorem (LMVT)

What this lesson does: Teaches the *conditions*, *conclusions*, and *geometric meaning* of both theorems. Uses the classic "car on a highway" real-world analogy for LMVT. The simulator verifies conditions for any given function, finds the value of `c`, and explains what it means geometrically.

---

### Lesson 2 — Integral Calculus
**Colour accent: Teal (#6EE7B7)**

Topics covered:
- Integration by Parts
- Bernoulli's Formula
- Double Integration (to find area)
- Triple Integration (to find volume)

What this lesson does: The most technique-heavy lesson. The library includes a decision flowchart — "when do you use which method?" Bernoulli's formula gets its own ILATE pattern table. The simulator handles nested integrals, evaluating layer by layer and naming each substitution.

---

### Lesson 3 — Multivariable Calculus
**Colour accent: Coral (#F47C7C)**

Topics covered:
- Euler's Theorem (homogeneous functions)
- Jacobian Theorem
- Maxima and Minima of Two Variables
- Lagrange Multiplier Method

What this lesson does: Largest lesson on the site. Euler's theorem covers homogeneous functions in depth. Jacobian is explained as a "scaling factor for coordinate transformations." Maxima/Minima includes saddle point detection and a 3D surface sketch. Lagrange multiplier is framed with real-world problems like "maximise area given fixed perimeter."

---

### Lesson 4 — Linear Systems of Equations
**Colour accent: Blue (#8BACFF)**

Topics covered:
- Gauss Elimination
- Gauss-Jordan Method
- LU Decomposition

What this lesson does: All three methods are demonstrated on the *same* system of equations so students can compare approaches side by side. The simulator is matrix-based — students enter coefficients, and the AI displays the augmented matrix and performs row operations one at a time, labelling each step (e.g. "R2 → R2 − 2R1"). LU decomposition shows L and U matrices being built simultaneously.

---

### Lesson 5 — Eigen Analysis
**Colour accent: Amber (#F0C27A)**

Topics covered:
- Eigenvalues
- Eigenvectors
- Cayley-Hamilton Theorem

What this lesson does: The library explains eigenvalues as "directions a matrix doesn't rotate, only stretches." The simulator accepts any 2×2 or 3×3 matrix, builds the characteristic equation, solves it, and finds eigenvectors with full working. Cayley-Hamilton has a dedicated verification tool — student inputs a matrix and the AI shows that substituting it into its own characteristic polynomial gives zero.

---

## Every Topic Page Structure

Each topic (e.g., Euler's Theorem) has two scrollable sections:

### Library Section
- Plain English definition before any formula
- Formal mathematical statement with proper notation
- Physical or geometric intuition — *why* this theorem exists
- 2–3 worked examples, from simple to exam-level, shown step by step
- "Common mistakes" box in amber highlight
- Quick-reference formula card (copyable, bookmarkable)

### Simulator Section
- Input box: student types their question in natural language
- AI returns a structured solution:
  - Which rule/theorem applies and why
  - Full working shown line by line
  - Each intermediate step named and explained
  - Final answer in a highlighted box
- "Why does this step work?" expandable note on every step
- "Try a variation" button that generates a slightly different problem

---

## Key Features

**Formula Rendering** — KaTeX is used for all mathematical notation. Equations look sharp and professional, not plain text.

**Progress Tracking** — Each sub-topic has two checkmarks: "Library read ✓" and "Simulator tried ✓". Students can see exactly where they've been.

**Search** — Site-wide search. Typing "saddle point" or "homogeneous function" takes the student directly to the right section.

**Mobile-first** — The simulator input and step-by-step output work cleanly on small screens. Students can practise anywhere.

**Keyboard Shortcuts** — Power users can navigate fast: `L1`–`L5` jump to lessons, `Cmd+Enter` submits a problem, `Escape` closes panels.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Animations | Framer Motion + Lenis |
| Math Rendering | KaTeX |
| AI (Simulator) | Anthropic Claude via API |
| State Management | Zustand |
| Fonts | DM Serif Display (headings) · Syne (body) · Geist Mono (code/math) |

---

## Colour System

| Lesson | Name | Hex |
|---|---|---|
| 1 | Purple | `#A78BFA` |
| 2 | Teal | `#6EE7B7` |
| 3 | Coral | `#F47C7C` |
| 4 | Blue | `#8BACFF` |
| 5 | Amber | `#F0C27A` |
| Background base | — | `#06080D` |
| Background surface | — | `#0C0F1A` |
| Background elevated | — | `#131720` |
| Border | — | `#1E2333` |
| Text primary | — | `#E8EAF2` |

---

## Site Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, feature highlights, lesson preview |
| `/lessons` | All 5 lessons overview grid |
| `/lessons/[slug]` | Individual lesson page with sub-topic nav |
| `/lessons/[slug]/[topic]` | Topic page — Library + Simulator |
| `/search` | Full-text search across all content |
| `/login` | Auth page |
| `/signup` | Signup page |

---

## Design Philosophy

The site looks like a focused study tool, not a textbook or a generic tutorial site. Dark background, clean typography, colour-coded per lesson so students always know where they are. The AI is not hidden — it is the main feature. The simulator is front and centre on every topic page, not buried in a sidebar.
