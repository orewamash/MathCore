const trainProblem = `A train travels from Station P to Station Q, which are 150 km apart, in 3 hours. The speed
of the train at time 't' hours is given by

v(t) = 40+10t+15sin(3.14t/3)

then verify
Lagrange's mean value theorem for the journey by finding at least one-time t = c in (0,3)
such that the instantaneous speed equals the average speed of the train.`;

async function run() {
  console.log("🚀 Testing exact user problem (multi-line word problem)...\n");
  try {
    const res = await fetch('http://localhost:3000/api/simulator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: trainProblem, topic: 'lmvt' })
    });
    const data = await res.json();
    if (data.finalAnswer && !data.finalAnswer.includes('Error') && !data.finalAnswer.includes('Parsing Error')) {
      console.log(`✅ SUCCESS!`);
      console.log(`   Final Answer: ${data.finalAnswer}`);
      console.log(`   Steps generated: ${data.steps?.length || 0}`);
    } else {
      console.log(`❌ FAILED: ${data.finalAnswer}`);
      if (data.steps) console.log('   Error:', data.steps[0]?.explanation);
    }
  } catch (e) {
    console.log(`❌ SYSTEM ERROR: ${e.message}`);
  }
}
run();
