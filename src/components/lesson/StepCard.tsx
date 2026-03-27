"use client";
import { useState } from "react";
import { ChevronDown, Info, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MathRenderer } from "@/components/shared/MathRenderer";

interface StepCardProps {
  stepNumber: number;
  title: string;
  formula?: string;
  explanation: string;
  whyNote?: string;
  accentHex: string;
}

export function StepCard({ stepNumber, title, formula, explanation, whyNote, accentHex }: StepCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepNumber * 0.1 }}
      className="group relative rounded-3xl border border-white/10 bg-[#0F121D] overflow-hidden hover:border-white/20 transition-all duration-300 shadow-xl"
    >
      {/* Decorative side accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ background: accentHex }}
      />

      <div className="p-8">
        {/* Header: Step Number + Title */}
        <div className="mb-6 flex items-baseline gap-4">
          <span
            className="text-4xl font-black italic opacity-20 select-none tracking-tighter"
            style={{ color: accentHex }}
          >
            {stepNumber.toString().padStart(2, '0')}
          </span>
          <h4 className="text-2xl font-bold text-white tracking-tight">{title}</h4>
          <div className="ml-auto">
             <CheckCircle2 className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: accentHex }} />
          </div>
        </div>

        {/* Formula Section - LARGE AND CLEAR */}
        {formula && (
          <motion.div 
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="mb-6 rounded-2xl border border-white/5 bg-white/[0.03] p-8 shadow-inner"
          >
            <div className="text-2xl">
              <MathRenderer formula={formula} display />
            </div>
          </motion.div>
        )}

        {/* Explanation - BOLD AND READABLE */}
        <p className="text-xl leading-relaxed text-text-secondary font-medium italic mb-6">
          {explanation}
        </p>

        {/* Expandable "Why" Section - PREMIUM TOGGLE */}
        {whyNote && (
          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
              style={{ color: showWhy ? 'white' : `${accentHex}aa` }}
            >
              <div className={`p-1 rounded-full border border-current transition-transform duration-300 ${showWhy ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-3 w-3" />
              </div>
              Theoretical Foundation
            </button>
            <AnimatePresence>
              {showWhy && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-lg leading-relaxed text-blue-100/70 font-medium italic">
                      {whyNote}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
