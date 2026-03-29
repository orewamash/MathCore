"use client";
import { Check, BookOpen, Cpu } from "lucide-react";
import { useProgressStore } from "@/stores/progress.store";

interface ProgressTrackerProps {
  topicSlug: string;
  accentHex: string;
  onNavigate?: (view: 'library' | 'simulator') => void;
}

export function ProgressTracker({ topicSlug, accentHex, onNavigate }: ProgressTrackerProps) {
  const { markRead, markTried, isRead, isTried } = useProgressStore();
  const read = isRead(topicSlug);
  const tried = isTried(topicSlug);

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
      <button
        onClick={() => { markRead(topicSlug); onNavigate?.('library'); }}
        className="flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold transition-all hover:opacity-80"
        style={
          read
            ? { borderColor: `${accentHex}40`, color: accentHex, background: `${accentHex}10` }
            : { borderColor: "#1E2333", color: "#8F95B2", background: "rgba(255,255,255,0.02)" }
        }
      >
        {read ? <Check className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5 opacity-50" />}
        {read ? "Library Read" : "Open Library"}
      </button>
      <button
        onClick={() => { markTried(topicSlug); onNavigate?.('simulator'); }}
        className="flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold transition-all hover:opacity-80"
        style={
          tried
            ? { borderColor: `${accentHex}40`, color: accentHex, background: `${accentHex}10` }
            : { borderColor: "#1E2333", color: "#8F95B2", background: "rgba(255,255,255,0.02)" }
        }
      >
        {tried ? <Check className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5 opacity-50" />}
        {tried ? "Simulator Tried" : "Open Simulator"}
      </button>
    </div>
  );
}
