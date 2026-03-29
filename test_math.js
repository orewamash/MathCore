const math = require("mathjs");
function test() {
    const cleanedInputs = [
       "∫ 0^1 ∫ 0^2 (x*y) dy dx",
       "∫ 0 ^ 1 ∫ 0 ^ x (x + y) dy dx",
       "∫0^1 ∫0^x (x+y) dy dx"
    ];
    
    // The previous regex failed when spaces around ^ were missing
    // Let's make ^ mandatory (as the previous system was expecting limits like a^b) or optional
    const regex = /∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫]+)\s*∫\s*([^^ ∫]+)\s*\^{0,1}\s*([^^ ∫(]+)\s*(.+?)\s*dy\s*dx/i;
    
    for (const cleanedInput of cleanedInputs) {
      const match = cleanedInput.match(regex);
      console.log(match ? 
         `[xa: ${match[1]}, xb: ${match[2]}, ya: ${match[3]}, yb: ${match[4]}, func: ${match[5]}]` 
         : "NO MATCH for " + cleanedInput);
    }
}
test();
