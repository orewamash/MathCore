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
