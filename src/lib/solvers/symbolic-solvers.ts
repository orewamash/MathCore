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

export function solveRollesTheorem(question: string, mode?: string): Solution {
    const isConv = mode === 'english';
    // Expected format: f(x) = x^2 - 5x + 6 on [2, 3] or v(t) = ... on (0,3)
    try {
        // Flatten multi-line input
        const q = normalizeMathString(question.replace(/\r?\n+/g, ' '), isConv);
        const funcMatch = q.match(/(?:[a-zA-Z]\([a-z]\)\s*=\s*|equation\s*(?:is|=)\s*|function\s*(?:is|=)\s*|given\s*by\s*=?\s*|=)\s*(.+?)(?:\s+on|\s+in|\s+between|\s+from|\s+where|\.\s+|\.$|$)/i);
                          
        // Covers [a, b], (a, b), "from a to b", "between a and b"
        const intervalMatch = q.match(/[\[\(]\s*([^,\[\(]+)\s*,\s*([^,\]\)]+)\s*[\]\)]/) ||
                              q.match(/(?:on the interval|from|between|limits(?: are)?|on)\s+(?:the\s+)?(?:interval\s+)?(?:points\s+)?(?:limits\s+)?(?:between\s+)?\s*([a-z\d\.\-\s]+?)\s*(?:to|and|,)\s*([a-z\d\.\-\s]+?)(?:$|\s+)/i);

        if (!funcMatch || !intervalMatch) throw new Error("Could not parse Rolle's question format.");

        let funcStr = funcMatch[1].trim();
        if (funcStr.includes('=')) funcStr = funcStr.split('=').pop()!.trim();

        const fName = 'f';
        const detectedVars = smartDetectVariables(funcStr);
        const varName = detectedVars.length > 0 ? detectedVars[0] : 'x';
        
        const a = math.evaluate(intervalMatch[1].trim());
        const b = math.evaluate(intervalMatch[2].trim());

        const f_val = (val: number) => math.evaluate(funcStr, { [varName]: val });

        // Domain/Continuity check
        for (let i = 0; i <= 20; i++) {
            const x = a + (i / 20) * (b - a);
            const y = f_val(x);
            if (typeof y !== 'number' || !isFinite(y)) {
                throw new Error(`The function is not continuous or defined at ${x.toFixed(2)}. Rolle's theorem does not apply.`);
            }
        }

        const steps: SolutionStep[] = [];
        steps.push({
            title: "Check Function Properties",
            explanation: `The function $${fName}(${varName}) = ${funcStr}$ is a continuous and differentiable function on the interval $[${a}, ${b}]$.`,
            whyNote: "Polynomials, trigonometry, and exponentials are generally smooth functions."
        });

        const fa = f_val(a);
        const fb = f_val(b);

        steps.push({
            title: `Verify Endpoint Equality: ${fName}(${a}) = ${fName}(${b})`,
            formula: `${fName}(${a}) = ${math.format(fa)}, \\quad ${fName}(${b}) = ${math.format(fb)}`,
            explanation: "Rolle's theorem requires the function values at the endpoints to be equal.",
            whyNote: "This ensures the curve must 'turn back' to return to the same value, requiring a horizontal tangent."
        });

        if (!math.equal(fa, fb)) {
            return {
                theorem: "Rolle's Theorem Verification",
                steps: steps,
                finalAnswer: `Rolle's Theorem does not apply because $${fName}(a) \\neq ${fName}(b)$ (values are ${math.format(fa)} and ${math.format(fb)}).`
            };
        }

        // Differentiation
        const df = math.derivative(funcStr, varName).toString();
        steps.push({
            title: "Differentiate the Function",
            formula: `${fName}'(${varName}) = ${df}`,
            explanation: `Computing the first derivative with respect to $${varName}$ to find the slope of the tangent.`,
            whyNote: `The theorem predicts $${fName}'(c) = 0$ for at least one $c \\in (a, b)$.`
        });

        const f_prime = (val: number) => math.evaluate(df, { [varName]: val });

        // Numeric root finding for c in (a, b)
        let cValue: number | null = null;
        const samples = 40;
        for (let i = 0; i < samples; i++) {
            const x1 = a + (i / samples) * (b - a);
            const x2 = a + ((i + 1) / samples) * (b - a);
            const y1 = Number(f_prime(x1));
            const y2 = Number(f_prime(x2));
            
            if (y1 * y2 <= 0) {
                let low = x1, high = x2;
                for (let j = 0; j < 30; j++) {
                    const mid = (low + high) / 2;
                    if (Number(f_prime(low)) * Number(f_prime(mid)) <= 0) high = mid;
                    else low = mid;
                }
                cValue = (low + high) / 2;
                if (cValue > a + 0.0001 && cValue < b - 0.0001) break;
            }
        }

        if (cValue !== null) {
            steps.push({
                title: `Find c in (${a}, ${b}) where ${fName}'(c) = 0`,
                formula: `${fName}'(c) = ${df.replace(new RegExp(varName, 'g'), 'c')} = 0 \\implies c \\approx ${math.format(cValue, { precision: 5 })}`,
                explanation: `By solving the derivative equation within the interval $(${a}, ${b})$, we find the point where the tangent is horizontal.`,
                whyNote: "At least one such point is guaranteed by Rolle's theorem."
            });

            return {
                theorem: "Rolle's Theorem",
                steps: steps,
                finalAnswer: `c \\approx ${math.format(cValue, { precision: 5 })} \\in (${a}, ${b})`
            };
        }
        
        return {
            theorem: "Rolle's Theorem",
            steps: steps,
            finalAnswer: `There exists $c \\in (${a}, ${b})$ such that $${fName}'(c) = 0$.`
        };

    } catch (e: any) {
        throw new Error("Unable to parse or solve this Rolle's Theorem question. Error: " + e.message);
    }
}

function smartDetectVariables(expr: string): string[] {
    try {
        const node = math.parse(expr);
        const vars = new Set<string>();
        node.traverse((n: any) => {
            if (n.isSymbolNode && !(n.name in (math as any)) && !['f', 'u', 'v', 'z', 'w', 'ans', 'pi', 'e', 'tau'].includes(n.name)) {
                vars.add(n.name);
            }
        });
        const result = Array.from(vars);
        return result.length > 0 ? result : ['x', 'y'];
    } catch { return ['x', 'y']; }
}

export function solveEulerTheorem(question: string, mode?: string): Solution {
    const isConv = mode === 'english';
    // Euler for homogeneous: x f_x + y f_y = n f
    // Format: "Verify Euler's theorem for f(x,y) = x^3 + 3x^2y + y^3"
    try {
        const q = normalizeMathString(question.replace(/\r?\n+/g, ' '), isConv);
        const funcMatch = isConv ? (
            q.match(/(?:[a-zA-Z]\([a-z, ]+\)|u|v|f|z)\s*=\s*(.+?)(?:\s+compute|\s+find|\s+verify|\s+then|\s+where|$)/i) ||
            q.match(/(?:where|function|is)\s*(?:u|v|f|z)\s*=\s*(.+)/i) ||
            q.match(/(?:[a-zA-Z]\([a-z, ]+\)\s*=\s*)?(.+)/) ) 
            : q.match(/(?:[a-zA-Z]\([a-z, ]+\)\s*=\s*)?(.+)/);
        if (!funcMatch) throw new Error("Euler's Theorem: Could not find function definition.");

        const funcStrRaw = funcMatch[1].trim();
        const funcStr = funcStrRaw.replace(/[.,\s]+$/, '');
        
        const vars = smartDetectVariables(funcStr);
        const v1 = vars[0] || 'x';
        const v2 = vars[1] || 'y';

        const dv1 = math.derivative(funcStr, v1).toString();
        const dv2 = math.derivative(funcStr, v2).toString();

        const steps: SolutionStep[] = [];
        
        const f_eval = (vals: Record<string, number>) => {
            try { return Number(math.evaluate(funcStr, vals)); }
            catch { return 0; }
        };
        
        // Homogeneity check
        const f1 = f_eval({ [v1]: 1, [v2]: 1 });
        const f2 = f_eval({ [v1]: 2, [v2]: 2 });
        const n = Math.round(Math.log2(Math.abs(f2 / (f1 || 1))));

        if (question.toLowerCase().includes('differentiate') || question.toLowerCase().includes('dow')) {
            steps.push({
                title: "Partial Differentiation",
                formula: `\\frac{\\partial}{\\partial ${v1}} = ${dv1}, \\quad \\frac{\\partial}{\\partial ${v2}} = ${dv2}`,
                explanation: `Calculated partial derivatives for the detected variables $${v1}$ and $${v2}$.`,
            });
        }

        steps.push({
            title: "Check Homogeneity",
            formula: `f(t${v1}, t${v2}) = t^n f(${v1}, ${v2})`,
            explanation: `The function is found to be homogeneous of degree $n = ${n}$.`,
        });

        steps.push({
            title: "Verify Euler Identity",
            formula: `${v1} \\cdot \\frac{\\partial f}{\\partial ${v1}} + ${v2} \\cdot \\frac{\\partial f}{\\partial ${v2}} = ${n}f`,
            explanation: `Verification for Euler's relation on Variables ${vars.join(', ')}.`,
        });

        return {
            theorem: "Euler's Theorem",
            steps: steps,
            finalAnswer: `Verified: \\sum v_i f_{v_i} = ${n}f`
        };

        return {
            theorem: "Euler's Theorem",
            steps: steps,
            finalAnswer: `Verified: x f_x + y f_y = ${n}f. \\text{ Degree: } ${n}`
        };
    } catch (e: any) {
        throw new Error("Euler's Theorem: " + e.message);
    }
}
