"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MathRenderer } from "@/components/shared/MathRenderer";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  formula?: string;
  text?: string;
}

interface ExampleBlockProps {
  number: number;
  question: string;
  steps: Step[];
  answer: string;
  accentHex: string;
}

export function ExampleBlock({ number, question, steps, answer, accentHex }: ExampleBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    // ── Collapsible worked example ──
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-bg-elevated transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-medium"
            style={{ background: `${accentHex}20`, color: accentHex }}
          >
            {number}
          </span>
          <span className="text-sm text-text-primary">{question}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-5 py-5">
              {/* Steps */}
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="mt-0.5 text-xs text-text-muted">Step {i + 1}</span>
                  <div className="flex-1">
                    <p className="mb-1 text-sm font-medium text-text-primary">{step.label}</p>
                    {step.formula && <MathRenderer formula={step.formula} display />}
                    {step.text && <p className="text-sm text-text-secondary">{step.text}</p>}
                  </div>
                </div>
              ))}
              {/* Final answer box */}
              <div
                className="rounded-lg px-4 py-3 text-center"
                style={{ background: `${accentHex}15`, border: `1px solid ${accentHex}30` }}
              >
                <p className="mb-1 text-xs" style={{ color: accentHex }}>Answer</p>
                <MathRenderer formula={answer} display />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
