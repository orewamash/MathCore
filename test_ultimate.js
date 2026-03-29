const testCases = [
  // 1. Rolle's Theorem
  { name: 'Rolles Standard', topic: 'rolles-theorem', question: 'f(x) = x^3 - 4x on [-2, 2]', mode: 'standard' },
  { name: 'Rolles Conversational Pure', topic: 'rolles-theorem', question: 'verify rolles theorem for the function given by x squared minus four x on the interval between minus two and two', mode: 'english' },
  { name: 'Rolles Conversational Mixed', topic: 'rolles-theorem', question: 'Please verify rolles theorem for the equation given by f(x) = x^2 - 4x where the interval is between points -2 and 2.', mode: 'english' },

  // 2. LMVT
  { name: 'LMVT Standard', topic: 'lmvt', question: 'f(x) = x^2 - 4x - 5 on [0, 4]', mode: 'standard' },
  { name: 'LMVT Conversational Pure', topic: 'lmvt', question: 'find the lagrange mean value for the function given by x squared minus four x minus five between the limits zero and four', mode: 'english' },
  { name: 'LMVT Conversational Mixed', topic: 'lmvt', question: 'A particle displacement s(t) is s(t) = t^2 - 4t - 5. limits are 0 to 4. verify LMVT.', mode: 'english' },

  // 3. Integration by Parts
  { name: 'IBP Standard', topic: 'integration-by-parts', question: 'integrate x * sin(x) dx', mode: 'standard' },
  { name: 'IBP Conversational Pure', topic: 'integration-by-parts', question: 'evaluate the integral of x multiplied by sine of x using integration by parts', mode: 'english' },
  { name: 'IBP Conversational Mixed', topic: 'integration-by-parts', question: 'evaluate the integral of x^2 * e^(2x) using parts method.', mode: 'english' },
  { name: 'IBP Standard Bounds', topic: 'integration-by-parts', question: '∫0^1 x * e^x dx', mode: 'standard' },

  // 4. Bernoullis Formula
  { name: 'Bernoulli Standard', topic: 'bernoullis-formula', question: '∫ x^3 * e^-x dx', mode: 'standard' },
  { name: 'Bernoulli Conversational Pure', topic: 'bernoullis-formula', question: 'integrate x cubed times e to the power of minus x using bernoulli formula', mode: 'english' },
  { name: 'Bernoulli Conversational Mixed', topic: 'bernoullis-formula', question: 'integrate x^3 * sin(2x) using bernoulli from 0 to 3.14', mode: 'english' },

  // 5. Double Integration
  { name: 'Double Int Standard', topic: 'double-integration', question: '∫0^2 ∫0^x (x^2 + y^2) dy dx', mode: 'standard' },
  { name: 'Double Int Conversational Pure', topic: 'double-integration', question: 'evaluate double integral of x squared plus y squared where inner limits are zero to x and outer limits zero to two', mode: 'english' },
  { name: 'Double Int Conversational Mixed', topic: 'double-integration', question: 'evaluate ∫0^2 ∫0^x (x^2 + y^2) dy dx', mode: 'english' },

  // 6. Triple Integration
  { name: 'Triple Int Standard', topic: 'triple-integration', question: '∫0^1 ∫0^1 ∫0^x (x*y*z) dz dy dx', mode: 'standard' },
  { name: 'Triple Int Conversational Pure', topic: 'triple-integration', question: 'evaluate triple integral of x times y times z over limits zero to one zero to one zero to x', mode: 'english' },
  { name: 'Triple Int Conversational Mixed', topic: 'triple-integration', question: 'integrate x*y*z for limits 0 to 1, 0 to 1, 0 to x dx dy dz', mode: 'english' },

  // 7. Euler's Theorem
  { name: 'Euler Standard', topic: 'eulers-theorem', question: 'f(x,y) = x^4 + y^4 - 2x^2y^2', mode: 'standard' },
  { name: 'Euler Conversational Pure', topic: 'eulers-theorem', question: 'verify eulers theorem for function given by square root of x plus square root of y', mode: 'english' },
  { name: 'Euler Conversational Mixed', topic: 'eulers-theorem', question: 'Verify eulers theorem for f(x,y) = sqrt(x) + sqrt(y).', mode: 'english' },

  // 8. Jacobian
  { name: 'Jacobian Standard', topic: 'jacobian', question: 'x = r*cos(theta), y = r*sin(theta)', mode: 'standard' },
  { name: 'Jacobian Conversational Pure', topic: 'jacobian', question: 'find jacobian where x is defined as u squared minus v squared and y is given by two u v', mode: 'english' },
  { name: 'Jacobian Conversational Mixed', topic: 'jacobian', question: 'compute jacobian x = u^2 - v^2, y = 2*u*v', mode: 'english' },

  // 9. Maxima Minima
  { name: 'MaxMin Standard', topic: 'maxima-minima', question: 'f(x,y) = x^3 + y^3 - 3x - 12y', mode: 'standard' },
  { name: 'MaxMin Conversational Pure', topic: 'maxima-minima', question: 'find maxima and minima for surface defined by x cubed plus y cubed minus three x minus twelve y', mode: 'english' },
  { name: 'MaxMin Conversational Mixed', topic: 'maxima-minima', question: 'Find all local maxima, minima for z = x^2 + x*y + y^2 + 3x - 3y + 4', mode: 'english' },

  // 10. Lagrange Multiplier
  { name: 'Lagrange Standard', topic: 'lagrange-multiplier', question: 'f(x,y) = x*y subject to x + y = 10', mode: 'standard' },
  { name: 'Lagrange Conversational Pure', topic: 'lagrange-multiplier', question: 'maximize function given by x squared plus y squared with constraint x plus two y minus four equals zero', mode: 'english' },
  { name: 'Lagrange Conversational Mixed', topic: 'lagrange-multiplier', question: 'Minimize Cost(x,y) = x^2 + y^2 given the constraint x + 2y - 4 = 0.', mode: 'english' },

  // 11. Gauss Jordan
  { name: 'Gauss Jordan Standard', topic: 'gauss-jordan', question: '1, 1, 1, 9 | 2, -3, 4, 13 | 3, 4, 5, 40', mode: 'standard' },
  { name: 'Gauss Jordan Conversational Pure', topic: 'gauss-jordan', question: 'solve using gauss jordan the system given by rows: 1 1 1 9 and 2 -3 4 13 and 3 4 5 40', mode: 'english' },
  { name: 'Gauss Jordan Conversational Mixed', topic: 'gauss-jordan', question: 'solve system [[2, 1, 5], [1, -1, 1]]', mode: 'english' },

  // 12. Gauss Elimination
  { name: 'Gauss Elimination Standard', topic: 'gauss-elimination', question: '1, 1, 1, 9 | 2, -3, 4, 13 | 3, 4, 5, 40', mode: 'standard' },
  { name: 'Gauss Elimination Conversational', topic: 'gauss-elimination', question: 'apply gauss elimination on rows: 1.5, 2.5, 3.5 | 4.1, 5.2, 6.3', mode: 'english' },
  
  // 13. LU Decomposition
  { name: 'LU Decomposition Standard', topic: 'lu-decomposition', question: '4, 3, -1 | -2, -4, 5 | 1, 2, 6', mode: 'standard' },
  { name: 'LU Decomposition Conversational', topic: 'lu-decomposition', question: 'perform lu on matrix [[2, 3], [4, 7]]', mode: 'english' },
  
  // 14. Eigenvalues
  { name: 'Eigenvalues Standard', topic: 'eigenvalues', question: '1, 0, 0 | 0, 2, 0 | 0, 0, 3', mode: 'standard' },
  { name: 'Eigenvalues Conversational', topic: 'eigenvalues', question: 'find eigenvalues for rows: 5, 4 | 1, 2', mode: 'english' },

  // 15. Eigenvectors
  { name: 'Eigenvectors Standard', topic: 'eigenvectors', question: '5, 4 | 1, 2', mode: 'standard' },
  { name: 'Eigenvectors Conversational', topic: 'eigenvectors', question: 'calculate eigenvectors for matrix [[5, 4], [1, 2]]', mode: 'english' },

  // 16. Cayley Hamilton
  { name: 'Cayley Hamilton Standard', topic: 'cayley-hamilton', question: '2, -1 | 1, 3', mode: 'standard' },
  { name: 'Cayley Hamilton Conversational', topic: 'cayley-hamilton', question: 'Verify cayley hamilton for this matrix: [[1, 2], [3, 4]] please.', mode: 'english' },
];

async function runUltimateTest() {
  let pass = 0, fail = 0;
  for (const t of testCases) {
    process.stdout.write(`Testing: ${t.name} ... `);
    try {
      const res = await fetch('http://localhost:3000/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: t.question, topic: t.topic, mode: t.mode })
      });
      const data = await res.json();
      
      const isError = data.finalAnswer?.includes('Error') || data.finalAnswer?.includes('Parsing Error') || data.error || data.finalAnswer?.includes('NaN') || data.finalAnswer?.includes('undefined');
      
      if (!isError && data.finalAnswer) {
        console.log(`✅ PASS`);
      } else {
        console.log(`❌ FAIL`);
        console.log(`   > Reason: ${data.finalAnswer || data.error}`);
        if(data.steps?.[0]) console.log(`   > Code/Details: ${data.steps[0].explanation}`);
        if(data.steps?.length > 1) console.log(`   > Penultimate step: ${data.steps[data.steps.length-1].explanation}`);
        fail++;
      }
    } catch(err) {
      console.log(`❌ CRASH: ${err.message}`);
      fail++;
    }
  }
  console.log(`\\nTotal: ${testCases.length}, Passed: ${pass}, Failed: ${fail}`);
}
runUltimateTest();
