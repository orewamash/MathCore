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
