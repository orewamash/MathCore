const testCases = [
  // ═══════ UNIT 1: Calculus (Rolle's & LMVT) ═══════
  { name: "01. Rolle's (Standard)", topic: "rolles-theorem", question: "f(x) = x^3 - 4x on [-2, 2]" },
  { name: "02. Rolle's (Messy Text)", topic: "rolles-theorem", question: "Please verify rolles theorem for the equation given by x^2 - 3x + 2 where the interval is between points 1 and 2." },
  { name: "03. LMVT (Standard)", topic: "lmvt", question: "f(x) = x^2 - 4x - 5 on [0, 4]" },
  { name: "04. LMVT (Trigonometry / Paragraph)", topic: "lmvt", question: `A particle moves along a straight line.
Its displacement s(t) after t seconds is s(t) = 5sin(t) + 2cos(t)
Verify LMVT for this particle in the time (0, 3.14).` },

  // ═══════ UNIT 2: Integration ═══════
  { name: "05. Integration by Parts (Standard)", topic: "integration-by-parts", question: "integrate x * sin(x) dx" },
  { name: "06. Integration by Parts (Noisy)", topic: "integration-by-parts", question: "Hey solver, evaluate the integral of x^2 * e^(2x) using parts method." },
  { name: "07. Bernoulli's Formula (Polynomial)", topic: "bernoullis-formula", question: "∫ x^3 * e^-x" },
  { name: "08. Bernoulli's Formula (Definite Word Problem)", topic: "bernoullis-formula", question: "The probability density function is given by f(x) = x^2 * e^(-x). Find the integral from 0 to 5 using bernoullis formula." },
  { name: "09. Double Integration (Standard)", topic: "double-integration", question: "∫0^2 ∫0^x (x^2 + y^2) dy dx" },
  { name: "10. Double Integration (Function mode)", topic: "double-integration", question: "f(x,y) = x*y + 2" },
  { name: "11. Triple Integration (Standard)", topic: "triple-integration", question: "∫0^1 ∫0^1 ∫0^x (x*y*z) dz dy dx" },
  { name: "12. Triple Integration (No Limits)", topic: "triple-integration", question: "integrate xyz" },

  // ═══════ UNIT 3: Partial Derivatives ═══════
  { name: "13. Euler's Theorem (Polynomial)", topic: "eulers-theorem", question: "f(x,y) = x^4 + y^4 - 2x^2y^2" },
  { name: "14. Euler's Theorem (Square Root)", topic: "eulers-theorem", question: "Verify eulers theorem for f(x,y) = sqrt(x) + sqrt(y)." },
  { name: "15. Jacobian (Polar to Cartesian)", topic: "jacobian", question: "x = r*cos(theta), y = r*sin(theta)" },
  { name: "16. Jacobian (Custom variables)", topic: "jacobian", question: "x = u^2 - v^2, y = 2*u*v" },
  { name: "17. Maxima & Minima (Polynomial)", topic: "maxima-minima", question: "f(x,y) = x^3 + y^3 - 3x - 12y" },
  { name: "18. Maxima & Minima (With conversational text)", topic: "maxima-minima", question: "Find all local maxima, minima and saddle points for the surface given by z = x^2 + x*y + y^2 + 3x - 3y + 4" },
  { name: "19. Lagrange Multiplier (Standard)", topic: "lagrange-multiplier", question: "f(x,y) = x*y subject to x + y = 10" },
  { name: "20. Lagrange Multiplier (Physics Cost)", topic: "lagrange-multiplier", question: "Minimize the cost function Cost(x,y) = x^2 + y^2 given the production constraint x + 2y - 4 = 0." },

  // ═══════ UNIT 4 & 5: Matrix Solvers ═══════
  { name: "21. Gauss Jordan (3x4 Augmented)", topic: "gauss-jordan", question: "1, 1, 1, 9 | 2, -3, 4, 13 | 3, 4, 5, 40" },
  { name: "22. Gauss Jordan (2x3 Systems)", topic: "gauss-jordan", question: "[[2, 1, 5], [1, -1, 1]]" },
  { name: "23. Gauss Elimination (Standard)", topic: "gauss-elimination", question: "1, 1, 1, 9 | 2, -3, 4, 13 | 3, 4, 5, 40" },
  { name: "24. Gauss Elimination (Decimal values)", topic: "gauss-elimination", question: "1.5, 2.5, 3.5 | 4.1, 5.2, 6.3" },
  { name: "25. LU Decomposition (3x3 Matrix)", topic: "lu-decomposition", question: "4, 3, -1 | -2, -4, 5 | 1, 2, 6" },
  { name: "26. LU Decomposition (2x2 Matrix)", topic: "lu-decomposition", question: "2, 3 | 4, 7" },
  { name: "27. Eigenvalues (3x3 - Warning Supported)", topic: "eigenvalues", question: "1, 0, 0 | 0, 2, 0 | 0, 0, 3" },
  { name: "28. Eigenvectors (2x2 Matrix)", topic: "eigenvectors", question: "5, 4 | 1, 2" },
  { name: "29. Cayley-Hamilton (Verify)", topic: "cayley-hamilton", question: "2, -1 | 1, 3" },
  { name: "30. Cayley-Hamilton (Matrix formatting noise)", topic: "cayley-hamilton", question: "Find cayley hamilton for this matrix: [[1, 2], [3, 4]] please." },
];

async function runMegaTest() {
  console.log("═══════════════════════════════════════════════════════");
  console.log(" 🚀 MEGA MOCK TEST — 30 QUESTIONS TO ALL SIMULATORS 🚀");
  console.log("═══════════════════════════════════════════════════════\n");

  let pass = 0, fail = 0;

  for (const t of testCases) {
    process.stdout.write(`Testing ${t.name} ... `);
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.question, topic: t.topic })
      });
      const data = await res.json();
      
      const isError = data.finalAnswer?.includes('Error') || data.finalAnswer?.includes('Parsing Error') || data.error;
      const aiUsed = data.steps?.some(s => s.title === "AI Translation") ? "🤖 AI" : "⚙️ Logic";

      if (!isError && data.finalAnswer) {
        console.log(`✅ PASS [${aiUsed}]`);
        let ans = data.finalAnswer.replace(/\n/g, ' ').substring(0, 75);
        console.log(`  ↳ Answer: ${ans}...`);
        pass++;
      } else {
        console.log(`❌ FAIL`);
        console.log(`  ↳ Reason: ${data.finalAnswer || data.error}`);
        if (data.steps?.[0]) console.log(`  ↳ Details: ${data.steps[0].explanation}`);
        fail++;
      }
    } catch (err) {
      console.log(`❌ SYSTEM CRASH: ${err.message}`);
      fail++;
    }
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`   FINAL TALLY: ${pass} PASSED, ${fail} FAILED (Total: ${testCases.length})`);
  console.log("═══════════════════════════════════════════════════════");
}

runMegaTest();
