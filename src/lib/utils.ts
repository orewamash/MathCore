import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Merge Tailwind classes safely ──
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Get lesson accent colour by slug ──
export function getLessonAccent(slug: string): string {
  const accents: Record<string, string> = {
    "differential-calculus":  "#A78BFA",
    "integral-calculus":      "#6EE7B7",
    "multivariable-calculus": "#F47C7C",
    "linear-systems":         "#8BACFF",
    "eigen-analysis":         "#F0C27A",
  };
  return accents[slug] ?? "#8BACFF";
}

// ── Truncate text with ellipsis ──
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}
