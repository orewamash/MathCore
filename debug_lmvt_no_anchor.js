function debug() {
    const question = "A train travels ... v(t) = 40+10t+15sin(3.14t/3) verify LMVT for c in (0,3) such that speed equals average.";
    const funcMatch = question.match(/([a-zA-Z])\(([a-z])\)\s*=\s*(.+?)(?:\s+on|\s+verify|\s+find|\s+in|\s+for|$)/i);
    // Removed $ anchor, added exclude [ ( in matchers
    const intervalMatch = question.match(/[\[\(]\s*([^,\[\(]+)\s*,\s*([^,\]\)]+)\s*[\]\)]/);

    console.log("funcMatch[3]:", funcMatch ? funcMatch[3] : "null");
    console.log("intervalMatch:", intervalMatch);
    if (intervalMatch) {
        console.log("A:", intervalMatch[1], "B:", intervalMatch[2]);
    }
}
debug();
