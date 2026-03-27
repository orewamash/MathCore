export interface TopicContent {
  title: string;
  plainEnglish: string;
  intuition: string;
  formalStatement: string;
  conditions: string[];
  commonMistakes: string[];
  simulatorPlaceholder: string;
  examples: {
    question: string;
    steps: { label: string; formula?: string; text?: string }[];
    answer: string;
  }[];
}

const topicData: Record<string, TopicContent> = {
  // ── LESSON 1: Differential Calculus ──
  "rolles-theorem": {
    title: "Rolle's Theorem",
    plainEnglish:
      "If a continuous function starts and ends at the same value on a closed interval, and is differentiable in between, then there must be at least one point where its derivative is zero — meaning the curve has a horizontal tangent somewhere inside that interval.",
    intuition:
      "Imagine throwing a ball straight up. It leaves your hand and returns to the same height. At the very top, for a brief instant, its velocity is zero. That's Rolle's theorem — if you start and end at the same height, there has to be a moment of zero slope in between.",
    formalStatement: "\\text{If } f \\text{ is continuous on } [a,b], \\text{ differentiable on } (a,b), \\text{ and } f(a) = f(b), \\text{ then } \\exists\\, c \\in (a,b) \\text{ such that } f'(c) = 0",
    conditions: [
      "f(x) must be continuous on the closed interval [a, b]",
      "f(x) must be differentiable on the open interval (a, b)",
      "f(a) must equal f(b)",
    ],
    commonMistakes: [
      "Applying the theorem when f(a) ≠ f(b) — the equal endpoint condition is essential.",
      "Forgetting to check differentiability; a sharp corner means the theorem doesn't apply.",
      "Assuming there's only one value of c — there can be multiple points where f'(c) = 0.",
    ],
    simulatorPlaceholder: "e.g. Verify Rolle's theorem for f(x) = x² − 5x + 6 on [2, 3]",
    examples: [
      {
        question: "Verify Rolle's theorem for f(x) = x² − 5x + 6 on [2, 3]",
        steps: [
          { label: "Check continuity", text: "f(x) = x² − 5x + 6 is a polynomial, so it's continuous everywhere, including [2,3]." },
          { label: "Check differentiability", text: "Polynomials are differentiable everywhere, so f is differentiable on (2,3)." },
          { label: "Check f(a) = f(b)", formula: "f(2) = 4 - 10 + 6 = 0, \\quad f(3) = 9 - 15 + 6 = 0", text: "f(2) = f(3) = 0. ✓" },
          { label: "Find c where f'(c) = 0", formula: "f'(x) = 2x - 5 = 0 \\implies x = \\frac{5}{2} = 2.5", text: "c = 2.5 lies in (2, 3). Rolle's theorem is verified." },
        ],
        answer: "c = \\frac{5}{2} \\in (2, 3)",
      },
      {
        question: "Verify Rolle's theorem for f(x) = sin(x) on [0, π]",
        steps: [
          { label: "Check continuity", text: "sin(x) is continuous on [0, π]. ✓" },
          { label: "Check differentiability", text: "sin(x) is differentiable on (0, π). ✓" },
          { label: "Check f(a) = f(b)", formula: "f(0) = \\sin(0) = 0, \\quad f(\\pi) = \\sin(\\pi) = 0" },
          { label: "Find c", formula: "f'(x) = \\cos(x) = 0 \\implies x = \\frac{\\pi}{2}", text: "c = π/2 lies in (0, π). Verified." },
        ],
        answer: "c = \\frac{\\pi}{2}",
      },
    ],
  },

  "lmvt": {
    title: "Lagrange Mean Value Theorem",
    plainEnglish:
      "If a function is continuous on a closed interval and differentiable on the open interval, then there is at least one point where the instantaneous rate of change equals the average rate of change over the whole interval.",
    intuition:
      "Think of driving from city A to city B. Your average speed over the whole trip was, say, 60 km/h. LMVT guarantees that at some instant during the drive, your speedometer read exactly 60 km/h.",
    formalStatement: "\\text{If } f \\text{ is continuous on } [a,b] \\text{ and differentiable on } (a,b), \\text{ then } \\exists\\, c \\in (a,b) : f'(c) = \\frac{f(b) - f(a)}{b - a}",
    conditions: [
      "f(x) must be continuous on [a, b]",
      "f(x) must be differentiable on (a, b)",
    ],
    commonMistakes: [
      "Confusing LMVT with Rolle's theorem — LMVT does NOT require f(a) = f(b).",
      "Forgetting that there could be multiple values of c satisfying the equation.",
      "Not simplifying f'(c) properly before solving for c.",
    ],
    simulatorPlaceholder: "e.g. Find c for f(x) = x³ − 3x + 2 on [0, 2] using LMVT",
    examples: [
      {
        question: "Find c for f(x) = x³ − 3x + 2 on [−1, 2]",
        steps: [
          { label: "Compute f(a) and f(b)", formula: "f(-1) = -1 + 3 + 2 = 4, \\quad f(2) = 8 - 6 + 2 = 4" },
          { label: "Average rate of change", formula: "\\frac{f(2) - f(-1)}{2 - (-1)} = \\frac{4 - 4}{3} = 0" },
          { label: "Find f'(x)", formula: "f'(x) = 3x^2 - 3" },
          { label: "Set f'(c) = 0 and solve", formula: "3c^2 - 3 = 0 \\implies c^2 = 1 \\implies c = \\pm 1", text: "Both c = 1 and c = −1 are in [−1, 2]." },
        ],
        answer: "c = 1 \\text{ (and } c = -1 \\text{)}",
      },
    ],
  },

  // ── LESSON 2: Integral Calculus ──
  "integration-by-parts": {
    title: "Integration by Parts",
    plainEnglish:
      "Integration by parts is used when the integrand is a product of two functions. It converts a difficult integral into a simpler one by splitting the product into two parts — one to differentiate and one to integrate.",
    intuition:
      "It's the integration equivalent of the product rule for differentiation. Just like d(uv) = u dv + v du, integration by parts rearranges it to isolate the integral you want.",
    formalStatement: "\\int u \\, dv = uv - \\int v \\, du",
    conditions: [
      "The integrand should be expressible as a product of two functions u and dv",
      "Use the ILATE rule (Inverse trig, Logarithmic, Algebraic, Trigonometric, Exponential) to choose u",
      "The resulting integral ∫v du should be simpler than the original",
    ],
    commonMistakes: [
      "Choosing u and dv incorrectly — always apply ILATE priority.",
      "Forgetting the minus sign in the formula.",
      "Not recognizing when to apply integration by parts repeatedly (tabular method).",
    ],
    simulatorPlaceholder: "e.g. Evaluate ∫ x·eˣ dx",
    examples: [
      {
        question: "Evaluate ∫ x·eˣ dx",
        steps: [
          { label: "Choose u and dv", formula: "u = x, \\quad dv = e^x\\,dx", text: "By ILATE, algebraic (x) comes before exponential (eˣ)." },
          { label: "Find du and v", formula: "du = dx, \\quad v = e^x" },
          { label: "Apply formula", formula: "\\int x e^x \\, dx = xe^x - \\int e^x \\, dx = xe^x - e^x + C" },
        ],
        answer: "xe^x - e^x + C",
      },
    ],
  },

  "bernoullis-formula": {
    title: "Bernoulli's Formula",
    plainEnglish:
      "Bernoulli's formula (also called the tabular method) is a shortcut for repeated integration by parts. Instead of applying the formula multiple times, you create a table of successive derivatives and integrals and alternate signs.",
    intuition:
      "Think of it as automation for integration by parts. When one part keeps differentiating down to zero (like xⁿ), this table method saves enormous time by organizing all the steps at once.",
    formalStatement: "\\int u\\,v\\,dx = u v_1 - u' v_2 + u'' v_3 - u''' v_4 + \\cdots",
    conditions: [
      "One of the functions (u) should reduce to zero after finite differentiations",
      "The other function (v) should be easily integrable repeatedly",
      "Signs alternate: +, −, +, −, ...",
    ],
    commonMistakes: [
      "Getting the alternating signs wrong — always start with +.",
      "Forgetting to add the constant of integration C.",
      "Using Bernoulli's formula when u doesn't eventually become zero — it won't terminate.",
    ],
    simulatorPlaceholder: "e.g. Evaluate ∫ x³·eˣ dx using Bernoulli's formula",
    examples: [
      {
        question: "Evaluate ∫ x²·sin(x) dx using Bernoulli's formula",
        steps: [
          { label: "Set up the table", text: "u = x² (differentiate), v = sin(x) (integrate)." },
          { label: "Build derivatives and integrals", formula: "u = x^2,\\; u' = 2x,\\; u'' = 2,\\; u''' = 0 \\quad|\\quad v_1 = -\\cos x,\\; v_2 = -\\sin x,\\; v_3 = \\cos x" },
          { label: "Apply alternating signs", formula: "= x^2(-\\cos x) - 2x(-\\sin x) + 2(\\cos x) + C" },
          { label: "Simplify", formula: "= -x^2\\cos x + 2x\\sin x + 2\\cos x + C" },
        ],
        answer: "-x^2\\cos x + 2x\\sin x + 2\\cos x + C",
      },
    ],
  },

  "double-integration": {
    title: "Double Integration",
    plainEnglish:
      "Double integration extends single integration to two dimensions. It's used to find the area of a region, the volume under a surface, or to compute mass, moments, and more over a 2D region.",
    intuition:
      "Imagine slicing a 3D surface into thin strips, finding the area of each strip (inner integral), then adding all strips together (outer integral). You're essentially sweeping across two directions.",
    formalStatement: "\\iint_R f(x,y)\\,dA = \\int_a^b \\left( \\int_{g_1(x)}^{g_2(x)} f(x,y)\\,dy \\right) dx",
    conditions: [
      "The function f(x,y) must be integrable over the region R",
      "Limits of integration must correctly describe the region R",
      "Choose the order of integration (dy dx or dx dy) based on which is simpler",
    ],
    commonMistakes: [
      "Setting up wrong limits — always sketch the region first.",
      "Confusing the order of integration when changing from dy dx to dx dy.",
      "Forgetting that the inner integral variable is treated as a function of the outer variable for variable limits.",
    ],
    simulatorPlaceholder: "e.g. Find the area bounded by y = x² and y = x using double integration",
    examples: [
      {
        question: "Evaluate ∫₀¹ ∫₀ˣ (x + y) dy dx",
        steps: [
          { label: "Inner integral (w.r.t. y)", formula: "\\int_0^x (x+y)\\,dy = \\left[xy + \\frac{y^2}{2}\\right]_0^x = x^2 + \\frac{x^2}{2} = \\frac{3x^2}{2}" },
          { label: "Outer integral (w.r.t. x)", formula: "\\int_0^1 \\frac{3x^2}{2}\\,dx = \\frac{3}{2} \\cdot \\frac{x^3}{3}\\Big|_0^1 = \\frac{1}{2}" },
        ],
        answer: "\\frac{1}{2}",
      },
    ],
  },

  "triple-integration": {
    title: "Triple Integration",
    plainEnglish:
      "Triple integration extends the concept to three dimensions. It's primarily used to find the volume of a solid region, or to compute mass and other physical quantities distributed in 3D space.",
    intuition:
      "Imagine filling a 3D shape with tiny cubes. Each cube has volume dx·dy·dz. Triple integration adds up all these infinitesimal cubes to give you the total volume or total accumulated quantity.",
    formalStatement: "\\iiint_V f(x,y,z)\\,dV = \\int_a^b \\int_{g_1(x)}^{g_2(x)} \\int_{h_1(x,y)}^{h_2(x,y)} f(x,y,z)\\,dz\\,dy\\,dx",
    conditions: [
      "The function must be integrable over the 3D region V",
      "Limits must correctly describe the solid region",
      "Evaluate from innermost to outermost integral",
    ],
    commonMistakes: [
      "Mixing up the order of integration limits.",
      "Not correctly identifying the bounds for z in terms of x and y.",
      "Forgetting to include the Jacobian when converting to cylindrical or spherical coordinates.",
    ],
    simulatorPlaceholder: "e.g. Find the volume of the region bounded by x + y + z = 1 in the first octant",
    examples: [
      {
        question: "Evaluate ∫₀¹ ∫₀¹ ∫₀¹ xyz dz dy dx",
        steps: [
          { label: "Innermost integral (z)", formula: "\\int_0^1 xyz\\,dz = xy \\cdot \\frac{z^2}{2}\\Big|_0^1 = \\frac{xy}{2}" },
          { label: "Middle integral (y)", formula: "\\int_0^1 \\frac{xy}{2}\\,dy = \\frac{x}{2} \\cdot \\frac{y^2}{2}\\Big|_0^1 = \\frac{x}{4}" },
          { label: "Outermost integral (x)", formula: "\\int_0^1 \\frac{x}{4}\\,dx = \\frac{1}{4} \\cdot \\frac{x^2}{2}\\Big|_0^1 = \\frac{1}{8}" },
        ],
        answer: "\\frac{1}{8}",
      },
    ],
  },

  // ── LESSON 3: Multivariable Calculus ──
  "eulers-theorem": {
    title: "Euler's Theorem on Homogeneous Functions",
    plainEnglish:
      "If a function of two variables is homogeneous of degree n (meaning scaling both inputs by t scales the output by tⁿ), then the sum x·(∂f/∂x) + y·(∂f/∂y) equals n·f(x,y).",
    intuition:
      "Euler's theorem tells you about the 'scaling behaviour' of a function. If you know how a function scales when you multiply all variables by a constant, you can predict a relationship between its partial derivatives.",
    formalStatement: "x \\frac{\\partial f}{\\partial x} + y \\frac{\\partial f}{\\partial y} = n \\cdot f(x,y)",
    conditions: [
      "f(x,y) must be a homogeneous function of degree n",
      "f(tx, ty) = tⁿ · f(x,y) for all t > 0",
      "f must have continuous first partial derivatives",
    ],
    commonMistakes: [
      "Applying the theorem to non-homogeneous functions.",
      "Incorrectly determining the degree of homogeneity n.",
      "Confusing partial derivatives with total derivatives.",
    ],
    simulatorPlaceholder: "e.g. Verify Euler's theorem for f(x,y) = x³ + 3x²y + y³",
    examples: [
      {
        question: "Verify Euler's theorem for f(x,y) = x³ + 3x²y + y³",
        steps: [
          { label: "Check homogeneity", formula: "f(tx,ty) = t^3x^3 + 3t^2x^2 \\cdot ty + t^3y^3 = t^3(x^3 + 3x^2y + y^3) = t^3 f(x,y)", text: "Degree n = 3." },
          { label: "Find ∂f/∂x", formula: "\\frac{\\partial f}{\\partial x} = 3x^2 + 6xy" },
          { label: "Find ∂f/∂y", formula: "\\frac{\\partial f}{\\partial y} = 3x^2 + 3y^2" },
          { label: "Compute x·fₓ + y·f_y", formula: "x(3x^2+6xy) + y(3x^2+3y^2) = 3x^3+6x^2y+3x^2y+3y^3 = 3(x^3+3x^2y+y^3) = 3f" },
        ],
        answer: "x f_x + y f_y = 3f \\quad \\checkmark",
      },
    ],
  },

  "jacobian": {
    title: "Jacobian",
    plainEnglish:
      "The Jacobian is a determinant that measures how a coordinate transformation stretches or compresses area (in 2D) or volume (in 3D). It acts as a scaling factor when converting integrals from one coordinate system to another.",
    intuition:
      "If you're converting from Cartesian to polar coordinates, a small rectangle dx·dy becomes a small 'wedge' r·dr·dθ. The Jacobian (which equals r in this case) is what accounts for this change in shape and size of the infinitesimal area element.",
    formalStatement: "J = \\frac{\\partial(x,y)}{\\partial(u,v)} = \\begin{vmatrix} \\frac{\\partial x}{\\partial u} & \\frac{\\partial x}{\\partial v} \\\\ \\frac{\\partial y}{\\partial u} & \\frac{\\partial y}{\\partial v} \\end{vmatrix}",
    conditions: [
      "The transformation must be differentiable",
      "The Jacobian must be non-zero for the transformation to be invertible",
      "J(x,y → u,v) · J(u,v → x,y) = 1 (inverse relationship)",
    ],
    commonMistakes: [
      "Getting the order of variables wrong in the determinant.",
      "Forgetting to take the absolute value of J when using it as a scaling factor in integrals.",
      "Confusing J(x,y/u,v) with J(u,v/x,y) — they are reciprocals.",
    ],
    simulatorPlaceholder: "e.g. Find the Jacobian for x = r cos θ, y = r sin θ",
    examples: [
      {
        question: "Find the Jacobian for polar coordinates: x = r cos θ, y = r sin θ",
        steps: [
          { label: "Compute partial derivatives", formula: "\\frac{\\partial x}{\\partial r} = \\cos\\theta, \\quad \\frac{\\partial x}{\\partial \\theta} = -r\\sin\\theta, \\quad \\frac{\\partial y}{\\partial r} = \\sin\\theta, \\quad \\frac{\\partial y}{\\partial \\theta} = r\\cos\\theta" },
          { label: "Form the Jacobian determinant", formula: "J = \\begin{vmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{vmatrix}" },
          { label: "Evaluate", formula: "J = r\\cos^2\\theta + r\\sin^2\\theta = r(\\cos^2\\theta + \\sin^2\\theta) = r" },
        ],
        answer: "J = r",
      },
    ],
  },

  "maxima-minima": {
    title: "Maxima & Minima of Two Variables",
    plainEnglish:
      "Finding maxima and minima of f(x,y) involves finding critical points where both partial derivatives are zero, then using the second derivative test (with the Hessian determinant) to classify each point as a maximum, minimum, or saddle point.",
    intuition:
      "Imagine a mountainous landscape. Peaks are maxima, valleys are minima, and mountain passes (where you go up in one direction but down in another) are saddle points. The second derivative test is your way of distinguishing between them.",
    formalStatement: "D = f_{xx} f_{yy} - (f_{xy})^2 \\quad \\text{at critical point } (a,b)",
    conditions: [
      "First, find critical points by solving fₓ = 0 and f_y = 0 simultaneously",
      "If D > 0 and fₓₓ < 0 → local maximum",
      "If D > 0 and fₓₓ > 0 → local minimum",
      "If D < 0 → saddle point",
      "If D = 0 → test is inconclusive",
    ],
    commonMistakes: [
      "Forgetting to check the sign of fₓₓ along with D — D > 0 alone doesn't tell you max vs min.",
      "Missing critical points by not solving the system of equations completely.",
      "Confusing saddle points with inconclusive results (D < 0 vs D = 0).",
    ],
    simulatorPlaceholder: "e.g. Find maxima and minima of f(x,y) = x³ + y³ − 3xy",
    examples: [
      {
        question: "Find and classify critical points of f(x,y) = x² + y² − 2x − 4y + 5",
        steps: [
          { label: "Find fₓ and f_y", formula: "f_x = 2x - 2 = 0 \\implies x = 1 \\quad f_y = 2y - 4 = 0 \\implies y = 2" },
          { label: "Critical point", text: "(1, 2) is the only critical point." },
          { label: "Second derivatives", formula: "f_{xx} = 2, \\quad f_{yy} = 2, \\quad f_{xy} = 0" },
          { label: "Compute D", formula: "D = (2)(2) - (0)^2 = 4 > 0", text: "Since D > 0 and fₓₓ = 2 > 0, this is a local minimum." },
        ],
        answer: "\\text{Local minimum at } (1, 2) \\text{ with } f(1,2) = 0",
      },
    ],
  },

  "lagrange-multiplier": {
    title: "Lagrange Multiplier",
    plainEnglish:
      "The method of Lagrange multipliers finds the maximum or minimum of a function subject to a constraint. Instead of substituting the constraint directly, you introduce a new variable (λ) and solve a system of equations.",
    intuition:
      "Imagine you're trying to find the highest point on a hiking trail, but the trail (constraint) doesn't go over the absolute peak. Lagrange multipliers find where the 'contour lines' of the function you're optimizing are tangent to the constraint curve — that's the optimal point on the constraint.",
    formalStatement: "\\nabla f = \\lambda \\nabla g \\quad \\text{subject to } g(x,y) = 0",
    conditions: [
      "There must be a constraint g(x,y) = 0 (or g(x,y) = c)",
      "Both f and g must have continuous partial derivatives",
      "∇g ≠ 0 at the constrained extremum (constraint qualification)",
    ],
    commonMistakes: [
      "Forgetting to include the constraint equation g(x,y) = 0 when solving the system.",
      "Not checking whether the solution is a max or min — Lagrange multipliers find both.",
      "Incorrectly setting up the gradients — ∂f/∂x = λ·∂g/∂x, not the other way around.",
    ],
    simulatorPlaceholder: "e.g. Maximize f(x,y) = xy subject to x + y = 10",
    examples: [
      {
        question: "Maximize f(x,y) = xy subject to x + y = 10",
        steps: [
          { label: "Set up equations", formula: "f_x = \\lambda g_x: \\quad y = \\lambda \\cdot 1 \\implies y = \\lambda" },
          { label: "Second equation", formula: "f_y = \\lambda g_y: \\quad x = \\lambda \\cdot 1 \\implies x = \\lambda" },
          { label: "From equations", text: "x = λ and y = λ, so x = y." },
          { label: "Use constraint", formula: "x + y = 10 \\implies 2x = 10 \\implies x = 5, \\; y = 5" },
        ],
        answer: "\\text{Maximum } f(5,5) = 25",
      },
    ],
  },

  // ── LESSON 4: Linear Systems ──
  "gauss-elimination": {
    title: "Gauss Elimination",
    plainEnglish:
      "Gauss elimination converts a system of linear equations into an upper triangular form using row operations, then uses back-substitution to find the values of the unknowns one by one.",
    intuition:
      "Think of it like simplifying a puzzle. You eliminate variables from equations one by one (from bottom to top), until the last equation has just one unknown. Then you work backwards to find all the others.",
    formalStatement: "[A|B] \\xrightarrow{\\text{row ops}} [U|B'] \\quad \\text{then back-substitute}",
    conditions: [
      "The system must be consistent (has at least one solution)",
      "The coefficient matrix should ideally have non-zero pivots",
      "Row operations: swap rows, multiply a row by a non-zero scalar, add a multiple of one row to another",
    ],
    commonMistakes: [
      "Arithmetic errors during row operations — be very careful with signs.",
      "Not choosing the best pivot (partial pivoting) which can lead to large rounding errors.",
      "Stopping after elimination without performing back-substitution.",
    ],
    simulatorPlaceholder: "e.g. Solve: 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3",
    examples: [
      {
        question: "Solve using Gauss elimination: x + y + z = 6, 2x + 3y + z = 14, x + 2y + 2z = 11",
        steps: [
          { label: "Form augmented matrix", formula: "\\begin{bmatrix} 1 & 1 & 1 & | & 6 \\\\ 2 & 3 & 1 & | & 14 \\\\ 1 & 2 & 2 & | & 11 \\end{bmatrix}" },
          { label: "R₂ → R₂ − 2R₁, R₃ → R₃ − R₁", formula: "\\begin{bmatrix} 1 & 1 & 1 & | & 6 \\\\ 0 & 1 & -1 & | & 2 \\\\ 0 & 1 & 1 & | & 5 \\end{bmatrix}" },
          { label: "R₃ → R₃ − R₂", formula: "\\begin{bmatrix} 1 & 1 & 1 & | & 6 \\\\ 0 & 1 & -1 & | & 2 \\\\ 0 & 0 & 2 & | & 3 \\end{bmatrix}" },
          { label: "Back-substitute", formula: "z = \\frac{3}{2}, \\quad y = 2 + z = \\frac{7}{2}, \\quad x = 6 - y - z = 1" },
        ],
        answer: "x = 1, \\quad y = \\frac{7}{2}, \\quad z = \\frac{3}{2}",
      },
    ],
  },

  "gauss-jordan": {
    title: "Gauss-Jordan Method",
    plainEnglish:
      "Gauss-Jordan is an extension of Gauss elimination that reduces the augmented matrix all the way to reduced row echelon form (RREF). Instead of just upper triangular, you also eliminate entries above each pivot, giving the solution directly without back-substitution.",
    intuition:
      "While Gauss elimination gets you halfway (upper triangular), Gauss-Jordan goes all the way — it turns the coefficient matrix into the identity matrix, so the answer column directly gives you each variable's value.",
    formalStatement: "[A|B] \\xrightarrow{\\text{row ops}} [I|X] \\quad \\text{where } X \\text{ is the solution}",
    conditions: [
      "Same as Gauss elimination — the system must be consistent",
      "Additional row operations are needed to eliminate entries above pivots",
      "The diagonal entries are all normalized to 1",
    ],
    commonMistakes: [
      "Not normalizing pivot rows to have 1 on the diagonal.",
      "Only doing forward elimination (that's just Gauss, not Gauss-Jordan).",
      "Sign errors when eliminating entries above pivots.",
    ],
    simulatorPlaceholder: "e.g. Solve using Gauss-Jordan: 2x + y = 5, x − y = 1",
    examples: [
      {
        question: "Solve using Gauss-Jordan: 2x + y = 5, x − y = 1",
        steps: [
          { label: "Augmented matrix", formula: "\\begin{bmatrix} 2 & 1 & | & 5 \\\\ 1 & -1 & | & 1 \\end{bmatrix}" },
          { label: "R₁ ↔ R₂ (for cleaner pivot)", formula: "\\begin{bmatrix} 1 & -1 & | & 1 \\\\ 2 & 1 & | & 5 \\end{bmatrix}" },
          { label: "R₂ → R₂ − 2R₁", formula: "\\begin{bmatrix} 1 & -1 & | & 1 \\\\ 0 & 3 & | & 3 \\end{bmatrix}" },
          { label: "R₂ → R₂/3, then R₁ → R₁ + R₂", formula: "\\begin{bmatrix} 1 & 0 & | & 2 \\\\ 0 & 1 & | & 1 \\end{bmatrix}" },
        ],
        answer: "x = 2, \\quad y = 1",
      },
    ],
  },

  "lu-decomposition": {
    title: "LU Decomposition",
    plainEnglish:
      "LU decomposition factors a matrix A into the product of a lower triangular matrix L and an upper triangular matrix U. This makes solving systems Ax = b efficient: first solve Ly = b (forward substitution), then Ux = y (back substitution).",
    intuition:
      "Instead of solving the full system directly, you 'pre-process' the matrix into two simpler triangular forms. This is especially useful when you need to solve the same system with multiple right-hand sides — the LU factorization only needs to be done once.",
    formalStatement: "A = LU \\quad \\text{where L is lower triangular, U is upper triangular}",
    conditions: [
      "The matrix A must be square",
      "All leading principal minors of A must be non-zero (for LU without pivoting)",
      "L has 1s on its diagonal; U has the pivots on its diagonal",
    ],
    commonMistakes: [
      "Confusing which matrix (L or U) has 1s on the diagonal — L has 1s by convention.",
      "Not recognizing when LU decomposition without pivoting fails (zero pivot).",
      "Mixing up forward and back substitution — Ly = b first, then Ux = y.",
    ],
    simulatorPlaceholder: "e.g. Find LU decomposition of A = [[2,1,1],[4,3,3],[8,7,9]]",
    examples: [
      {
        question: "Find LU decomposition of A = [[1,2],[3,4]]",
        steps: [
          { label: "Start with A", formula: "A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}" },
          { label: "Eliminate: R₂ → R₂ − 3R₁", formula: "U = \\begin{bmatrix} 1 & 2 \\\\ 0 & -2 \\end{bmatrix}", text: "The multiplier 3 goes into L." },
          { label: "Form L and U", formula: "L = \\begin{bmatrix} 1 & 0 \\\\ 3 & 1 \\end{bmatrix}, \\quad U = \\begin{bmatrix} 1 & 2 \\\\ 0 & -2 \\end{bmatrix}" },
        ],
        answer: "A = LU = \\begin{bmatrix} 1 & 0 \\\\ 3 & 1 \\end{bmatrix} \\begin{bmatrix} 1 & 2 \\\\ 0 & -2 \\end{bmatrix}",
      },
    ],
  },

  // ── LESSON 5: Eigen Analysis ──
  "eigenvalues": {
    title: "Eigenvalues",
    plainEnglish:
      "Eigenvalues are special scalars λ associated with a square matrix A. They represent the factors by which the matrix stretches or compresses space along certain directions (eigenvectors). You find them by solving det(A − λI) = 0.",
    intuition:
      "When a matrix transforms a vector and the result is just a scaled version of the original vector (same direction, just longer or shorter), the scaling factor is the eigenvalue. The direction that doesn't change is the eigenvector.",
    formalStatement: "\\det(A - \\lambda I) = 0 \\quad \\text{(characteristic equation)}",
    conditions: [
      "A must be a square matrix",
      "The characteristic polynomial is of degree n for an n×n matrix",
      "Eigenvalues can be real or complex numbers",
    ],
    commonMistakes: [
      "Sign errors when computing (A − λI) — be careful with the diagonal subtraction.",
      "Arithmetic mistakes in expanding the determinant, especially for 3×3 matrices.",
      "Forgetting that repeated eigenvalues are possible (algebraic multiplicity).",
    ],
    simulatorPlaceholder: "e.g. Find eigenvalues of A = [[4,1],[2,3]]",
    examples: [
      {
        question: "Find eigenvalues of A = [[4,1],[2,3]]",
        steps: [
          { label: "Form A − λI", formula: "A - \\lambda I = \\begin{bmatrix} 4-\\lambda & 1 \\\\ 2 & 3-\\lambda \\end{bmatrix}" },
          { label: "Set det = 0", formula: "(4-\\lambda)(3-\\lambda) - 2 = 0" },
          { label: "Expand", formula: "\\lambda^2 - 7\\lambda + 10 = 0" },
          { label: "Solve", formula: "(\\lambda - 5)(\\lambda - 2) = 0 \\implies \\lambda = 5, \\; \\lambda = 2" },
        ],
        answer: "\\lambda_1 = 5, \\quad \\lambda_2 = 2",
      },
    ],
  },

  "eigenvectors": {
    title: "Eigenvectors",
    plainEnglish:
      "Once you have the eigenvalues, eigenvectors are the non-zero vectors that satisfy (A − λI)x = 0 for each eigenvalue λ. They represent the 'special directions' along which the matrix only scales, without rotating.",
    intuition:
      "If eigenvalues tell you 'how much' the matrix stretches, eigenvectors tell you 'in which direction' it stretches. Together they completely characterize the matrix's behavior.",
    formalStatement: "(A - \\lambda I) \\mathbf{x} = \\mathbf{0}",
    conditions: [
      "First find the eigenvalues λ",
      "For each λ, solve the homogeneous system (A − λI)x = 0",
      "The solution space (null space) gives the eigenvectors",
    ],
    commonMistakes: [
      "Reporting the zero vector as an eigenvector — eigenvectors must be non-zero.",
      "Not finding all linearly independent eigenvectors for a repeated eigenvalue.",
      "Arithmetic errors in row reduction of (A − λI).",
    ],
    simulatorPlaceholder: "e.g. Find eigenvectors of A = [[4,1],[2,3]]",
    examples: [
      {
        question: "Find eigenvectors of A = [[4,1],[2,3]] (eigenvalues are λ = 5 and λ = 2)",
        steps: [
          { label: "For λ = 5", formula: "(A - 5I) = \\begin{bmatrix} -1 & 1 \\\\ 2 & -2 \\end{bmatrix}", text: "Row reduce: R₂ → R₂ + 2R₁ gives [[-1,1],[0,0]]. So x₁ = x₂." },
          { label: "Eigenvector for λ = 5", formula: "\\mathbf{x}_1 = t\\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}" },
          { label: "For λ = 2", formula: "(A - 2I) = \\begin{bmatrix} 2 & 1 \\\\ 2 & 1 \\end{bmatrix}", text: "Row reduce gives [[2,1],[0,0]]. So x₁ = −x₂/2." },
          { label: "Eigenvector for λ = 2", formula: "\\mathbf{x}_2 = t\\begin{bmatrix} 1 \\\\ -2 \\end{bmatrix}" },
        ],
        answer: "\\mathbf{x}_1 = \\begin{bmatrix}1\\\\1\\end{bmatrix}, \\quad \\mathbf{x}_2 = \\begin{bmatrix}1\\\\-2\\end{bmatrix}",
      },
    ],
  },

  "cayley-hamilton": {
    title: "Cayley-Hamilton Theorem",
    plainEnglish:
      "The Cayley-Hamilton theorem states that every square matrix satisfies its own characteristic equation. If the characteristic polynomial is p(λ), then substituting the matrix A in place of λ gives the zero matrix: p(A) = 0.",
    intuition:
      "It's like a matrix 'knows' its own DNA. The characteristic equation defines the matrix's identity, and the matrix itself perfectly satisfies that identity. This is useful for computing matrix inverses and high powers of matrices.",
    formalStatement: "\\text{If } p(\\lambda) = \\det(A - \\lambda I) = 0, \\text{ then } p(A) = O \\text{ (zero matrix)}",
    conditions: [
      "A must be a square matrix",
      "p(λ) is the characteristic polynomial of A",
      "The theorem works for any square matrix, real or complex",
    ],
    commonMistakes: [
      "Confusing p(A) = 0 with p(λ) = 0 — the former uses the matrix, the latter uses scalars.",
      "Forgetting that when you substitute A, the constant term c becomes c·I (times the identity matrix).",
      "Not using the theorem efficiently — it's a powerful tool for finding A⁻¹ and powers of A.",
    ],
    simulatorPlaceholder: "e.g. Verify Cayley-Hamilton for A = [[1,2],[3,4]]",
    examples: [
      {
        question: "Verify Cayley-Hamilton theorem for A = [[1,2],[3,4]]",
        steps: [
          { label: "Find characteristic equation", formula: "\\det(A - \\lambda I) = (1-\\lambda)(4-\\lambda) - 6 = \\lambda^2 - 5\\lambda - 2 = 0" },
          { label: "Substitute A into p(λ)", formula: "p(A) = A^2 - 5A - 2I" },
          { label: "Compute A²", formula: "A^2 = \\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix} = \\begin{bmatrix}7&10\\\\15&22\\end{bmatrix}" },
          { label: "Verify p(A) = 0", formula: "\\begin{bmatrix}7&10\\\\15&22\\end{bmatrix} - \\begin{bmatrix}5&10\\\\15&20\\end{bmatrix} - \\begin{bmatrix}2&0\\\\0&2\\end{bmatrix} = \\begin{bmatrix}0&0\\\\0&0\\end{bmatrix}" },
        ],
        answer: "p(A) = A^2 - 5A - 2I = O \\quad \\checkmark",
      },
    ],
  },
};

export function getTopicContent(slug: string): TopicContent | undefined {
  return topicData[slug];
}

export function getAllTopicSlugs(): string[] {
  return Object.keys(topicData);
}
