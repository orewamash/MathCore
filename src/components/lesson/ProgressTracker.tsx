"use client";
import { Check } from "lucide-react";
import { useProgressStore } from "@/stores/progress.store";

interface ProgressTrackerProps {
  topicSlug: string;
  accentHex: string;
}

export function ProgressTracker({ topicSlug, accentHex }: ProgressTrackerProps) {
  const { markRead, markTried, isRead, isTried } = useProgressStore();
  const read = isRead(topicSlug);
  const tried = isTried(topicSlug);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => markRead(topicSlug)}
        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all"
        style={
          read
            ? { borderColor: `${accentHex}40`, color: accentHex, background: `${accentHex}10` }
            : { borderColor: "#1E2333", color: "#4A4F66" }
        }
      >
        {read && <Check className="h-3 w-3" />}
        Library read
      </button>
      <button
        onClick={() => markTried(topicSlug)}
        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all"
        style={
          tried
            ? { borderColor: `${accentHex}40`, color: accentHex, background: `${accentHex}10` }
            : { borderColor: "#1E2333", color: "#4A4F66" }
        }
      >
        {tried && <Check className="h-3 w-3" />}
        Simulator tried
      </button>
    </div>
  );
}
