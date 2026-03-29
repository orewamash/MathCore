const math = require("mathjs");

function normalizeMathString(str) {
  return str
    .replace(/₀|₊/g, '0').replace(/₁/g, '1').replace(/₂/g, '2').replace(/₃/g, '3')
    .replace(/₄/g, '4').replace(/₅/g, '5').replace(/₆/g, '6').replace(/₇/g, '7')
    .replace(/₈/g, '8').replace(/₉/g, '9')
    .replace(/⁰/g, '0').replace(/¹/g, '1').replace(/²/g, '2').replace(/³/g, '3')
    .replace(/⁴/g, '4').replace(/⁵/g, '5').replace(/⁶/g, '6').replace(/⁷/g, '7')
    .replace(/⁸/g, '8').replace(/⁹/g, '9')
    .replace(/⋅|·/g, '*')
    .replace(/−/g, '-')
    .replace(/(\d)([a-z\(])/gi, '$1*$2');
}

function debug() {
    const question = "v(t) = 40+10t+15sin(3.14t/3) on (0,3)";
    const funcMatch = question.match(/([a-zA-Z])\(([a-z])\)\s*=\s*(.+?)(?:\s+on\s+|$)/i);
    const intervalMatch = question.match(/[\[\(]\s*([^,]+)\s*,\s*([^\]\)]+)\s*[\]\)]/);

    console.log("funcMatch:", funcMatch);
    console.log("intervalMatch:", intervalMatch);

    if (funcMatch && intervalMatch) {
       const fName = funcMatch[1];
       const varName = funcMatch[2];
       const funcStrRaw = funcMatch[3].trim();
       const funcStr = normalizeMathString(funcStrRaw);
       console.log("fName:", fName, "varName:", varName, "funcStr:", funcStr);
       
       const aStr = normalizeMathString(intervalMatch[1].trim());
       const bStr = normalizeMathString(intervalMatch[2].trim());
       console.log("aStr:", aStr, "bStr:", bStr);

       try {
           const a = math.evaluate(aStr);
           const b = math.evaluate(bStr);
           console.log("a:", a, "b:", b);
           const val = math.evaluate(funcStr, { [varName]: 1 });
           console.log("Eval at 1:", val);
       } catch (e) {
           console.log("MATH ERROR:", e.message);
       }
    }
}
debug();
