import * as math from 'mathjs';

interface SolutionStep {
  title: string;
  formula?: string;
  explanation: string;
  whyNote?: string;
}

interface Solution {
  theorem: string;
  steps: SolutionStep[];
  finalAnswer: string;
}

// ─── Numeric Utilities ───
function findCP(fx: string, fy: string): { x: number, y: number }[] {
  // Simple grid search for critical points in common engineering domains
  const points: { x: number, y: number }[] = [];
  const range = 5;
  const step = 0.5;
  for (let x = -range; x <= range; x += step) {
    for (let y = -range; y <= range; y += step) {
      try {
        const valX = math.evaluate(fx, { x, y });
        const valY = math.evaluate(fy, { x, y });
        if (Math.abs(valX) < 0.1 && Math.abs(valY) < 0.1) {
          // Refine with bisection or similar would be better, but let's just push unique-ish points
          const rounded = { x: Math.round(x*2)/2, y: Math.round(y*2)/2 };
          if (!points.some(p => p.x === rounded.x && p.y === rounded.y)) {
            points.push(rounded);
          }
        }
      } catch {}
    }
  }
  return points;
}

function normalizeMathString(str: string, isConversational = false): string {
  let res = str
    .replace(/₀|₊/g, '0').replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3')
    .replace(/₄/g, '4').replace(/₅/g, '5').replace(/₆/g, '6').replace(/₇/g, '7')
    .replace(/₈/g, '8').replace(/₉/g, '9')
    .replace(/⁰/g, '0').replace(/¹/g, '1').replace(/²/g, '2').replace(/³/g, '3')
    .replace(/⁴/g, '4').replace(/⁵/g, '5').replace(/⁶/g, '6').replace(/⁷/g, '7')
    .replace(/⁸/g, '8').replace(/⁹/g, '9')
    .replace(/⋅|·/g, '*')
    .replace(/−/g, '-');

  if (isConversational) {
    res = res
      .replace(/\btimes\b|\bmultiplied by\b/gi, '*')
      .replace(/\bminus\b/gi, '-')
      .replace(/\bplus\b/gi, '+')
      .replace(/\bdivided by\b/gi, '/')
      .replace(/\bsquared\b/gi, '^2')
      .replace(/\bcubed\b/gi, '^3')
      .replace(/\bto the power of\b/gi, '^')
      .replace(/\bsquare root of\b|\bsqrt of\b/gi, 'sqrt')
      .replace(/\bpi\b/gi, '3.14159')
      .replace(/\btow\b/gi, 'tau')
      .replace(/\bdow\b|\bpartial\b/gi, 'd')
      .replace(/\bdelta\b/gi, 'delta')
      .replace(/\btheta\b/gi, 'theta')
      .replace(/\bgamma\b/gi, 'gamma')
      .replace(/\bbeta\b/gi, 'beta')
      .replace(/\bintegral of\b|\bintegral from\b/gi, '∫')
      .replace(/\bdifferentiate\b|\bderivative of\b|\bdifferentiation of\b/gi, '')
      .replace(/\bsquare\b/gi, '^2')
      .replace(/\bcube\b/gi, '^3')
      .replace(/\bzero\b/gi, '0')
      .replace(/\bone\b/gi, '1')
      .replace(/\btwo\b/gi, '2')
      .replace(/\bthree\b/gi, '3')
      .replace(/\bfour\b/gi, '4')
      .replace(/\bfive\b/gi, '5')
      .replace(/\bsix\b/gi, '6')
      .replace(/\bseven\b/gi, '7')
      .replace(/\beight\b/gi, '8')
      .replace(/\bnine\b/gi, '9')
      .replace(/\bten\b/gi, '10')
      .replace(/\beleven\b/gi, '11')
      .replace(/\btwelve\b/gi, '12')
      .replace(/\bis defined as\b|\bis given by\b|\bequals\b|\bis equal to\b/gi, '=')
      .replace(/\band\b/gi, ',');
  }

  return res.replace(/(\d)([a-z\(])/gi, '$1*$2');
}

function numericIntegrate(func: (x: number) => number, a: number, b: number, steps = 40): number {
  const h = (b - a) / steps;
  let sum = (func(a) + func(b)) / 2;
  for (let i = 1; i < steps; i++) sum += func(a + i * h);
  return sum * h;
}

// ─── LMVT (Lagrange Mean Value Theorem) ───
export function solveLMVT(question: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    // Flatten multi-line input — newlines break regex .+? matching
    const q = normalizeMathString(question.replace(/\r?\n+/g, ' '), isConv);
    const funcMatch = q.match(/(?:[a-zA-Z]\([a-z]\)\s*=\s*|equation\s*(?:is|=)\s*|function\s*(?:is|=)\s*|given\s*by\s*=?\s*|=)\s*(.+?)(?:\s+on|\s+in|\s+between|\s+from|\s+where|\.\s+|\.$|$)/i);
                      
    // Covers [a, b], (a, b), "from a to b", "between a and b"
    const intervalMatch = q.match(/[\[\(]\s*([^,\[\(]+)\s*,\s*([^,\]\)]+)\s*[\]\)]/) ||
                          q.match(/(?:on the interval|from|between|limits(?: are)?|on)\s+(?:the\s+)?(?:interval\s+)?(?:points\s+)?(?:limits\s+)?(?:between\s+)?\s*([a-z\d\.\-\s]+?)\s*(?:to|and|,)\s*([a-z\d\.\-\s]+?)(?:$|\s+)/i);

    if (!funcMatch || !intervalMatch) throw new Error("Format: f(x) = <expr> on [a, b]");

    let funcStr = funcMatch[1].trim();
    if (funcStr.includes('=')) funcStr = funcStr.split('=').pop()!.trim();

    const fName = 'f';
    const detectedVars = detectVariables(funcStr);
    const varName = detectedVars.length > 0 ? detectedVars[0] : 'x';
    
    const a = math.evaluate(intervalMatch[1].trim());
    const b = math.evaluate(intervalMatch[2].trim());

    const f_val = (val: number) => math.evaluate(funcStr, { [varName]: val });
    
    // Quick continuity/domain check
    const samples_check = 20;
    for (let i = 0; i <= samples_check; i++) {
        const x = a + (i / samples_check) * (b - a);
        const y = f_val(x);
        if (typeof y !== 'number' || !isFinite(y)) {
            throw new Error(`The function is not continuous or defined at ${x.toFixed(2)}. LMVT does not apply.`);
        }
    }

    const fa = Number(f_val(a));
    const fb = Number(f_val(b));

    const steps: SolutionStep[] = [];

    steps.push({
      title: "Check Function Properties",
      explanation: `The function $${fName}(${varName}) = ${funcStr}$ is continuous on $[${a}, ${b}]$ and differentiable on $(${a}, ${b})$.`,
      whyNote: "LMVT requires continuity on the closed interval and differentiability on the open interval."
    });

    const avgRate = Number(math.divide(math.subtract(fb, fa), math.subtract(b, a)));

    steps.push({
      title: "Compute Average Rate of Change",
      formula: `\\frac{${fName}(${b}) - ${fName}(${a})}{${b} - ${a}} = \\frac{${math.format(fb)} - ${math.format(fa)}}{${math.format(math.subtract(b, a))}} = ${math.format(avgRate, { precision: 6 })}`,
      explanation: "The average rate of change is the slope of the secant line joining the endpoints.",
      whyNote: "LMVT guarantees that the instantaneous rate equals this average at some interior point."
    });

    const df = math.derivative(funcStr, varName).toString();

    steps.push({
      title: "Differentiate the Function",
      formula: `${fName}'(${varName}) = ${df}`,
      explanation: `Computing the first derivative with respect to $${varName}$ to find the instantaneous rate of change.`,
      whyNote: `We need to solve $${fName}'(c) = \\text{average rate}$ for $c$.`
    });

    steps.push({
      title: "Apply LMVT",
      formula: `${fName}'(c) = ${df.replace(new RegExp(varName, 'g'), 'c')} = ${math.format(avgRate, { precision: 6 })}`,
      explanation: `Set the derivative equal to the average rate and solve for $c \\in (${a}, ${b})$.`,
      whyNote: "LMVT confirms existence of at least one such c in the open interval."
    });

    // Numeric solve for c
    const f_prime = (val: number) => math.evaluate(df, { [varName]: val });
    const target = (cVal: number) => f_prime(cVal) - avgRate;
    
    let cValue: number | null = null;
    const samples = 40;
    for (let i = 0; i < samples; i++) {
        const x1 = a + (i / samples) * (b - a);
        const x2 = a + ((i + 1) / samples) * (b - a);
        const t1 = target(x1);
        const t2 = target(x2);
        if (typeof t1 === 'number' && typeof t2 === 'number' && t1 * t2 <= 0) {
            let low = x1, high = x2;
            for (let j = 0; j < 30; j++) {
                const mid = (low + high) / 2;
                if ((target(low) as number) * (target(mid) as number) <= 0) high = mid;
                else low = mid;
            }
            cValue = (low + high) / 2;
            if (cValue > a + 0.0001 && cValue < b - 0.0001) break; // Ensure interior point
        }
    }

    if (cValue !== null) {
      steps.push({
        title: `Find Specific c in (${a}, ${b})`,
        formula: `c \\approx ${math.format(cValue, { precision: 5 })}`,
        explanation: `By solving $${fName}'(c) = ${math.format(avgRate, { precision: 4 })}$, we find the point where the instantaneous slope matches the average slope.`,
      });

      return {
        theorem: "Lagrange Mean Value Theorem",
        steps,
        finalAnswer: `c \\approx ${math.format(cValue, { precision: 5 })} \\in (${a}, ${b})`
      };
    }

    return {
      theorem: "Lagrange Mean Value Theorem",
      steps,
      finalAnswer: `\\text{There exists } c \\in (${a}, ${b}) \\text{ such that } ${fName}'(c) = ${math.format(avgRate, { precision: 6 })}.`
    };
  } catch (e: any) {
    throw new Error("LMVT parsing error: " + e.message);
  }
}


// ─── Integration by Parts ───
export function solveIntegrationByParts(questionRaw: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];
    const question = questionRaw.replace(/\r?\n+/g, ' ');
    
    // Bounds check: ∫₀¹ or [0, 1] or "with limits 0 to 1"
    const boundsMatch = isConv ? (
      question.match(/∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)/) || 
      question.match(/(?:from|limits|between)\s+([\d.\-]+)\s+(?:to|and)\s+([\d.\-]+)/i) )
      : question.match(/∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)/);
    let a: number | null = null, b: number | null = null;
    if (boundsMatch) {
      try {
        a = math.evaluate(normalizeMathString(boundsMatch[1], isConv));
        b = math.evaluate(normalizeMathString(boundsMatch[2], isConv));
        if (typeof a !== 'number' || typeof b !== 'number') { a = null; b = null; }
      } catch { a = null; b = null; }
    }

    // Isolate function from word problem
    let cleaned = question
      .replace(/∫\s*([^^ ∫\/]+)\s*\^{0,1}\s*([^^ ∫(\/]+)/g, '')
      .replace(/∫/g, '')
      .replace(/evaluate|integrate|using|by\s+parts\s+of|the|is\s+given\s+by/gi, '')
      .replace(/[a-z]\([a-z]\)\s*=\s*/i, 'F_EQ_');
    
    if (cleaned.includes('F_EQ_')) cleaned = cleaned.split('F_EQ_')[1];
    cleaned = cleaned.split(/\.\s+|\.\s*$|by\s+|from\s+|obtain\s+|find\s+|compute\s+|where\s+/i)[0].trim();
    cleaned = cleaned.replace(/\s*d[a-z]\s*(?:\s*|$)/gi, '').replace(/·|⋅/g, '*').trim();

    const parts = splitIntegrand(cleaned);
    let varName = detectVar(cleaned);
    if (!varName) varName = 'x';

    steps.push({
      title: "Identify the Integrand",
      formula: `\\int ${cleaned} \\, d${varName}`,
      explanation: `We evaluate the integral of $${cleaned}$ using integration by parts.`,
      whyNote: "Formula: $\\int u\\,dv = uv - \\int v\\,du$."
    });

    const du = math.derivative(parts.u, varName).toString();

    steps.push({
      title: "Choose u and dv (ILATE Rule)",
      formula: `u = ${parts.u}, \\quad dv = ${parts.dv}\\,d${varName}`,
      explanation: `ILATE rule suggests picking $u = ${parts.u}$.`,
      whyNote: "The derivative of u should ideally be simpler."
    });

    steps.push({
      title: `Compute du and v`,
      formula: `du = ${du}\\,d${varName}, \\quad v = \\int ${parts.dv}\\,d${varName}`,
      explanation: "Differentiate u and integrate dv.",
    });

    if (a !== null && b !== null) {
        const func = (v: number) => math.evaluate(normalizeMathString(cleaned), { [varName]: v });
        const result = numericIntegrate(func, a, b, 50);
        steps.push({
            title: "Definite Integration Result",
            formula: `\\int_{${a}}^{${b}} ${cleaned} \\, d${varName} \\approx ${math.format(result, { precision: 6 })}`,
            explanation: "Applying the fundamental theorem of calculus or numerical integration over the specified bounds.",
        });
        return {
            theorem: "Integration by Parts",
            steps,
            finalAnswer: `\\text{Result} \\approx ${math.format(result, { precision: 6 })}`
        };
    }

    return {
      theorem: "Integration by Parts",
      steps,
      finalAnswer: `\\int ${cleaned}\\,d${varName} = (${parts.u})(v) - \\int v \\cdot (${du})\\,d${varName} + C`
    };
  } catch (e: any) {
    throw new Error("Integration by Parts: " + e.message);
  }
}

function detectVar(expr: string): string {
    const match = expr.match(/[a-z]/i);
    return match ? match[0] : 'x';
}

function splitIntegrand(expr: string): { u: string; dv: string } {
  // Try split by * or whitespace between terms
  const mulMatch = expr.match(/^(.+?)\s*(?:\*|·|⋅|\s)\s*([a-z].+)$/i) || 
                   expr.match(/^(.+?)\s*(?:\*|·|⋅|\s)\s*(.+)$/i);
  if (mulMatch) {
    const part1 = mulMatch[1].trim();
    const part2 = mulMatch[2].trim();
    if (isAlgebraic(part1)) return { u: part1, dv: part2 };
    if (isAlgebraic(part2)) return { u: part2, dv: part1 };
    return { u: part1, dv: part2 };
  }
  return { u: expr, dv: "1" };
}

function isAlgebraic(expr: string): boolean {
  return /^[a-z](\^\d+)?$/i.test(expr.trim()) || /^[\d[a-z]\s\+\-\*\^\/]+$/i.test(expr.trim());
}

// ─── Bernoulli's Formula (Tabular Method) ───
export function solveBernoullisFormula(questionRaw: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];
    const question = questionRaw.replace(/\r?\n+/g, ' ');
    
    const boundsMatch = isConv ? (
      question.match(/∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)/) || 
      question.match(/(?:from|limits|between)\s+([\d.\-]+)\s+(?:to|and)\s+([\d.\-]+)/i) )
      : question.match(/∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)/);

    let a: number | null = null, b: number | null = null;
    if (boundsMatch) {
      try {
        a = math.evaluate(normalizeMathString(boundsMatch[1], isConv));
        b = math.evaluate(normalizeMathString(boundsMatch[2], isConv));
        if (typeof a !== 'number' || typeof b !== 'number') { a = null; b = null; }
      } catch { a = null; b = null; }
    }

    let cleaned = question
      .replace(/∫\s*([^^ ∫\/]+)\s*\^{0,1}\s*([^^ ∫(\/]+)/g, '')
      .replace(/∫/g, '').replace(/evaluate|integrate|using\s+bernoulli|obtain|find|verify|the/gi, '')
      .replace(/[a-z]\([a-z]\)\s*=\s*/i, 'F_EQ_');
    
    if (cleaned.includes('F_EQ_')) cleaned = cleaned.split('F_EQ_')[1];
    cleaned = cleaned.split(/\.\s+|\.\s*$|by\s+|from\s+|obtain\s+|find\s+|compute\s+|where\s+/i)[0].trim();
    cleaned = cleaned.replace(/\s*d[a-z]\s*(?:\s*|$)/gi, '').replace(/·|⋅/g, '*').trim();

    const parts = splitIntegrand(cleaned);
    let varName = detectVar(cleaned);
    if (!varName) varName = 'x';

    steps.push({
      title: "Identify u (Differentiate) and v (Integrate)",
      formula: `u = ${parts.u}, \\quad dv = ${parts.dv}\\;d${varName}`,
      explanation: "Bernoulli's method is ideal for types $\\int x^n e^{ax} dx$ or $\\int x^n \\sin(ax) dx$.",
      whyNote: "Repeatedly differentiate u until zero and integrate v repeatedly."
    });

    let currentU = parts.u;
    const derivatives: string[] = [currentU];
    for (let i = 0; i < 6; i++) {
        try {
            const nextD = math.derivative(currentU, varName).toString();
            if (nextD === '0') { derivatives.push('0'); break; }
            derivatives.push(nextD);
            currentU = nextD;
        } catch { break; }
    }

    steps.push({
      title: "Successive Derivatives",
      formula: derivatives.join(', \\quad '),
      explanation: "Successive derivatives show when the integration by parts chain terminates.",
    });

    if (a !== null && b !== null) {
        const func = (v: number) => math.evaluate(normalizeMathString(cleaned), { [varName]: v });
        const result = numericIntegrate(func, a, b, 50);
        steps.push({
            title: "Total Integration Value",
            formula: `\\int_{${a}}^{${b}} (${cleaned}) \\, d${varName} \\approx ${math.format(result, { precision: 6 })}`,
            explanation: "The area under the rate curve (integral) gives the accumulated value (like total charge).",
        });
        return {
            theorem: "Bernoulli's Formula (Tabular Method)",
            steps,
            finalAnswer: `\\text{Total Value} \\approx ${math.format(result, { precision: 6 })}`
        };
    }

    return {
      theorem: "Bernoulli's Formula (Tabular Method)",
      steps,
      finalAnswer: `Use alternating sum of $u^{(k)}v_{k+1}$ and add $+ C$.`
    };
  } catch (e: any) {
    throw new Error("Bernoulli Error: " + e.message);
  }
}

// ─── Double Integration ───
export function solveDoubleIntegration(question: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];

    // Parse: ∫₀¹ ∫₀ˣ (x + y) dy dx  or textual variants
    // We'll try to parse structured input: f(x,y) = expr, x in [a,b], y in [c,d] or [g1(x), g2(x)]
    const funcMatch = isConv ? (question.match(/(?:f\(x,y\)\s*=\s*|integrate\s+|evaluate\s+)?\s*([^\[\]]+?)(?:\s+(?:dy|dx|over|on|for))/i) ||
                                question.match(/(?:f\(x,y\)\s*=\s*)(.+)/i))
                             : question.match(/(?:f\(x,y\)\s*=\s*|∫∫)?\s*([^\[\]]+?)(?:\s+(?:dy|dx|$))/i);

    steps.push({
      title: "Set Up the Double Integral",
      formula: `\\iint_R f(x,y)\\,dA`,
      explanation: "The double integral is evaluated by integrating the inner variable first, then the outer variable.",
      whyNote: "Choose the order of integration (dy dx or dx dy) that simplifies the computation."
    });

    steps.push({
      title: "Evaluate the Inner Integral",
      explanation: "Integrate with respect to the inner variable, treating the outer variable as a constant.",
      whyNote: "The result is a single-variable function of the outer variable."
    });

    steps.push({
      title: "Evaluate the Outer Integral",
      explanation: "Integrate the result from the inner step with respect to the outer variable over its bounds.",
      whyNote: "This final integration gives the scalar result of the double integral."
    });

    const cleanedInput = normalizeMathString(question, isConv);

    // Attempt evaluation for standard cases like ∫₀¹ ∫₀ˣ (x + y) dy dx
    const integratedMatch = cleanedInput.match(/∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫]+)\s*∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)\s*(.+?)\s*dy\s*dx/i);
    if (integratedMatch) {
      const [, xa, xb, ya_expr, yb_expr, funcStr] = integratedMatch;
      const xStart = parseFloat(xa);
      const xEnd = parseFloat(xb);

      const innerInt = (x: number) => {
          const yStart = math.evaluate(ya_expr.replace(/[\^\s]+/g, ''), { x });
          const yEnd = math.evaluate(yb_expr.replace(/[\^\s]+/g, ''), { x });
          return numericIntegrate((y: number) => math.evaluate(funcStr, { x, y }), yStart, yEnd, 20);
      };

      const result = numericIntegrate(innerInt, xStart, xEnd, 40);

      steps.push({
        title: "Numerical Evaluation",
        formula: `\\int_{${xa}}^{${xb}} \\int_{${ya_expr}}^{${yb_expr}} (${funcStr}) \\, dy \\, dx \\approx ${math.format(result, { precision: 6 })}`,
        explanation: "Evaluating the nested integral using numerical slice-and-sum (multiple integration).",
      });

      return {
        theorem: "Double Integration",
        steps,
        finalAnswer: `\\text{Result} \\approx ${math.format(result, { precision: 6 })}`
      };
    }

    return {
      theorem: "Double Integration",
      steps,
      finalAnswer: "Evaluate inner integral first, then outer integral to get the result."
    };
  } catch (e: any) {
    throw new Error("Double integration parsing error: " + e.message);
  }
}

// ─── Triple Integration ───
export function solveTripleIntegration(question: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];

    steps.push({
      title: "Set Up the Triple Integral",
      formula: `\\iiint_V f(x,y,z)\\,dV`,
      explanation: "The triple integral is evaluated by integrating from the innermost variable to the outermost.",
      whyNote: "The order (dz dy dx) is the most common but should be chosen for simplicity."
    });

    steps.push({
      title: "Evaluate the Innermost Integral (z)",
      explanation: "Integrate with respect to z first, treating x and y as constants.",
      whyNote: "This reduces the problem to a double integral."
    });

    steps.push({
      title: "Evaluate the Middle Integral (y)",
      explanation: "Integrate the result with respect to y, treating x as a constant.",
      whyNote: "This further reduces the problem to a single integral."
    });

    steps.push({
      title: "Evaluate the Outermost Integral (x)",
      explanation: "Integrate the final result with respect to x to get the scalar answer.",
      whyNote: "The triple integral gives volume, mass, or other accumulated 3D quantities."
    });

    const cleanedInput = normalizeMathString(question, isConv);
    // Numeric evaluation for triple integrals: ∫₀¹ ∫₀¹ ∫₀¹ xyz dz dy dx
    const tripleMatch = cleanedInput.match(/∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)\s*∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)\s*∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)\s*(.+?)\s*dz\s*dy\s*dx/i);
    if (tripleMatch) {
        const [, xa, xb, ya, yb, za, zb, funcStr] = tripleMatch;
        const xA = parseFloat(xa);
        const xB = parseFloat(xb);

        const outer = (x: number) => {
            const yA = math.evaluate(ya, {x});
            const yB = math.evaluate(yb, {x});
            const middle = (y: number) => {
                const zA = math.evaluate(za, {x, y});
                const zB = math.evaluate(zb, {x, y});
                if (typeof zA !== 'number' || typeof zB !== 'number' || isNaN(zA) || isNaN(zB)) return 0;
                return numericIntegrate((z: number) => {
                    const val = math.evaluate(funcStr, {x, y, z});
                    return typeof val === 'number' && !isNaN(val) ? val : 0;
                }, zA, zB, 10);
            };
            if (typeof yA !== 'number' || typeof yB !== 'number' || isNaN(yA) || isNaN(yB)) return 0;
            return numericIntegrate(middle, yA, yB, 10);
        };
        const result = numericIntegrate(outer, xA, xB, 10);

        steps.push({
            title: "Numerical Integration Result",
            formula: `\\iiint_V f(x,y,z)\\,dV \\approx ${math.format(result, { precision: 6 })}`,
            explanation: "The nested integration over the specified volume boundaries yields the total volume/value.",
        });
        
        return {
            theorem: "Triple Integration",
            steps,
            finalAnswer: `\\text{Volume} \\approx ${math.format(result, { precision: 6 })}`
        };
    }

    return {
      theorem: "Triple Integration",
      steps,
      finalAnswer: "Evaluate innermost → middle → outermost integral sequentially."
    };
  } catch (e: any) {
    throw new Error("Triple integration parsing error: " + e.message);
  }
}

// ─── Jacobian ───
export function solveJacobian(question: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];

    const q = normalizeMathString(question, isConv);
    // Try to parse x = expr1, y = expr2 in terms of (u,v) or (r,θ)
    const xMatch = isConv ? (q.match(/(?:x|u_1)\s*=\s*([^,;]+)/i) || q.match(/(?:where|given|defined)\s+x\s*=\s*([^,; ]+)/i))
                          : q.match(/(?:x|u_1)\s*=\s*([^,;]+)/i);
    const yMatch = isConv ? (q.match(/(?:y|u_2)\s*=\s*([^,;]+)/i) || q.match(/(?:where|given|defined)\s+y\s*=\s*([^,; ]+)/i))
                          : q.match(/(?:y|u_2)\s*=\s*([^,;]+)/i);

    if (!xMatch || !yMatch) throw new Error("Jacobian: Could not find transformation equations (x=..., y=...).");

    const xExpr = xMatch[1].trim();
    const yExpr = yMatch[1].trim();

    // Detect variables (u,v) or (r,theta)
    const vars = detectVariables(xExpr + " " + yExpr);
    const u = vars[0];
    const v = vars[1];

    steps.push({
      title: "Define the Transformation",
      formula: `x = ${xExpr}, \\quad y = ${yExpr}`,
      explanation: `The coordinate transformation maps $(${u}, ${v})$ to $(x, y)$.`,
      whyNote: "The Jacobian measures how area elements are stretched or compressed by this transformation."
    });

    // Compute partial derivatives symbolically
    const dxdu = safeDeriv(xExpr, u);
    const dxdv = safeDeriv(xExpr, v);
    const dydu = safeDeriv(yExpr, u);
    const dydv = safeDeriv(yExpr, v);

    steps.push({
      title: "Compute Partial Derivatives",
      formula: `\\frac{\\partial x}{\\partial ${u}} = ${dxdu}, \\quad \\frac{\\partial x}{\\partial ${v}} = ${dxdv}, \\quad \\frac{\\partial y}{\\partial ${u}} = ${dydu}, \\quad \\frac{\\partial y}{\\partial ${v}} = ${dydv}`,
      explanation: "These four partial derivatives form the entries of the Jacobian matrix.",
      whyNote: "Each entry captures how one output variable changes with respect to one input variable."
    });

    steps.push({
      title: "Form the Jacobian Determinant",
      formula: `J = \\begin{vmatrix} ${dxdu} & ${dxdv} \\\\ ${dydu} & ${dydv} \\end{vmatrix}`,
      explanation: "The Jacobian is the determinant of the 2×2 matrix of partial derivatives.",
      whyNote: "|J| is the area scaling factor used in change-of-variable integrals."
    });

    const finalJ = math.simplify(`(${dxdu})*(${dydv}) - (${dxdv})*(${dydu})`).toString();
    steps.push({
      title: "Evaluate and Simplify",
      formula: `J = ${finalJ}`,
      explanation: "Expand the 2×2 determinant (ad − bc) and simplify the resulting expression.",
    });

    return {
      theorem: "Jacobian",
      steps,
      finalAnswer: `J = ${finalJ}`
    };
  } catch (e: any) {
    throw new Error("Jacobian parsing error: " + e.message);
  }
}

function detectVariables(expr: string): string[] {
    try {
        if (expr.includes('theta') || expr.includes('θ')) return ['r', 'theta'];
        const node = math.parse(expr);
        const vars = new Set<string>();
        node.traverse((n: any) => {
            if (n.isSymbolNode && !(n.name in (math as any)) && !['f', 'u', 'v', 'z', 'w', 'ans', 'pi', 'e', 'tau'].includes(n.name)) {
                vars.add(n.name);
            }
        });
        const result = Array.from(vars);
        if (result.length >= 2) return result;
        if (result.length === 1) return [result[0], 'y'];
        return ['u', 'v'];
    } catch { return ['u', 'v']; }
}

function safeDeriv(expr: string, variable: string): string {
  try {
    return math.derivative(expr, variable).toString();
  } catch {
    return `\\frac{d}{d${variable}}(${expr})`;
  }
}

// ─── Maxima & Minima of Two Variables ───
export function solveMaximaMinima(question: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];

    const q = normalizeMathString(question, isConv);
    const funcMatch = isConv ? (q.match(/(?:f\(x,y\)\s*=\s*)?([^on\[\]=]+)/i) || 
                      q.match(/(?:surface|equation|function)\s*(?:given|defined)\s+by\s+([^on\[\]=]+)/i))
                      : q.match(/(?:f\(x,y\)\s*=\s*)?([^on\[\]=]+)/i);
    if (!funcMatch) throw new Error("Maxima/Minima: Could not parse function. Format: f(x,y) = expr");

    const funcStr = funcMatch[1].trim();
    const vars = detectVariables(funcStr);
    const v1 = vars[0];
    const v2 = vars[1];

    steps.push({
      title: "Given Function",
      formula: `f(${v1}, ${v2}) = ${funcStr}`,
      explanation: `We need to find and classify the critical points of this function with respect to $${v1}$ and $${v2}$.`,
      whyNote: "Critical points occur where both partial derivatives are zero."
    });

    const fx = math.derivative(funcStr, 'x').toString();
    const fy = math.derivative(funcStr, 'y').toString();

    steps.push({
      title: "Find Partial Derivatives",
      formula: `f_x = ${fx}, \\quad f_y = ${fy}`,
      explanation: "Compute the first-order partial derivatives with respect to x and y.",
      whyNote: "Setting these to zero gives the system of equations for critical points."
    });

    steps.push({
      title: "Find Critical Points",
      formula: `f_x = 0: \\quad ${fx} = 0 \\\\\\\\  f_y = 0: \\quad ${fy} = 0`,
      explanation: "Solve this system of equations simultaneously to find all critical points.",
      whyNote: "Critical points are candidates for maxima, minima, or saddle points."
    });

    // Second derivatives
    const fxx = safeDeriv(fx, 'x');
    const fyy = safeDeriv(fy, 'y');
    const fxy = safeDeriv(fx, 'y');

    steps.push({
      title: "Second Derivative Test",
      formula: `f_{xx} = ${fxx}, \\quad f_{yy} = ${fyy}, \\quad f_{xy} = ${fxy}`,
      explanation: "Compute second-order partial derivatives for the Hessian test.",
    });

    steps.push({
      title: "Compute Discriminant D",
      formula: `D = f_{xx} \\cdot f_{yy} - (f_{xy})^2 = (${fxx})(${fyy}) - (${fxy})^2`,
      explanation: "If D > 0 and fₓₓ > 0 → minimum. If D > 0 and fₓₓ < 0 → maximum. If D < 0 → saddle point.",
      whyNote: "The discriminant classifies each critical point."
    });

    // Grid search for potential critical points
    const cps = findCP(fx, fy);
    
    if (cps.length === 0) {
        return {
            theorem: "Maxima & Minima",
            steps,
            finalAnswer: "No local extrema found within search range."
        };
    }

    cps.forEach((cp, idx) => {
        const valXX = Number(math.evaluate(fxx, cp));
        const valYY = Number(math.evaluate(fyy, cp));
        const valXY = Number(math.evaluate(fxy, cp));
        const D = valXX * valYY - valXY * valXY;
        
        let classification = "Saddle Point";
        if (D > 0) {
          classification = valXX > 0 ? "Local Minimum" : "Local Maximum";
        } else if (D === 0) {
          classification = "Inconclusive";
        }

        steps.push({
          title: `Classify Point ${idx + 1}: (${cp.x}, ${cp.y})`,
          formula: `D = ${math.format(D)}, \\quad f_{xx} = ${math.format(valXX)}`,
          explanation: `At point $(${cp.x}, ${cp.y})$, the discriminant $D$ is $${math.format(D)}$. Type: **${classification}**.`,
        });
      });

      const best = cps[0]; // just pick first for summary
      return {
        theorem: "Maxima & Minima (Second Derivative Test)",
        steps,
        finalAnswer: `Critical points found at: ${cps.map(p => `(${p.x}, ${p.y})`).join(', ')}.`
      };

    return {
      theorem: "Maxima & Minima (Second Derivative Test)",
      steps,
      finalAnswer: `Solve $f_x = 0, f_y = 0$ then classify using $D = f_{xx}f_{yy} - f_{xy}^2$`
    };
  } catch (e: any) {
    throw new Error("Maxima/Minima parsing error: " + e.message);
  }
}

// ─── Lagrange Multiplier ───
export function solveLagrangeMultiplier(question: string, mode?: string): Solution {
  const isConv = mode === 'english';
  try {
    const steps: SolutionStep[] = [];

    const q = normalizeMathString(question, isConv);
    // Parse: "maximize/minimize f(x,y) = xy subject to x + y = 10"
    const funcMatch = isConv ? (q.match(/f\(x,y\)\s*=\s*([^s]+?)(?:\s+subject|\s+s\.t|\s+given|\s+constraint)/i) ||
                                q.match(/(?:maximize|minimize|optimize)\s+(.+?)(?:\s+subject|\s+s\.t|\s+given|\s+constraint)/i))
                             : q.match(/f\(x,y\)\s*=\s*([^s]+?)(?:\s+subject|\s+s\.t|$)/i);
    const constraintMatch = isConv ? q.match(/(?:subject to|s\.t\.|constraint|given|with)\s+(.+)/i)
                                   : q.match(/(?:g\(x,y\)\s*=\s*)(.+)/i);

    const fExpr = funcMatch ? funcMatch[1].trim() : "f(x,y)";
    const gExpr = constraintMatch ? constraintMatch[1].trim().replace(/\s*=\s*0?\s*$/, '') : "g(x,y)";

    const vars = detectVariables(fExpr + " " + gExpr);
    const v1 = vars[0];
    const v2 = vars[1];

    steps.push({
      title: "Define the Problem",
      formula: `\\text{Optimize } f(${v1}, ${v2}) = ${fExpr} \\quad \\text{subject to } ${gExpr} = 0`,
      explanation: "We use the method of Lagrange multipliers because there is a constraint.",
      whyNote: "This method avoids substitution and directly finds where the function's contour is tangent to the constraint."
    });

    steps.push({
      title: "Lagrange Condition",
      formula: `\\nabla f = \\lambda \\nabla g`,
      explanation: "The gradients of f and g must be parallel at the optimal point.",
      whyNote: "This means the rate of change of f along the constraint surface is zero."
    });

    try {
      const fx = math.derivative(fExpr, 'x').toString();
      const fy = math.derivative(fExpr, 'y').toString();

      steps.push({
        title: "Gradient of f",
        formula: `\\nabla f = \\left(${fx},\\; ${fy}\\right)`,
        explanation: "Compute the partial derivatives of the objective function.",
      });
    } catch {
      steps.push({
        title: "Gradient of f",
        formula: `\\nabla f = \\left(\\frac{\\partial f}{\\partial x},\\; \\frac{\\partial f}{\\partial y}\\right)`,
        explanation: "Compute the partial derivatives of the objective function.",
      });
    }

    steps.push({
      title: "Set Up System of Equations",
      formula: `\\frac{\\partial f}{\\partial x} = \\lambda \\frac{\\partial g}{\\partial x}, \\quad \\frac{\\partial f}{\\partial y} = \\lambda \\frac{\\partial g}{\\partial y}, \\quad g(x,y) = 0`,
      explanation: "This gives three equations in three unknowns (x, y, λ).",
      whyNote: "Solve this system simultaneously to find the constrained extrema."
    });

    steps.push({
      title: "Solve and Classify",
      explanation: "Solve the system for x, y, and λ. Substitute back into f to find the optimal value. Compare values to determine if it's a maximum or minimum.",
      whyNote: "Lagrange multipliers find both maxima and minima — you must check which is which."
    });

    // Try to solve for lambda
    try {
        const fx = math.derivative(fExpr, 'x').toString();
        const fy = math.derivative(fExpr, 'y').toString();
        const gx = math.derivative(gExpr, 'x').toString();
        const gy = math.derivative(gExpr, 'y').toString();

        // System: fx = lambda * gx, fy = lambda * gy, g = 0
        // For simple cases, we can search for points that satisfy this
        const range = 5;
        const step = 0.5;
        let bestP = null;
        for (let x = -range; x <= range; x += step) {
            for (let y = -range; y <= range; y += step) {
                const gVal = Math.abs(Number(math.evaluate(gExpr, {x, y})));
                if (gVal < 0.2) {
                    const fxVal = Number(math.evaluate(fx, {x, y}));
                    const fyVal = Number(math.evaluate(fy, {x, y}));
                    const gxVal = Number(math.evaluate(gx, {x, y}));
                    const gyVal = Number(math.evaluate(gy, {x, y}));
                    
                    // check if gradients are parallel: fx/gx = fy/gy = lambda
                    const ratio1 = gxVal !== 0 ? fxVal/gxVal : 0;
                    const ratio2 = gyVal !== 0 ? fyVal/gyVal : 0;
                    if (Math.abs(ratio1 - ratio2) < 0.5) {
                        bestP = {x, y, val: Number(math.evaluate(fExpr, {x, y}))};
                        break;
                    }
                }
            }
            if (bestP) break;
        }

        if (bestP) {
            steps.push({
                title: "Lagrange Solution Found",
                formula: `(x, y) \\approx (${bestP.x}, ${bestP.y}), \\quad f(x,y) \\approx ${math.format(bestP.val, {precision: 4})}`,
                explanation: `Found point on constraint where gradients are roughly parallel.`,
            });
            return {
                theorem: "Lagrange Multiplier Method",
                steps,
                finalAnswer: `Extremum at (${bestP.x}, ${bestP.y}) with value ${math.format(bestP.val, {precision: 4})}.`
            };
        }
    } catch {}

    return {
      theorem: "Lagrange Multiplier Method",
      steps,
      finalAnswer: `\\text{Solve } \\nabla f = \\lambda \\nabla g \\text{ and the constraint to find optimal (x, y).}`
    };
  } catch (e: any) {
    throw new Error("Lagrange Multiplier parsing error: " + e.message);
  }
}
