"use client";

import { HeroSection } from "@/components/marketing/HeroSection";
import { LessonsGrid } from "@/components/marketing/LessonsGrid";
import { motion } from "framer-motion";
import { BookOpen, Cpu, BarChart3 } from "lucide-react";

import { useRouter } from "next/navigation";

const features = [
  {
    slug: "library",
    icon: BookOpen,
    title: "Complete Library",
    description: "Every concept explained in plain English with intuition, formulas, and worked examples.",
    accent: "#8BACFF",
  },
  {
    slug: "simulator",
    icon: Cpu,
    title: "AI Simulator",
    description: "Type any maths problem — get a structured step-by-step solution with explanations.",
    accent: "#6EE7B7",
  },
  {
    slug: "progress",
    icon: BarChart3,
    title: "Track Progress",
    description: "Mark topics as read and practiced. Know exactly where you stand before the exam.",
    accent: "#F0C27A",
  },
];

import Galaxy from "@/components/effects/Galaxy";

import MagicBento from "@/components/shared/MagicBento";
import React from "react";

export default function HomePage() {
  const router = useRouter();

  const bentoFeatures = features.map((f, i) => ({
    title: f.title,
    description: f.description,
    label: "Core Capability",
    color: "#06080D",
    onClick: () => router.push(`/features/${f.slug}`),
    icon: React.createElement(f.icon, {
      className: "w-6 h-6",
      style: { color: f.accent }
    }),
  }));

  return (
    <main className="relative overflow-x-hidden">
      {/* Galaxy Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <Galaxy 
          density={1.8}
          speed={0.6}
          glowIntensity={0.8}
          twinkleIntensity={0.6}
        />
      </div>
      
      <div className="relative z-10">
        <HeroSection />

        {/* How it Works / Features Section */}
        <section id="how-it-works" className="mx-auto max-w-[1400px] px-8 py-32">
          <div className="mb-24">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-4 mb-8"
             >
                <div className="h-px w-12 bg-accent-blue" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-accent-blue">The Framework</span>
             </motion.div>
             <motion.h2
               initial={{ opacity: 0, y: 12 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none"
             >
               ENGINEERED <br/> FOR CLARITY
             </motion.h2>
          </div>

          <div className="min-h-[600px]">
             <MagicBento 
               cards={bentoFeatures}
               glowColor="59, 130, 246"
               particleCount={20}
               enableTilt={true}
               clickEffect={true}
               enableMagnetism={true}
             />
          </div>
        </section>

        <LessonsGrid />
      </div>
    </main>
  );
}

