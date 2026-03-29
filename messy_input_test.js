const messyQuestions = [
  {
    name: "Messy LMVT (no formula format)",
    topic: "lmvt",
    question: "Prove that at least once the car's instantaneous speed is 60 mph during a 2-hour trip where total distance was 120 miles and speed is modeled as 50 + 10t"
  },
  {
    name: "Messy Rolle's (informal, no interval notation)",
    topic: "rolles-theorem",
    question: "Temperature T of a rod between points 0 and 4 is T(x)=x^3-6x^2+11x-6. The endpoints have the same temperature. Where is the temperature gradient zero?"
  },
  {
    name: "Messy Integration (pure English, no symbols)",
    topic: "bernoullis-formula",
    question: "Calculate the integral of x squared times exponential of x from zero to two"
  },
  {
    name: "Messy Euler's (vague wording)",
    topic: "eulers-theorem",
    question: "Show that x cubed plus y cubed satisfies euler theorem for homogeneous functions"
  },
  {
    name: "Messy Lagrange (informal constraints)",
    topic: "lagrange-multiplier",
    question: "Find where f = xy is maximum if x plus y equals 10"
  },
];

async function runMessyTest() {
  console.log("🧪 MESSY INPUT TEST — Testing AI Fallback...\n");
  let pass = 0, fail = 0;

  for (const t of messyQuestions) {
    console.log(`Testing: ${t.name}`);
    console.log(`  Input: "${t.question.substring(0, 80)}..."`);
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.question, topic: t.topic })
      });
      const data = await res.json();
      
      const hasAIStep = data.steps?.some(s => s.title === "AI Translation");
      
      if (data.finalAnswer && !data.finalAnswer.includes('Parsing Error') && !data.finalAnswer.includes('Error processing')) {
        console.log(`  ✅ PASS ${hasAIStep ? '(AI Translated)' : '(Direct Solve)'}`);
        console.log(`  Answer: ${data.finalAnswer.substring(0, 100)}`);
        pass++;
      } else {
        console.log(`  ❌ FAIL`);
        console.log(`  Answer: ${data.finalAnswer}`);
        if (data.steps?.[0]) console.log(`  Error: ${data.steps[0].explanation}`);
        fail++;
      }
    } catch (err) {
      console.log(`  ❌ CRASH: ${err.message}`);
      fail++;
    }
    console.log("");
  }
  console.log(`\nRESULTS: ${pass} PASSED, ${fail} FAILED out of ${messyQuestions.length}`);
}

runMessyTest();
