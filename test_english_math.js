function normalizeMathString(str) {
  return str
    .replace(/⋅|·|\btimes\b|\bmultiplied by\b/gi, '*')
    .replace(/−|\bminus\b/gi, '-')
    .replace(/\bplus\b/gi, '+')
    .replace(/\bdivided by\b/gi, '/')
    .replace(/\bsquared\b/gi, '^2')
    .replace(/\bcubed\b/gi, '^3')
    .replace(/\bto the power of\b/gi, '^')
    .replace(/\bsquare root of\b|\bsqrt of\b|\broot of\b/gi, 'sqrt')
    .replace(/\bpi\b/gi, '3.14159')
    .replace(/\bintegral of\b|\bintegral from\b|\bintegrate\b|\bintegral\b/gi, '∫')
    .replace(/(\d)([a-z\(])/gi, '$1*$2');
}

const tests = [
  'integral of x squared times 5',
  'square root of x plus 10',
  'x cubed minus 4 times y',
  'integral from 0 to pi of 5',
  '12 divided by 4 plus 2 to the power of 5',
  'root of pi'
];

tests.forEach(t => console.log(t, '===>', normalizeMathString(t)));
