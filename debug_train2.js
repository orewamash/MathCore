function debug() {
    const question = `A train travels from Station P to Station Q, which are 150 km apart, in 3 hours. The speed
of the train at time 't' hours is given by

v(t) = 40+10t+15sin(3.14t/3)

then verify Lagrange's mean value theorem for the journey by finding at least one-time t = c in (0,3)
such that the instantaneous speed equals the average speed of the train.`;

    // Strategy: flatten newlines first, then match
    const flat = question.replace(/\r?\n+/g, ' ');
    console.log("Flattened:", flat);

    const funcMatch = flat.match(/([a-zA-Z])\(([a-z])\)\s*=\s*(.+?)(?:\s+on|\s+then|\s+verify|\s+find|\s+in|\s+for|$)/i);
    const intervalMatch = flat.match(/[\[\(]\s*([^,\[\(]+)\s*,\s*([^,\]\)]+)\s*[\]\)]/);

    console.log("\nfuncMatch:", funcMatch ? [funcMatch[1], funcMatch[2], funcMatch[3]] : "NOT FOUND");
    console.log("intervalMatch:", intervalMatch ? [intervalMatch[1], intervalMatch[2]] : "NOT FOUND");
}
debug();
