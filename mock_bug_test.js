const testCases = [
  {
    name: "Zero Pivot (LU Decomposition)",
    topic: "lu-decomposition",
    question: "[[0, 1], [1, 1]]",
    expected: "Error: Zero pivot"
  },
  {
    name: "Non-Square Matrix (Eigen)",
    topic: "eigenvalues",
    question: "[[1, 2, 3], [4, 5, 6]]",
    expected: "Error: Square matrix required"
  },
  {
    name: "Garbage Input",
    topic: "lmvt",
    question: "This is not math at all.",
    expected: "Error: Format: f(x) = <expr> on [a, b]"
  },
  {
    name: "Divide by Zero (Calculus)",
    topic: "lmvt",
    question: "f(x) = 1/(x-1) on [1, 2]",
    expected: "Graceful error or division by zero handling"
  },
  {
    name: "4x4 Matrix (Unsupported)",
    topic: "cayley-hamilton",
    question: "[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]",
    expected: "Error: solver supports 2x2 and 3x3"
  }
];

async function runBugTest() {
  console.log("🐞 Starting Mock Bug Test...\n");
  for (const t of testCases) {
    console.log(`Testing ${t.name}...`);
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.question, topic: t.topic })
      });
      const data = await res.json();
      if (data.error || (data.finalAnswer && data.finalAnswer.includes('Error'))) {
        console.log(`✅ CAUGHT: ${data.error || data.finalAnswer}`);
      } else {
        console.log(`⚠️ UNCAUGHT: Returned ${data.finalAnswer || 'success'}`);
      }
    } catch (err) {
      console.log(`❌ SYSTEM CRASH: ${err.message}`);
    }
    console.log("-----------------------------------\n");
  }
}

runBugTest();
