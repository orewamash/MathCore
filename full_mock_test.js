const testCases = [
  // ═══════ UNIT 1: Calculus ═══════
  {
    name: "1. Rolle's Theorem (polynomial)",
    topic: "rolles-theorem",
    question: "f(x) = x^2 - 5x + 6 on [2, 3]"
  },
  {
    name: "2. Rolle's Theorem (word problem)",
    topic: "rolles-theorem",
    question: `A displacement function of a pendulum is given by 
s(t) = t^2 - 4t + 3 
Verify Rolle's theorem on the interval [1, 3].`
  },
  {
    name: "3. LMVT (standard)",
    topic: "lmvt",
    question: "f(x) = x^2 + 2x on [1, 3]"
  },
  {
    name: "4. LMVT (train word problem - multi-line)",
    topic: "lmvt",
    question: `A train travels from Station P to Station Q, which are 150 km apart, in 3 hours. The speed
of the train at time 't' hours is given by

v(t) = 40+10t+15sin(3.14t/3)

then verify
Lagrange's mean value theorem for the journey by finding at least one-time t = c in (0,3)
such that the instantaneous speed equals the average speed of the train.`
  },

  // ═══════ UNIT 2: Integration ═══════
  {
    name: "5. Integration by Parts (standard)",
    topic: "integration-by-parts",
    question: "integrate x * e^x dx"
  },
  {
    name: "6. Integration by Parts (word problem)",
    topic: "integration-by-parts",
    question: `The power dissipated in a resistor is given by
P(t) = t * sin(t)
Find the total energy from 0 to 3.14 using integration by parts.`
  },
  {
    name: "7. Bernoulli's Formula (standard)",
    topic: "bernoullis-formula",
    question: "integrate x^2 * e^x dx"
  },
  {
    name: "8. Bernoulli's Formula (word problem)",
    topic: "bernoullis-formula",
    question: `The current in an electric circuit varies by I(t) = (4t^2 + 3)e^-0.2t. Obtain the total charge flow from 0 to 10 seconds by Bernoulli's formula of integration.`
  },
  {
    name: "9. Double Integration",
    topic: "double-integration",
    question: "∫0^1 ∫0^x (x + y) dy dx"
  },
  {
    name: "10. Triple Integration",
    topic: "triple-integration",
    question: "∫0^1 ∫0^1 ∫0^1 x*y*z dz dy dx"
  },

  // ═══════ UNIT 3: Partial Derivatives ═══════
  {
    name: "11. Euler's Theorem (standard)",
    topic: "eulers-theorem",
    question: "f(x,y) = x^3 + 3*x^2*y + y^3"
  },
  {
    name: "12. Euler's Theorem (word problem)",
    topic: "eulers-theorem",
    question: `The magnitude of the electric field E(x,y) = sqrt(4x^2 + 9y^2) compute x dE/dx + y dE/dy`
  },
  {
    name: "13. Jacobian",
    topic: "jacobian",
    question: "x = r*cos(theta), y = r*sin(theta)"
  },
  {
    name: "14. Maxima & Minima",
    topic: "maxima-minima",
    question: "f(x,y) = x^3 + y^3 - 3*x*y"
  },
  {
    name: "15. Lagrange Multiplier (word problem)",
    topic: "lagrange-multiplier",
    question: `A machine-vision module defines clarity function C(x,y) = 26x + 14y - (5x^2 + 3y^2) subject to x + y = 9. Find x and y that maximize it.`
  },

  // ═══════ UNIT 4 & 5: Matrix / Linear Algebra ═══════
  {
    name: "16. Gauss Jordan",
    topic: "gauss-jordan",
    question: "2, 1, -1, 8 | -3, -1, 2, -11 | -2, 1, 2, -3"
  },
  {
    name: "17. Gauss Elimination",
    topic: "gauss-elimination",
    question: "2, 1, -1, 8 | -3, -1, 2, -11 | -2, 1, 2, -3"
  },
  {
    name: "18. LU Decomposition",
    topic: "lu-decomposition",
    question: "2, 1, 0 | 1, 3, 2 | 0, 2, 4"
  },
  {
    name: "19. Eigenvalues",
    topic: "eigenvalues",
    question: "4, 1 | 2, 3"
  },
  {
    name: "20. Eigenvectors",
    topic: "eigenvectors",
    question: "4, 1 | 2, 3"
  },
  {
    name: "21. Cayley-Hamilton",
    topic: "cayley-hamilton",
    question: "1, 2 | 3, 4"
  },
];

async function runFullMockTest() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("   MATHCORE FULL MOCK TEST — ALL 15+ SIMULATORS");
  console.log("═══════════════════════════════════════════════════════\n");

  let pass = 0, fail = 0;

  for (const t of testCases) {
    process.stdout.write(`Testing ${t.name}... `);
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.question, topic: t.topic })
      });
      const data = await res.json();
      if (data.finalAnswer && !data.finalAnswer.includes('Error') && !data.finalAnswer.includes('Parsing Error')) {
        console.log(`✅ PASS`);
        console.log(`   Answer: ${data.finalAnswer.substring(0, 120)}`);
        console.log(`   Steps: ${data.steps?.length || 0}`);
        pass++;
      } else {
        console.log(`❌ FAIL`);
        console.log(`   Answer: ${data.finalAnswer}`);
        if (data.steps && data.steps[0]) {
          console.log(`   Error: ${data.steps[0].explanation}`);
        }
        fail++;
      }
    } catch (err) {
      console.log(`❌ CRASH: ${err.message}`);
      fail++;
    }
    console.log("");
  }

  console.log("═══════════════════════════════════════════════════════");
  console.log(`   RESULTS: ${pass} PASSED, ${fail} FAILED out of ${testCases.length}`);
  console.log("═══════════════════════════════════════════════════════");
}

runFullMockTest();
