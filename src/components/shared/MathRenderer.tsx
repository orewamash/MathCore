"use client";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  formula: string;
  display?: boolean; // true = block (centred), false = inline
  className?: string;
}

export function MathRenderer({ formula, display = false, className }: MathRendererProps) {
  return (
    <span className={className}>
      {display
        ? <BlockMath math={formula} />
        : <InlineMath math={formula} />
      }
    </span>
  );
}
