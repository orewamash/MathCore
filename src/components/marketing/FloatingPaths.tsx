import { motion } from "framer-motion";

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M${-200 + i * 50} ${400 + Math.sin(i) * 100} Q${300 + i * 20} ${200 - i * 10} ${700 + i * 40} ${500 + Math.cos(i) * 80}`,
    delay: i * 0.15,
    duration: 6 + Math.random() * 4,
    opacity: 0.04 + (i / 24) * 0.08,
  }));

  return (
    // ── Absolute fill, pointer-events-none so it doesn't block clicks ──
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#8BACFF"
            strokeWidth="0.6"
            fill="none"
            opacity={path.opacity}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: path.opacity }}
            transition={{ duration: path.duration, delay: path.delay, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </svg>
    </div>
  );
}
