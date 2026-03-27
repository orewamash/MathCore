"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getLessonBySlug } from "@/lib/content/lessons";
import { getTopicContent } from "@/lib/content/topics";
import { TopicNav } from "@/components/lesson/TopicNav";
import { LibrarySection } from "@/components/lesson/LibrarySection";
import { SimulatorSection } from "@/components/lesson/SimulatorSection";
import { ProgressTracker } from "@/components/lesson/ProgressTracker";
import LiquidEther from "@/components/effects/LiquidEther";
import SplitText from "@/components/effects/SplitText";
import { Folder } from "@/components/effects/Folder";

export default function TopicPage() {
  const params = useParams();
  const lessonSlug = params.slug as string;
  const topicSlug = params.topic as string;

  const lesson = getLessonBySlug(lessonSlug);
  const topic = getTopicContent(topicSlug);

  if (!lesson || !topic) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-secondary font-bold">Topic not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-base overflow-hidden">
      {/* Dynamic Background Animation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <LiquidEther 
          colors={[lesson.accentHex, "#5227FF", "#06080D"]}
          autoDemo={true}
          autoSpeed={0.4}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-12">
        {/* Breadcrumb - Enhanced */}
        <div className="mb-12 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
          <Link href="/lessons" className="hover:text-white transition-colors">Engineering Math 1</Link>
          <span className="opacity-20">/</span>
          <Link 
            href={`/lessons/${lessonSlug}`} 
            className="hover:text-white transition-colors"
            style={{ color: lesson.accentHex }}
          >
            {lesson.title}
          </Link>
          <span className="opacity-20">/</span>
          <span className="text-white">{topic.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left sidebar nav - Hidden on mobile if needed, but let's keep it for now */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="sticky top-12 space-y-8">
               <TopicNav
                lessonSlug={lessonSlug}
                topics={lesson.topics}
                accentHex={lesson.accentHex}
              />
              <div className="pt-8 border-t border-white/5">
                <ProgressTracker topicSlug={topicSlug} accentHex={lesson.accentHex} />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-24">
            
            {/* Header with SplitText Animation */}
            <header className="max-w-4xl">
              <span 
                className="inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-6 border"
                style={{ borderColor: `${lesson.accentHex}40`, color: lesson.accentHex }}
              >
                Module {lesson.number} • Topic Specialist
              </span>
              <div className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">
                <SplitText 
                  text={topic.title}
                  delay={40}
                  splitType="chars"
                  textAlign="left"
                />
              </div>
              <p className="text-2xl text-text-secondary font-bold italic opacity-70 max-w-2xl leading-relaxed">
                Unlock the mastery of {topic.title} through our interactive neural simulator and verified library.
              </p>
            </header>

            {/* PRIORITY 1: Simulator Section (Now at the top) */}
            <SimulatorSection
              topicTitle={topic.title}
              placeholder={topic.simulatorPlaceholder}
              accentHex={lesson.accentHex}
              topicSlug={topicSlug}
            />

            {/* PRIORITY 2: Library/Theory wrapped in Folder component */}
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black text-white tracking-tight">Theory & Foundations</h3>
                  <div className="h-px flex-1 bg-white/5" />
               </div>

               <Folder 
                 title="Open Research Notes & Proofs"
                 className="!bg-black/20"
               >
                 <div className="py-8">
                   <LibrarySection topic={topic} accentHex={lesson.accentHex} />
                 </div>
               </Folder>
            </div>

            {/* Footer space */}
            <footer className="pt-24 pb-12 opacity-20 text-center">
               <p className="text-xs font-bold tracking-widest uppercase">MathCore Theoretical Systems • 2026</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
