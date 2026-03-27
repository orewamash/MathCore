"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlareCard } from "@/components/shared/GlareCard";
import { lessons } from "@/lib/content/lessons";

import Orb from "@/components/effects/Orb";

import MagicBento from "@/components/shared/MagicBento";
import { Book, Cpu, Layers, Calculator, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const lessonIcons = [Book, Layers, Cpu, Calculator, Zap];

export default function LessonsPage() {
  const router = useRouter();

  const bentoCards = lessons.map((lesson, i) => ({
    title: lesson.title,
    description: lesson.description,
    label: `Module ${lesson.number}`,
    color: "#06080D",
    icon: React.createElement(lessonIcons[i % lessonIcons.length], {
      className: "w-6 h-6",
      style: { color: lesson.accentHex }
    }),
    onClick: () => router.push(`/lessons/${lesson.slug}`)
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Orbs */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] pointer-events-none z-0 opacity-20">
        <Orb hue={210} hoverIntensity={0.5} />
      </div>
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] pointer-events-none z-0 opacity-20">
        <Orb hue={280} hoverIntensity={0.8} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-24">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-8"
          >
             <div className="h-px w-12 bg-accent-blue" />
             <span className="text-xs font-black uppercase tracking-[0.3em] text-accent-blue">The Curriculum</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none"
          >
            MASTERY <br/> MODULES
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-2xl text-text-secondary font-bold italic opacity-70 max-w-2xl leading-relaxed"
          >
            A comprehensive sequence of 5 specialized modules engineered for mathematical dominance.
          </motion.p>
        </div>

        {/* MagicBento Grid */}
        <div className="min-h-[600px]">
           <MagicBento 
             cards={bentoCards}
             glowColor="59, 130, 246"
             particleCount={15}
             enableTilt={true}
             clickEffect={true}
           />
        </div>
      </div>
    </div>
  );
}


