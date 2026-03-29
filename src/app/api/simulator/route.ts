import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { solveGaussJordan } from "@/lib/solvers/gauss-jordan-solver";
import { solveLUDecomposition, solveEigenvalues, solveEigenvectors, solveCayleyHamilton, solveGaussElimination } from "@/lib/solvers/matrix-solvers";
import { solveRollesTheorem, solveEulerTheorem } from "@/lib/solvers/symbolic-solvers";
import { 
  solveLMVT, 
  solveIntegrationByParts, 
  solveBernoullisFormula, 
  solveDoubleIntegration, 
  solveTripleIntegration, 
  solveJacobian, 
  solveMaximaMinima, 
  solveLagrangeMultiplier 
} from "@/lib/solvers/calculus-solvers";
import { getTopicContent } from "@/lib/content/topics";

export async function POST(req: NextRequest) {
  const { question, topic, mode } = await req.json();

  if (!question || !topic) {
    return NextResponse.json({ error: "Missing question or topic" }, { status: 400 });
  }

  try {
    let solution: any = null;

    const extractMatrix = (q: string) => {
        if (q.includes("rows:")) return q.split("rows:")[1].trim();
        const bracketMatch = q.match(/\[\[.+\]\]/);
        if (bracketMatch) return bracketMatch[0];
        return q;
    };

    const runSolver = (q: string) => {
      switch (topic) {
        case "rolles-theorem": return solveRollesTheorem(q, mode);
        case "lmvt": return solveLMVT(q, mode);
        case "integration-by-parts": return solveIntegrationByParts(q, mode);
        case "bernoullis-formula": return solveBernoullisFormula(q, mode);
        case "double-integration": return solveDoubleIntegration(q, mode);
        case "triple-integration": return solveTripleIntegration(q, mode);
        case "eulers-theorem": return solveEulerTheorem(q, mode);
        case "jacobian": return solveJacobian(q, mode);
        case "maxima-minima": return solveMaximaMinima(q, mode);
        case "lagrange-multiplier": return solveLagrangeMultiplier(q, mode);
        case "gauss-jordan": return solveGaussJordan(extractMatrix(q));
        case "gauss-elimination": return solveGaussElimination(extractMatrix(q));
        case "lu-decomposition": return solveLUDecomposition(extractMatrix(q));
        case "eigenvalues": return solveEigenvalues(extractMatrix(q));
        case "eigenvectors": return solveEigenvectors(extractMatrix(q));
        case "cayley-hamilton": return solveCayleyHamilton(extractMatrix(q));
        default: return null;
      }
    };

    try {
      // 1. Attempt strict algorithmic rules first
      solution = runSolver(question);
    } catch (algError: any) {
      // 2. Fallback to AI Translator on failure (only for non-matrix topics)
      const isMatrixTopic = ["gauss-jordan", "gauss-elimination", "lu-decomposition", "eigenvalues", "eigenvectors", "cayley-hamilton", "jacobi-method", "gauss-seidel"].includes(topic);
      
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

      if (!isMatrixTopic && apiKey) {
        console.log(`Algorithmic parsing failed for topic "${topic}". Attempting AI translation...`);
        try {
          const prompt = `You are a math extraction engine for the topic "${topic}". 
Extract the mathematical formula and interval/constraints from the user's word problem.
Normalization Rules:
- If a function is v(t), s(t), etc., keep the original variable name: v(t) = <expr> on [a, b]
- Intervals like (0,3) or [0,3] must be clearly specified.
- Result must be a single string in the exact format shown below.
- NO EXPLANATIONS. NO MARKDOWN. JUST THE FORMULA STRING.

Required Output Formats:
- rolles-theorem: f(x) = <expr> on [a, b]  (or v(t) = <expr> on [a, b])
- lmvt: f(x) = <expr> on [a, b]  (or v(t) = <expr> on [a, b])
- eulers-theorem: f(x,y) = <expr>
- maxima-minima: f(x,y) = <expr>
- jacobian: x = <expr>, y = <expr>
- lagrange-multiplier: f(x,y) = <expr> subject to <constraint_expr> = 0
- double-integration: ∫a^b ∫c^d <expr> dy dx
- triple-integration: ∫a^b ∫c^d ∫e^f <expr> dz dy dx
- integration-by-parts: integrate <expr> dx  (add "from a to b" if bounds exist)
- bernoullis-formula: integrate <expr> dx  (add "from a to b" if bounds exist)

User Word Problem: "${question}"`;

          const googleProvider = google('gemini-2.0-flash');

          const response = await generateText({
             model: googleProvider,
             prompt: prompt,
             maxRetries: 1,
          });

          if (response.text) {
             const translatedQuestion = response.text.trim().replace(/`/g, '').replace(/\n/g, ' ');
             console.log(`AI Translated: ${translatedQuestion}`);
             solution = runSolver(translatedQuestion);
             
             if (solution && solution.steps) {
                 solution.steps.unshift({
                     title: "AI Translation",
                     explanation: `Interpreting word problem into mathematical structure:`,
                     formula: translatedQuestion,
                     whyNote: "Natural language processed by Gemini 2.0 Flash."
                 });
             }
          } else {
             throw algError;
          }
        } catch (aiError: any) {
          console.error("AI Fallback Error:", aiError.message?.substring(0, 200));
          throw algError;
        }
      } else {
        if (!apiKey && !isMatrixTopic) {
            console.warn("AI Fallback skipped: GOOGLE_GENERATIVE_AI_API_KEY is missing in .env.local");
        }
        throw algError;
      }
    }

    if (!solution) {
      const topicContent = getTopicContent(topic);
      if (topicContent) {
          const exampleMatch = topicContent.examples.find((ex: any) => 
              question.toLowerCase().includes(ex.question.toLowerCase()) || 
              ex.question.toLowerCase().includes(question.toLowerCase())
          );
          
          if (exampleMatch) {
              solution = {
                  theorem: topicContent.title,
                  steps: exampleMatch.steps.map((s: any) => ({
                      title: s.label,
                      formula: s.formula,
                      explanation: s.text || "Execution of mathematical logic.",
                  })),
                  finalAnswer: exampleMatch.answer
              };
          }
      }
    }

    if (solution) return NextResponse.json(solution);

    // Final fallback
    return NextResponse.json({
        theorem: topic.replace(/-/g, " ").toUpperCase(),
        steps: [
            {
                title: "Input Not Recognized",
                explanation: `The solver could not parse your input. Please use the expected formula format.`,
                whyNote: "If testing word problems, ensure your Google API key is configured."
            }
        ],
        finalAnswer: "Error processing input."
    });

  } catch (err: any) {
      console.error("Simulator error:", err);
      return NextResponse.json({
          theorem: topic.replace(/-/g, " ").toUpperCase(),
          steps: [
              {
                  title: "Solver Inference Error",
                  explanation: `Error processing input: ${err.message || "Unknown error."}`,
                  whyNote: "Ensure your formatting is strictly mathematical unless the AI API key is working."
              }
          ],
          finalAnswer: "Parsing Error"
      });
  }
}

