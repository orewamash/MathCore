const testCases = [
  {
    unit: "Unit 1: LMVT (Train Problem)",
    topic: "lmvt",
    question: "A train travels from Station P to Station Q, which are 150 km apart, in 3 hours. The speed of the train at time ‘t’ hours is given by v(t) = 40+10t+15sin(3.14t/3) verify Lagrange’s mean value theorem for the journey by finding at least one-time t = c in (0,3) such that the instantaneous speed equals the average speed of the train."
  },
  {
    unit: "Unit 2: Bernoulli (Charge Problem)",
    topic: "bernoullis-formula",
    question: "The current in an electric circuit varies by I(t) = (4t^2 + 3)e^-0.2t. Obtain the total charge flow from 0 to 10 seconds by Bernoulli's formula of integration."
  },
  {
    unit: "Unit 3: Euler's (Magnetic Field)",
    topic: "eulers-theorem",
    question: "The magnetic of the electric field E(x,y) = sqrt(4x^2 + 9y^2) compute x dE/dx + y dE/dy"
  },
  {
    unit: "Unit 3: Lagrange Multiplier (Machine Vision)",
    topic: "lagrange-multiplier",
    question: "A machine-vision modules defines clarity function C(x,y) = 26x + 14y - (5x^2 + 3y^2) subject to x + y = 9. Find x and y that maximize it."
  }
];

async function runTests() {
  console.log("🚀 Starting Unit-by-Unit Mock Test (Round 2)...\n");
  for (const t of testCases) {
    console.log(`Testing ${t.unit}...`);
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.question, topic: t.topic })
      });
      const data = await res.json();
      if (data.finalAnswer && !data.finalAnswer.includes('Error') && !data.finalAnswer.includes('Parsing Error')) {
        console.log(`✅ SUCCESS: ${data.finalAnswer}`);
      } else {
        console.log(`❌ FAILED: ${data.finalAnswer}`);
        if (data.steps) {
            console.log("   Execution Step 0:", data.steps[0].title);
            console.log("   Error Detail:", data.steps[0].explanation);
        }
      }
    } catch (err) {
      console.log(`❌ SYSTEM ERROR: ${err.message}`);
    }
    console.log("-----------------------------------\n");
  }
}

runTests();
