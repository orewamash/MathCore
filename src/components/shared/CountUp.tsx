"use client";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number; // ms, default 1000
  decimals?: number;
  className?: string;
}

export function CountUp({ to, duration = 1000, decimals = 0, className }: CountUpProps) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(parseFloat((eased * to).toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [to, duration, decimals]);

  return <span className={className}>{value.toFixed(decimals)}</span>;
}
