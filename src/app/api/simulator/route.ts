import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { question, topic } = await req.json();

  if (!question || !topic) {
    return NextResponse.json({ error: "Missing question or topic" }, { status: 400 });
  }

  const systemPrompt = `
You are a precise engineering mathematics tutor for the topic: "${topic}".
Your job is to solve a student's question with crystal-clear step-by-step working.

Respond ONLY with a valid JSON object in this exact structure:
{
  "theorem": "Name of the theorem or rule being applied",
  "steps": [
    {
      "title": "Short name for this step",
      "formula": "LaTeX formula if applicable, otherwise omit this field",
      "explanation": "Plain English explanation of what was done",
      "whyNote": "Optional: deeper reason why this step works"
    }
  ],
  "finalAnswer": "LaTeX formula for the final answer"
}

Rules:
- All formulas must be valid KaTeX-compatible LaTeX
- Explain each step so a first-year engineering student understands it
- Keep step titles short (3–6 words)
- The finalAnswer must be the complete boxed result
- Never include markdown, only pure JSON
`;

  // Check if API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY is missing. Using mock solver.");
    return NextResponse.json(generateMockSolution(topic, question));
  }

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown fences and find the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
        throw new Error("AI response did not contain valid JSON");
    }

    const cleaned = text.substring(start, end + 1);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Simulator error:", err);
    return NextResponse.json({ 
        error: "Solver Engine Unavailable. " + (err.message || "Please check configuration.") 
    }, { status: 500 });
  }
}

function generateMockSolution(topic: string, question: string) {
    // Generate a structured mock response for development
    return {
        theorem: topic.replace("-", " ").toUpperCase(),
        steps: [
            {
                title: "Initialize Matrix",
                formula: "\\begin{pmatrix} a & b & | & c \\\\ d & e & | & f \\end{pmatrix}",
                explanation: "The system is converted into an augmented matrix form to begin the elimination process.",
                whyNote: "Normalization allows us to standardise the pivot elements."
            },
            {
                title: "Row Reduction",
                formula: "R_2 \\to R_2 - (d/a)R_1",
                explanation: "We apply elementary row operations to eliminate the coefficient below the first pivot.",
                whyNote: "Elimination reduces the degree of freedom in the lower rows."
            },
            {
                title: "Back Substitution",
                formula: "x_n = b_n / a_{nn}",
                explanation: "Starting from the bottom row, we solve for each variable sequentially.",
                whyNote: "Upper triangular form allows for direct substitution."
            }
        ],
        finalAnswer: "x = 2, y = -1, z = 3"
    };
}

