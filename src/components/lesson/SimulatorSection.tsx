"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Cpu, Zap, Sparkles, Info, X } from "lucide-react";
import { StepCard } from "./StepCard";
import { MathRenderer } from "@/components/shared/MathRenderer";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { Folder } from "@/components/effects/Folder";

interface SimulatorSectionProps {
  topicTitle: string;
  placeholder: string;
  accentHex: string;
  topicSlug: string;
}

interface SolutionStep {
  title: string;
  formula?: string;
  explanation: string;
  whyNote?: string;
}

interface Solution {
  steps: SolutionStep[];
  finalAnswer: string;
  theorem: string;
}

export function SimulatorSection({ topicTitle, placeholder, accentHex, topicSlug }: SimulatorSectionProps) {
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"text" | "matrix" | "english">("text");
  const [showHelp, setShowHelp] = useState(false);
  const [matrixEntries, setMatrixEntries] = useState<string[][]>([
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isMatrixTopic = [
    "gauss-jordan", 
    "gauss-elimination", 
    "lu-decomposition", 
    "eigenvalues", 
    "eigenvectors", 
    "cayley-hamilton",
    "jacobi-method",
    "gauss-seidel"
  ].includes(topicSlug);

  const handleMatrixChange = (row: number, col: number, value: string) => {
    const newEntries = [...matrixEntries];
    newEntries[row][col] = value;
    setMatrixEntries(newEntries);
    
    // Convert matrix to a prompt-like string for the AI
    const matrixStr = newEntries
      .map(r => r.join(", "))
      .join(" | ");
    setQuestion(`Solve the following system/matrix given by rows: ${matrixStr}`);
  };

  const addRow = () => {
    const cols = matrixEntries[0].length;
    setMatrixEntries([...matrixEntries, Array(cols).fill("")]);
  };

  const removeRow = () => {
    if (matrixEntries.length > 2) {
      setMatrixEntries(matrixEntries.slice(0, -1));
    }
  };

  const addCol = () => {
    setMatrixEntries(matrixEntries.map(row => [...row, ""]));
  };

  const removeCol = () => {
    if (matrixEntries[0].length > 2) {
      setMatrixEntries(matrixEntries.map(row => row.slice(0, -1)));
    }
  };


  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 300) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const res = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, topic: topicSlug, mode }),
      });
      if (!res.ok) throw new Error("Solver failed. Please try again.");
      const data = await res.json();
      setSolution(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setSolution(null);
    setError(null);
    setMatrixEntries([
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  return (
    <section id="simulator" className="relative py-12">
      {/* Decorative gradients */}
      <div 
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ background: accentHex }}
      />


      
      <div className="relative space-y-10">
        {/* Section heading - MUCH LARGER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase text-blue-400/80">Advanced Simulator V1.2</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
              Solve {topicTitle} <span className="text-blue-400">Instantly.</span>
            </h2>
            <p className="mt-4 text-xl text-text-secondary font-medium italic opacity-80">
              {isMatrixTopic 
                ? "Enter your coefficients into the grid or describe the problem using natural language."
                : "Paste your specific engineering problem below. Our neural engine provides rigorous, step-by-step verification and proof."
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {isMatrixTopic ? (
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setMode("text")}
                  className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === "text" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"}`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setMode("matrix")}
                  className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === "matrix" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"}`}
                >
                  Matrix
                </button>
              </div>
            ) : (
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setMode("text")}
                  className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === "text" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMode("english")}
                  className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${mode === "english" ? "bg-blue-500/20 text-blue-300 shadow-lg" : "text-white/40 hover:text-white/60"}`}
                >
                  Conversational
                </button>
              </div>
            )}
            
            {!isMatrixTopic && mode === "english" && (
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
              >
                <Info className="w-4 h-4" />
                Language Guide
              </button>
            )}
            
            {solution && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleReset}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Engine
              </motion.button>
            )}
          </div>
        </div>

        {/* Input area - LARGE AND PREMIUM */}
        <div
          className="group relative rounded-[40px] border-2 bg-bg-surface/40 backdrop-blur-3xl transition-all duration-700 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
          style={{
            borderColor: question.length > 0 ? `${accentHex}40` : "rgba(255,255,255,0.05)",
            boxShadow: question.length > 0 ? `0 0 100px -30px ${accentHex}20` : "none"
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {mode === "matrix" ? (
              <motion.div 
                key="matrix-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-10 space-y-8"
              >
                <div className="overflow-x-auto pb-4">
                  <div className="flex flex-col gap-3 min-w-max mx-auto">
                    {matrixEntries.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-3">
                        {row.map((cell, cIdx) => (
                          <div key={cIdx} className="relative group/cell">
                             <input
                              type="text"
                              value={cell}
                              onChange={(e) => handleMatrixChange(rIdx, cIdx, e.target.value)}
                              placeholder="0"
                              className={`w-20 h-20 rounded-2xl bg-white/5 border-2 text-center text-xl font-black text-white outline-none transition-all hover:bg-white/10 focus:bg-white/20 ${cIdx === row.length - 1 ? 'border-blue-500/30 ring-1 ring-blue-500/20' : 'border-white/5 focus:border-white/20'}`}
                            />
                            {rIdx === 0 && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-white/20 pointer-events-none">
                                {cIdx === row.length - 1 ? 'const' : `x${cIdx + 1}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex bg-white/5 rounded-xl border border-white/5 p-1">
                    <button 
                      onClick={addRow}
                      className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      + Row
                    </button>
                    <button 
                      onClick={removeRow}
                      className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                      - Row
                    </button>
                  </div>

                  <div className="flex bg-white/5 rounded-xl border border-white/5 p-1">
                    <button 
                      onClick={addCol}
                      className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      + Variable
                    </button>
                    <button 
                      onClick={removeCol}
                      className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                      - Variable
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="text-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full resize-none bg-transparent px-10 pt-10 pb-6 text-2xl font-bold text-white placeholder-white/10 outline-none min-h-[200px] leading-relaxed"
                  style={{ maxHeight: "400px" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          
          <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-8 py-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-text-muted">Pro Input Layer</span>
            </div>
            
            <div className="flex items-center gap-6">
              <span
                className="text-xs font-bold tracking-widest opacity-40"
                style={{ color: question.length > 1800 ? "#F47C7C" : "white" }}
              >
                {question.length} / 2000
              </span>
              <button
                onClick={handleSubmit}
                disabled={!question.trim() || loading}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl px-10 py-4 text-lg font-bold text-[#06080D] transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                style={{ background: accentHex }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                {loading ? (
                  <LoadingDots />
                ) : (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="icon"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 15 }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                    </AnimatePresence>
                    Initiate Solver
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-6 text-xl font-bold text-red-400"
            >
              System Error: {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution output */}
        <AnimatePresence>
          {solution && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 pt-8"
            >
              {/* Applying Rule Badge */}
              <div className="flex flex-col items-center">
                 <div className="h-12 w-px bg-gradient-to-b from-transparent to-blue-400/50 mb-0" />
                 <div
                  className="rounded-full px-8 py-3 text-sm font-bold border-2 backdrop-blur-md"
                  style={{ background: `${accentHex}10`, borderColor: `${accentHex}40`, color: accentHex }}
                >
                  ENGINE STATUS: CALCULATING VIA {solution.theorem.toUpperCase()}
                </div>
              </div>

              {/* Step-by-step wrapped in a large folder or list */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <h3 className="text-2xl font-bold opacity-60">Verification Process</h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                
                <div className="grid gap-6">
                  {solution.steps.map((step, i) => (
                    <StepCard
                      key={i}
                      stepNumber={i + 1}
                      accentHex={accentHex}
                      {...step}
                    />
                  ))}
                </div>
              </div>

              {/* Final answer - HERO SECTION */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative rounded-[40px] px-10 py-16 text-center overflow-hidden border-2"
                style={{
                  background: `${accentHex}05`,
                  borderColor: `${accentHex}30`,
                }}
              >
                {/* Background glow for the final answer */}
                <div 
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
                  style={{ color: accentHex }}
                />
                
                <p className="mb-6 text-sm font-black uppercase tracking-[0.4em]" style={{ color: accentHex }}>
                  Definitive Result
                </p>
                <div className="text-4xl md:text-6xl font-bold text-white">
                  <MathRenderer formula={solution.finalAnswer} display />
                </div>
                
                <div className="mt-10 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-green-400/80 uppercase tracking-widest">Verification Successful</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Conversational Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0D1117] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Conversational Math Guide</h3>
                    <p className="text-sm text-white/40 font-medium">Type math exactly how you speak it.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { eng: "integral of / integrate", sym: "∫", ex: "integrate x squared" },
                    { eng: "limits / with limits", sym: "Limits", ex: "limits 0 to pi" },
                    { eng: "dow / del / partial", sym: "∂", ex: "dow u / dow x" },
                    { eng: "verify / show / prove", sym: "Check", ex: "verify euler theorem for x^3" },
                    { eng: "subject to / constraint", sym: "s.t", ex: "subject to x + y = 10" },
                    { eng: "surface / function", sym: "f(x,y)", ex: "surface given by x^2 + y^2" },
                    { eng: "differentiate / derivative / f'", sym: "d/dx", ex: "differentiate u where u = x^2" },
                    { eng: "theta / delta / beta", sym: "θ / δ / β", ex: "tan(theta)" },
                    { eng: "pi / e / tau (tow)", sym: "Constants", ex: "2 times pi" },
                    { eng: "root of / sqrt", sym: "√", ex: "square root of x" },
                    { eng: "squared / cubed", sym: "x² / x³", ex: "x cubed plus 5" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/60 transition-all group-hover:text-blue-400">{item.eng}</span>
                        <span className="text-lg font-bold text-white/80">{item.sym}</span>
                      </div>
                      <div className="text-xs font-mono text-white/30 italic">Example: "{item.ex}"</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-blue-500/5 border-t border-white/5">
                <p className="text-xs text-blue-300/60 leading-relaxed">
                  <span className="font-bold text-blue-300">Pro Tip:</span> You can mix English and symbols freely! Our engine automatically normalizes your text before solving.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
