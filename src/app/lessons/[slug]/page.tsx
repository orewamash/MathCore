"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getLessonBySlug } from "@/lib/content/lessons";
import { GlareCard } from "@/components/shared/GlareCard";
import { ArrowRight } from "lucide-react";

import Orb from "@/components/effects/Orb";

export default function LessonOverviewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-secondary">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Decorative Orb */}
      <div className="fixed top-1/2 -right-40 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0 opacity-20">
        <Orb hue={parseInt(lesson.accentHex.slice(1, 4), 16) % 360} hoverIntensity={0.6} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Link href="/lessons" className="mb-4 inline-block text-sm text-text-muted hover:text-text-secondary transition-colors">
          ← All Lessons
        </Link>
        <div className="flex items-center gap-4">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-medium"
            style={{ background: `${lesson.accentHex}20`, color: lesson.accentHex }}
          >
            {lesson.number}
          </span>
          <div>
            <h1 className="font-display text-4xl text-text-primary">{lesson.title}</h1>
            <p className="mt-1 text-text-secondary">{lesson.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Topics grid */}
      <div className="space-y-4">
        {lesson.topics.map((topic, i) => (
          <motion.div
            key={topic.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/lessons/${slug}/${topic.slug}`}>
              <GlareCard
                glareColor={lesson.accentHex}
                className="group flex items-center justify-between p-5 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium"
                    style={{ background: `${lesson.accentHex}20`, color: lesson.accentHex }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-base font-medium text-text-primary group-hover:text-white transition-colors">
                    {topic.title}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-text-primary transition-colors" />
              </GlareCard>
            </Link>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}

