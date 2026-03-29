const topics = [
    { topic: "lu-decomposition", question: "rows: 1, 2 | 3, 4" },
    { topic: "lu-decomposition", question: "rows: 1, 2 | 3, 4 | " },
    { topic: "cayley-hamilton", question: "Verify Cayley-Hamilton for A = [[1,2],[3,4]]" },
    { topic: "eulers-theorem", question: "Verify Euler's theorem for f(x,y) = x^3 + 3x^2y + y^3" },
    { topic: "maxima-minima", question: "f(x,y) = x^3 + y^3 - 3xy" },
    { topic: "maxima-minima", question: "x^3 + y^3 - 3xy" },
    { topic: "triple-integration", question: "∫₀¹ ∫₀ˣ ∫₀ˣ⁺ʸ (x + y + z) dz dy dx"}
];

async function test() {
    for (const t of topics) {
        try {
            const res = await fetch("http://localhost:3000/api/simulator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(t)
            });
            const data = await res.json();
            console.log(`\n--- ${t.topic} ---`);
            console.log("Input:", t.question);
            console.log("Status:", res.status);
            if (data.error) console.log("Error:", data.error);
            else if (data.finalAnswer) console.log("Final Answer:", data.finalAnswer);
            else {
                 if (data.steps && data.steps.length > 0 && data.steps[0].title === "Solver Inference Error") {
                     console.log("Solver Error:", data.steps[0].explanation);
                 } else {
                     console.log("Data:", data);
                 }
            }
        } catch (e) {
            console.log(`Failed ${t.topic}:`, e);
        }
    }
}
test();
