import { MathRenderer } from "@/components/shared/MathRenderer";

interface FormulaCardProps {
  title: string;
  formula: string;
  accentHex: string;
  note?: string;
}

export function FormulaCard({ title, formula, accentHex, note }: FormulaCardProps) {
  return (
    // ── Highlighted card for key formula ──
    // Background: bg-bg-surface | Left accent border in lesson colour
    <div
      className="rounded-xl border border-border bg-bg-surface p-5"
      style={{ borderLeftWidth: "3px", borderLeftColor: accentHex }}
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: accentHex }}>
        {title}
      </p>
      {/* Large centred formula */}
      <div className="py-3 text-center text-text-primary">
        <MathRenderer formula={formula} display />
      </div>
      {note && (
        <p className="mt-3 text-sm text-text-secondary">{note}</p>
      )}
    </div>
  );
}
