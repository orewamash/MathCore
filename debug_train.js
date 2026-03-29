function normalizeMathString(str) {
  return str
    .replace(/(\d)([a-z\(])/gi, '$1*$2');
}

function debug() {
    const question = `A train travels from Station P to Station Q, which are 150 km apart, in 3 hours. The speed
of the train at time 't' hours is given by

v(t) = 40+10t+15sin(3.14t/3)

then verify
Lagrange's mean value theorem for the journey by finding at least one-time t = c in (0,3)
such that the instantaneous speed equals the average speed of the train.`;

    console.log("--- Input ---");
    console.log(question);
    console.log("\n--- Regex Match Attempts ---");

    const funcMatch = question.match(/([a-zA-Z])\(([a-z])\)\s*=\s*(.+?)(?:\s+on|\s+verify|\s+find|\s+in|\s+for|$)/i);
    const intervalMatch = question.match(/[\[\(]\s*([^,\[\(]+)\s*,\s*([^,\]\)]+)\s*[\]\)]/);

    console.log("funcMatch:", funcMatch ? [funcMatch[1], funcMatch[2], funcMatch[3]] : "NOT FOUND");
    console.log("intervalMatch:", intervalMatch ? [intervalMatch[1], intervalMatch[2]] : "NOT FOUND");

    if(funcMatch) {
        const funcStr = normalizeMathString(funcMatch[3].trim());
        console.log("\nfuncStr (normalized):", funcStr);
    }
    if(intervalMatch) {
        console.log("a:", intervalMatch[1].trim(), "b:", intervalMatch[2].trim());
    }
}

debug();
