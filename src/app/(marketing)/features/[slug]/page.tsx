"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Cpu, BarChart3, ChevronRight } from "lucide-react";
import Galaxy from "@/components/effects/Galaxy";
import SplitText from "@/components/effects/SplitText";
import { motion } from "framer-motion";

const featureData: Record<string, any> = {
  "library": {
    title: "Complete Library",
    icon: BookOpen,
    accent: "#8BACFF",
    tagline: "Your Personal Mathematics Encyclopaedia",
    description: "Our comprehensive library strips away the intimidating jargon of traditional textbooks, explaining 16 complex engineering mathematics topics using pure, intuitive English alongside rigorous formal notation.",
    benefits: [
      "Plain English breakdowns connecting equations to physical concepts.",
      "Beautifully rendered LaTeX formal definitions.",
      "Clear conditions highlighting when theorems apply (and when they fail).",
      "List of common pitfalls to keep you from losing marks in exams.",
      "Step-by-step examples directly mapped to simulator outputs."
    ]
  },
  "simulator": {
    title: "Neural Simulator",
    icon: Cpu,
    accent: "#6EE7B7",
    tagline: "100% Offline Algorithmic Execution Engine",
    description: "Not just an answer key. The Neural Simulator acts as an interactive tutor, accepting conversational English, raw mathematical notation, or interactive grids, and breaking down the complex calculation into logical, step-by-step proofs.",
    benefits: [
      "NLP Engine parsing natural English logic automatically.",
      "Zero AI Hallucination—guaranteed mathematical accuracy.",
      "Tracks and understands context-specific variables (like time 't').",
      "Dynamic Grid specifically built for high-dimensional matrix operations.",
      "Interactive Step-by-Step execution rather than immediate solutions."
    ]
  },
  "progress": {
    title: "Progress Tracking",
    icon: BarChart3,
    accent: "#F0C27A",
    tagline: "Know exactly where you stand.",
    description: "Don't go into your exams blind. MathCore's integrated tracking system visually gauges your proficiency by analyzing which modules you've studied and which simulators you've mastered.",
    benefits: [
      "Visual lesson grids showcasing your progress across 5 modules.",
      "Detailed distinctions between 'Library Read' and 'Simulator Tried'.",
      "Persistent state ensuring you don't lose track of your studying.",
      "Intuitive UI motivating completionism across challenging topics.",
      "Data-driven insights guiding your final exam reviews."
    ]
  }
};

export default function FeaturePage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = featureData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base text-white">
        Feature not found.
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-base">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <Galaxy 
          density={1.5}
          speed={0.4}
          glowIntensity={0.6}
          twinkleIntensity={0.8}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-8 py-24">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors mb-16"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Framework
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-lg"
                style={{ boxShadow: `0 0 30px ${data.accent}20` }}
              >
                <Icon className="w-8 h-8" style={{ color: data.accent }} />
              </div>
              <span 
                className="text-xs font-black uppercase tracking-[0.3em]"
                style={{ color: data.accent }}
              >
                Core Capability
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              <SplitText text={data.title} delay={40} splitType="chars" textAlign="left" />
            </h1>
            
            <p className="text-2xl font-bold italic text-text-secondary pr-8">
              "{data.tagline}"
            </p>
            
            <p className="text-lg text-text-muted leading-relaxed max-w-2xl bg-black/20 p-6 rounded-xl border border-white/5">
              {data.description}
            </p>
          </div>

          <div className="w-full lg:w-[450px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Key Benefits</h3>
              <ul className="space-y-4">
                {data.benefits.map((benefit: string, index: number) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="flex items-start gap-3"
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${data.accent}20`, color: data.accent }}
                    >
                      <ChevronRight className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-text-secondary font-medium leading-relaxed">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-12">
                <Link 
                  href="/lessons"
                  className="w-full flex items-center justify-center py-4 rounded-xl text-black font-black uppercase tracking-widest text-xs transition-transform hover:scale-105"
                  style={{ backgroundColor: data.accent }}
                >
                  Explore the Platform
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
