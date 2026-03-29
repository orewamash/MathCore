const testCases = [
  { topic: 'rolles-theorem', q: 'f(x) = x^2 - 4 on [-2, 2]' },
  { topic: 'lmvt', q: 'f(x) = x^2 on [1, 3]' },
  { topic: 'integration-by-parts', q: 'x * e^x' },
  { topic: 'bernoullis-formula', q: 'x^2 * e^x' },
  { topic: 'double-integration', q: '∫ 0^1 ∫ 0^2 (x*y) dy dx' },
  { topic: 'triple-integration', q: '∫ 0^1 ∫ 0^1 ∫ 0^1 (xyz) dz dy dx' },
  { topic: 'eulers-theorem', q: 'f(x,y) = x^3 + y^3' },
  { topic: 'jacobian', q: 'x = r * cos(theta), y = r * sin(theta)' },
  { topic: 'maxima-minima', q: 'f(x,y) = x^3 + y^3 - 3*x*y' },
  { topic: 'lagrange-multiplier', q: 'maximize f(x,y) = x*y subject to x + y - 10 = 0' },
  { topic: 'gauss-jordan', q: '2, 1, -1, 8 | -3, -1, 2, -11 | -2, 1, 2, -3' },
  { topic: 'gauss-elimination', q: '2, 1, -1, 8 | -3, -1, 2, -11 | -2, 1, 2, -3' },
  { topic: 'lu-decomposition', q: '1, 2, 3 | 2, 8, 22 | 3, 22, 82' },
  { topic: 'eigenvalues', q: '4, -5 | 2, -3' },
  { topic: 'eigenvectors', q: '4, -5 | 2, -3' },
  { topic: 'cayley-hamilton', q: '1, 2 | 3, 4' },
];

async function runTests() {
  console.log("Starting backend tests against http://localhost:3000/api/simulator...\n");
  for (let t of testCases) {
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.q, topic: t.topic })
      });
      const data = await res.json();
      if (data.finalAnswer && !data.finalAnswer.includes('Error') && !data.finalAnswer.includes('Please try')) {
        console.log(`✅ [${t.topic}] - PASSED (${data.finalAnswer.slice(0, 100).replace(/\n/g, ' ')})`);
      } else {
        console.log(`❌ [${t.topic}] - FAILED / ERROR:`);
        console.log(`   Q: ${t.q}`);
        console.log(`   Final Answer Output: ${data.finalAnswer}`);
        console.dir(data.steps, { depth: null });
        console.log('---');
      }
    } catch (err) {
      console.log(`❌ [${t.topic}] - FETCH FAILED: ${err.message}`);
    }
  }
}

runTests();
