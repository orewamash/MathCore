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
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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

              <div className="pt-8 border-t border-white/5 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 font-mono uppercase tracking-wider opacity-70">Overview</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {topic.plainEnglish}
                  </p>
                </div>

                <div className="p-4 rounded-xl relative overflow-hidden group border border-white/5">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundColor: lesson.accentHex }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-60" style={{ color: lesson.accentHex }}>Intuition</span>
                  <p className="text-xs text-text-muted leading-relaxed relative z-10">{topic.intuition}</p>
                </div>

                <div className="pt-2">
                  <ProgressTracker 
                    topicSlug={topicSlug} 
                    accentHex={lesson.accentHex} 
                    onNavigate={(view) => {
                      document.getElementById(`${view}-view`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  />
                </div>
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
              <p className="text-2xl text-text-secondary font-bold italic opacity-70 max-w-2xl leading-relaxed mb-8">
                Unlock the mastery of {topic.title} through our interactive neural simulator and verified library.
              </p>
            </header>

            {/* Input Types Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
              <div className="p-5 rounded-xl bg-black/20 border border-white/5 transition-colors hover:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400/80" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Manual Form</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Use this for direct notation (e.g., <code className="text-white/60 bg-white/5 px-1 py-0.5 rounded font-mono">f(x) = x^2 on [0,2]</code>). Perfect for quick, rigorous mathematical evaluation.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/20 border border-white/5 transition-colors hover:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400/80" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Conversational</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Type naturally as you speak (e.g., &quot;verify rolles theorem for x squared&quot;). Ideal for translating engineering paragraphs directly.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/20 border border-white/5 transition-colors hover:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Matrix Grid</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  A visual grid automatically available for linear algebra topics. Effortlessly adjust coefficients without rigid array syntax rules.
                </p>
              </div>
            </div>

            {/* PRIORITY 1: Simulator Section */}
            <div id="simulator-view" className="scroll-mt-24">
              <SimulatorSection
                topicTitle={topic.title}
                placeholder={topic.simulatorPlaceholder}
                accentHex={lesson.accentHex}
                topicSlug={topicSlug}
              />
            </div>

            {/* NEW: Mathematical Foundations (Above Library) */}
            <div className="space-y-8 pt-12">
               <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black text-white tracking-tight">Mathematical Foundation</h3>
                  <div className="h-px flex-1 bg-white/5" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: lesson.accentHex }} />
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 block">Formal Statement</h4>
                   <div className="text-lg overflow-x-auto pb-2 custom-scrollbar">
                     <BlockMath math={topic.formalStatement} />
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="p-6 rounded-xl bg-[#0a0f12]/80 border border-white/5">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 block">Required Conditions</h4>
                     <ul className="space-y-2">
                       {topic.conditions.map((condition, i) => (
                         <li key={i} className="flex gap-2 text-sm text-text-secondary">
                           <span style={{ color: lesson.accentHex }}>•</span> {condition}
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div className="p-6 rounded-xl bg-[#120a0a]/80 border border-red-500/10">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3 block">Common Mistakes & Pitfalls</h4>
                     <ul className="space-y-2">
                       {topic.commonMistakes.map((mistake, i) => (
                         <li key={i} className="flex gap-2 text-sm text-text-secondary">
                           <span className="text-red-500">⚠</span> {mistake}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               </div>
            </div>

            {/* PRIORITY 2: Library/Theory wrapped in Folder component */}
            <div id="library-view" className="space-y-8 scroll-mt-24 pt-12">
               <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black text-white tracking-tight">Open Research Notes & Proofs</h3>
                  <div className="h-px flex-1 bg-white/5" />
               </div>

               <Folder 
                 title="Verified Step-by-Step Executions"
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
