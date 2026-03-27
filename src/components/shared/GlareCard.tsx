"use client";
import { useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;   // default "#8BACFF"
  glareOpacity?: number; // default 0.12
  disabled?: boolean;    // disables on touch devices
}

export function GlareCard({
  children,
  className,
  glareColor = "#8BACFF",
  glareOpacity = 0.12,
  disabled = false,
}: GlareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glare-x", `${x}%`);
    card.style.setProperty("--glare-y", `${y}%`);
    card.style.setProperty("--glare-opacity", String(glareOpacity));
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.setProperty("--glare-opacity", "0");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-bg-surface transition-all duration-200",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
        "before:opacity-[var(--glare-opacity,0)] before:transition-opacity before:duration-300",
        className
      )}
      style={{
        "--glare-color": glareColor,
      } as React.CSSProperties}
    >
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), ${glareColor}, transparent 60%)`,
          opacity: "var(--glare-opacity, 0)",
        }}
      />
      {children}
    </div>
  );
}
