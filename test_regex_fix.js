const math = require("mathjs");
function test() {
    const question = "v(t) = 40+10t+15sin(3.14t/3) on (0,3)";
    const funcMatch = question.match(/([a-zA-Z])\(([a-z])\)\s*=\s*([^on]+)/);
    const intervalMatch = question.match(/[\[\(]\s*([^,]+)\s*,\s*([^\]\)]+)\s*[\]\)]/);
    
    console.log("funcMatch:", funcMatch);
    console.log("intervalMatch:", intervalMatch);
    
    if (funcMatch && intervalMatch) {
        const varName = funcMatch[2];
        const funcStr = funcMatch[3].trim();
        const a = math.evaluate(intervalMatch[1].trim());
        const b = math.evaluate(intervalMatch[2].trim());
        const df = math.derivative(funcStr, varName).toString();
        console.log("Variable:", varName, "Func:", funcStr, "a:", a, "b:", b, "df:", df);
    }
}
test();
