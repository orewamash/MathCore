import { FormulaCard } from "./FormulaCard";
import { ExampleBlock } from "./ExampleBlock";

interface LibrarySectionProps {
  topic: {
    title: string;
    plainEnglish: string;       // definition in plain words
    intuition: string;          // geometric / physical "why"
    formalStatement: string;    // LaTeX formula
    conditions: string[];       // list of conditions
    commonMistakes: string[];   // list of mistakes
    examples: any[];            // ExampleBlock props
  };
  accentHex: string;
}

export function LibrarySection({ topic, accentHex }: LibrarySectionProps) {
  return (
    <div className="space-y-10">
      {/* ── What it is ── */}
      <section>
        <h2 className="mb-4 font-display text-3xl text-text-primary">{topic.title}</h2>
        <p className="text-base leading-relaxed text-text-secondary">{topic.plainEnglish}</p>
      </section>

      {/* ── The formula ── */}
      <FormulaCard
        title="Formula"
        formula={topic.formalStatement}
        accentHex={accentHex}
      />

      {/* ── Conditions ── */}
      <section>
        <h3 className="mb-3 text-base font-medium text-text-primary">Conditions</h3>
        <ul className="space-y-2">
          {topic.conditions.map((c, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accentHex }}
              />
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Intuition box ── */}
      <section className="rounded-xl border border-border bg-bg-elevated px-5 py-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">Intuition</p>
        <p className="text-sm leading-relaxed text-text-secondary">{topic.intuition}</p>
      </section>

      {/* ── Worked examples ── */}
      <section>
        <h3 className="mb-4 text-base font-medium text-text-primary">Worked Examples</h3>
        <div className="space-y-3">
          {topic.examples.map((ex, i) => (
            <ExampleBlock key={i} number={i + 1} accentHex={accentHex} {...ex} />
          ))}
        </div>
      </section>

      {/* ── Common mistakes ── */}
      <section>
        {/* Amber warning box */}
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber/5 px-5 py-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent-amber">
            Common mistakes
          </p>
          <ul className="space-y-2">
            {topic.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-amber" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
