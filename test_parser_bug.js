const math = require('mathjs');

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

const inputStr = "v(t) = 40+10t+15sin (3.14t/3)";
console.log("Input:", inputStr);

const funcMatch = inputStr.match(/([a-zA-Z])\(([a-z])\)\s*=\s*(.+?)(?:\s+on|\s+then|\s+verify|\s+find|\s+in|\s+for|\s+where|\.\s+|\.$|$)/i) || 
                  inputStr.match(/(?:equation is|given by)\s*(.+?)(?:\s+on|\s+in|\s+between|\s+from|\s+where|\.\s+|\.$|$)/i);

console.log("FuncStrRaw:", funcMatch[3]);

const parsed = normalizeMathString(funcMatch[3]);
console.log("Normalized:", parsed);

try {
  math.evaluate(parsed, {t: 0});
  console.log("SUCCESS");
} catch(e) {
  console.log("ERROR:", e.message);
}
