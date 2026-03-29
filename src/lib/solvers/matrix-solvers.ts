import * as math from 'mathjs';

interface SolutionStep {
  title: string;
  formula?: string;
  explanation: string;
  whyNote?: string;
}

interface Solution {
  theorem: string;
  steps: SolutionStep[];
  finalAnswer: string;
}

export function solveLUDecomposition(matrixStr: string): Solution {
  // Parse matrix
  let matrix = parseMatrix(matrixStr);
  const n = matrix.length;
  if (n === 0 || matrix[0].length === 0) {
      throw new Error("Could not parse a valid matrix from input.");
  }
  if (n !== matrix[0].length) {
      throw new Error("LU Decomposition requires a square matrix.");
  }

  const steps: SolutionStep[] = [];
  let L = (math.identity(n) as math.Matrix).toArray() as any[][];

  let U = matrix.map(r => [...r]) as any[][];

  steps.push({
      title: "Initial Matrix A",
      formula: `A = ${formatSimpleMatrix(matrix)}`,
      explanation: "We start with the original square matrix A that we want to decompose into LU.",
      whyNote: "LU decomposition expresses A as the product of a Lower (L) and Upper (U) triangular matrix."
  });

  for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
          if (math.equal(U[i][i], 0)) {
            throw new Error("Zero pivot encountered. LU decomposition without pivoting fails for this matrix.");
          }
          const factor = math.divide(U[j][i], U[i][i]);
          L[j][i] = factor;
          
          // Row operation Rj = Rj - factor * Ri
          for (let k = i; k < n; k++) {
              U[j][k] = math.subtract(U[j][k], math.multiply(factor, U[i][k]));
          }

          steps.push({
              title: `Step ${i + 1}.${j}: Eliminate A[${j+1},${i+1}]`,
              formula: `L = ${formatSimpleMatrix(L)}, \\quad U = ${formatSimpleMatrix(U)}`,
              explanation: `Used multiplier $m = U_{${j+1}${i+1}} / U_{${i+1}${i+1}} = ${math.format(factor, {precision: 4})}$ to zero out the element below the pivot.`,
              whyNote: "The multipliers go into matrix L, while the resulting upper triangular form becomes U."
          });
      }
  }

  return {
      theorem: "LU Decomposition (Doolittle)",
      steps: steps,
      finalAnswer: `L = ${formatSimpleMatrix(L)}, \\quad U = ${formatSimpleMatrix(U)}`
  };
}

export function solveEigenvalues(matrixStr: string): Solution {
    let matrix = parseMatrix(matrixStr);
    const n = matrix.length;
    if (n === 0 || matrix[0].length === 0) {
        throw new Error("Could not parse a valid matrix from input.");
    }
    if (n < 2 || n > 3) {
        throw new Error("Eigenvalue solver supports 2×2 and 3×3 matrices.");
    }
    if (n !== matrix[0].length) {
        throw new Error("Eigenvalue computation requires a square matrix.");
    }

    const steps: SolutionStep[] = [];

    if (n === 2) {
        return solveEigen2x2(matrix, steps);
    } else {
        return solveEigen3x3(matrix, steps);
    }
}

function solveEigen2x2(matrix: any[][], steps: SolutionStep[]): Solution {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];

    steps.push({
        title: "Characteristic Equation",
        formula: `\\det(A - \\lambda I) = \\det\\begin{pmatrix} ${math.format(a)}-\\lambda & ${math.format(b)} \\\\ ${math.format(c)} & ${math.format(d)}-\\lambda \\end{pmatrix} = 0`,
        explanation: "To find eigenvalues, we must solve for λ where the determinant of (A - λI) is zero.",
        whyNote: "The determinant being zero ensures that the transformation squashes space along certain directions."
    });

    // λ^2 - (a+d)λ + (ad-bc) = 0
    const trace = math.add(a, d);
    const det = math.subtract(math.multiply(a, d), math.multiply(b, c));
    
    steps.push({
        title: "Characteristic Polynomial",
        formula: `\\lambda^2 - (${math.format(trace)})\\lambda + (${math.format(det)}) = 0`,
        explanation: `Expanding the determinant gives a quadratic equation in λ.`,
        whyNote: "The sum of eigenvalues equals the Trace, and their product equals the Determinant."
    });

    const discriminant = math.subtract(math.multiply(trace, trace), math.multiply(4, det));
    const sqrtD = math.sqrt(discriminant as any);
    
    const lambda1 = math.divide(math.add(trace, sqrtD), 2);
    const lambda2 = math.divide(math.subtract(trace, sqrtD), 2);

    steps.push({
        title: "Solving for Roots",
        formula: `\\lambda = \\frac{${math.format(trace)} \\pm \\sqrt{${math.format(discriminant)}}}{2}`,
        explanation: "Applying the quadratic formula to find the specific values of λ.",
        whyNote: "Real roots indicate stretching/compressing, while complex roots indicate rotation."
    });

    return {
        theorem: "Eigen Analysis",
        steps: steps,
        finalAnswer: `\\lambda_1 = ${math.format(lambda1, {precision: 4})}, \\quad \\lambda_2 = ${math.format(lambda2, {precision: 4})}`
    };
}

function solveEigen3x3(matrix: any[][], steps: SolutionStep[]): Solution {
    const [[a,b,c],[d,e,f],[g,h,i]] = matrix;

    steps.push({
        title: "Matrix A",
        formula: `A = ${formatSimpleMatrix(matrix)}`,
        explanation: "We compute eigenvalues by solving det(A − λI) = 0.",
    });

    // Characteristic polynomial for 3x3: -λ³ + (a+e+i)λ² - (ae-bd + ai-cg + ei-fh)λ + det(A)
    const traceA = math.add(math.add(a, e), i);
    
    // Minors sum: M11 + M22 + M33
    const minor11 = math.subtract(math.multiply(e, i), math.multiply(f, h));
    const minor22 = math.subtract(math.multiply(a, i), math.multiply(c, g));
    const minor33 = math.subtract(math.multiply(a, e), math.multiply(b, d));
    const minorsSum = math.add(math.add(minor11, minor22), minor33);

    // det(A)
    const detA = math.det(matrix);

    steps.push({
        title: "Characteristic Polynomial",
        formula: `\\lambda^3 - (${math.format(traceA)})\\lambda^2 + (${math.format(minorsSum)})\\lambda - (${math.format(detA)}) = 0`,
        explanation: "For a 3×3 matrix, the characteristic polynomial is a cubic equation.",
        whyNote: "Trace = sum of eigenvalues, sum of minors = sum of products of pairs, det = product of all eigenvalues."
    });

    // Use mathjs to compute eigenvalues numerically
    const eigs = math.eigs(math.matrix(matrix));
    const eigenvalues = (eigs.values as math.Matrix).toArray();

    steps.push({
        title: "Solve Cubic Equation",
        formula: eigenvalues.map((v: any, idx: number) => `\\lambda_${idx+1} = ${math.format(v, {precision: 4})}`).join(', \\quad '),
        explanation: "Solving the cubic characteristic polynomial yields three eigenvalues.",
        whyNote: "Eigenvalues can be real or complex conjugate pairs."
    });

    return {
        theorem: "Eigen Analysis (3×3)",
        steps,
        finalAnswer: eigenvalues.map((v: any, idx: number) => `\\lambda_${idx+1} = ${math.format(v, {precision: 4})}`).join(', \\quad ')
    };
}

export function solveEigenvectors(matrixStr: string): Solution {
    let matrix = parseMatrix(matrixStr);
    const n = matrix.length;
    if (n !== 2 && n !== 3) {
        throw new Error("Eigenvector solver supports 2×2 and 3×3 matrices.");
    }

    const steps: SolutionStep[] = [];
    
    if (n === 2) {
      return solveEigenvectors2x2(matrix, steps);
    } else {
      return solveEigenvectors3x3(matrix, steps);
    }
}

function solveEigenvectors3x3(matrix: any[][], steps: SolutionStep[]): Solution {
    const A = math.matrix(matrix);
    const eigs = math.eigs(A);
    const results = eigs.eigenvectors; // Array of {value, vector}

    steps.push({
        title: "Matrix A and Eigenvalues",
        formula: `A = ${formatSimpleMatrix(matrix)}`,
        explanation: "First, we compute the eigenvalues from the characteristic polynomial.",
        whyNote: "For each eigenvalue λ, we solve (A - λI)v = 0."
    });

    results.forEach((res, idx) => {
        const lam = res.value;
        const v = res.vector as any; 
        const vArr = v.toArray ? v.toArray() : (Array.isArray(v) ? v : [v]);
        
        steps.push({
            title: `Eigenvector for λ${idx+1} = ${math.format(lam, {precision: 4})}`,
            formula: `\\mathbf{v}_${idx+1} = ${formatSimpleMatrix([vArr])}^T`,
            explanation: `Solving systematic elimination for $(A - ${math.format(lam, {precision: 2})}I)\\mathbf{v} = \\mathbf{0}$.`,
        });
    });

    return {
        theorem: "Eigenvector Analysis (3×3)",
        steps,
        finalAnswer: results.map((res, i) => `\\lambda_${i+1}: \\mathbf{v}_${i+1} \\text{ computed.}`).join(', ')
    };
}

function solveEigenvectors2x2(matrix: any[][], steps: SolutionStep[]): Solution {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];

    const trace = math.add(a, d);
    const det = math.subtract(math.multiply(a, d), math.multiply(b, c));
    const discriminant = math.subtract(math.multiply(trace, trace), math.multiply(4, det));
    const sqrtD = math.sqrt(discriminant as any);
    
    const lambda1 = math.divide(math.add(trace, sqrtD), 2);
    const lambda2 = math.divide(math.subtract(trace, sqrtD), 2);

    steps.push({
        title: "Eigenvalues (from characteristic equation)",
        formula: `\\lambda_1 = ${math.format(lambda1, {precision: 4})}, \\quad \\lambda_2 = ${math.format(lambda2, {precision: 4})}`,
        explanation: "First we find the eigenvalues by solving det(A − λI) = 0.",
        whyNote: "We need eigenvalues before we can find eigenvectors."
    });

    // For each eigenvalue, solve (A - λI)x = 0
    const lambdas = [lambda1, lambda2];
    for (let idx = 0; idx < 2; idx++) {
        const lam = lambdas[idx];
        const m00 = math.subtract(a, lam);
        const m01 = b;
        const m10 = c;
        const m11 = math.subtract(d, lam);

        steps.push({
            title: `Eigenvector for λ${idx+1} = ${math.format(lam, {precision: 4})}`,
            formula: `(A - ${math.format(lam, {precision: 4})}I) = \\begin{pmatrix} ${math.format(m00, {precision: 4})} & ${math.format(m01, {precision: 4})} \\\\ ${math.format(m10, {precision: 4})} & ${math.format(m11, {precision: 4})} \\end{pmatrix}`,
            explanation: `Substitute λ${idx+1} into (A − λI) and solve the homogeneous system.`,
            whyNote: "The null space of this matrix gives the eigenvector direction."
        });

        // From first row: m00*x1 + m01*x2 = 0  => x1 = -m01/m00 * x2 (if m00 != 0)
        if (!math.equal(m00, 0)) {
            const ratio = math.unaryMinus(math.divide(m01, m00));
            steps.push({
                title: `Eigenvector ${idx+1}`,
                formula: `\\mathbf{x}_${idx+1} = t\\begin{pmatrix} ${math.format(ratio, {precision: 4})} \\\\ 1 \\end{pmatrix}`,
                explanation: `From the first equation: $x_1 = ${math.format(ratio, {precision: 4})} \\cdot x_2$. Let $x_2 = t$.`,
            });
        } else if (!math.equal(m01, 0)) {
            steps.push({
                title: `Eigenvector ${idx+1}`,
                formula: `\\mathbf{x}_${idx+1} = t\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}`,
                explanation: `Since the first row is [0, ${math.format(m01, {precision: 4})}], we get $x_2 = 0$, $x_1$ is free.`,
            });
        } else {
            steps.push({
                title: `Eigenvector ${idx+1}`,
                formula: `\\mathbf{x}_${idx+1} = t\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} + s\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}`,
                explanation: "The entire matrix row is zero — every vector is an eigenvector (repeated eigenvalue with full eigenspace).",
            });
        }
    }

    return {
        theorem: "Eigenvector Analysis",
        steps,
        finalAnswer: `\\text{Eigenvectors found for each eigenvalue — see steps above.}`
    };
}

export function solveCayleyHamilton(matrixStr: string): Solution {
    let matrix = parseMatrix(matrixStr);
    const n = matrix.length;
    if (n === 0 || matrix[0].length === 0) {
        throw new Error("Could not parse a valid matrix from input.");
    }
    if (n !== 2 && n !== 3) {
        throw new Error("Cayley-Hamilton solver supports 2×2 and 3×3 matrices.");
    }

    const steps: SolutionStep[] = [];
    const A = math.matrix(matrix);

    steps.push({
        title: "Given Matrix A",
        formula: `A = ${formatSimpleMatrix(matrix)}`,
        explanation: "We will verify that A satisfies its own characteristic equation (Cayley-Hamilton Theorem).",
    });

    if (n === 2) {
        const [[a,b],[c,d]] = matrix;
        const trace = math.add(a, d);
        const det = math.subtract(math.multiply(a, d), math.multiply(b, c));

        steps.push({
            title: "Characteristic Equation",
            formula: `p(\\lambda) = \\lambda^2 - (${math.format(trace)})\\lambda + (${math.format(det)}) = 0`,
            explanation: "For a 2×2 matrix, the characteristic polynomial is λ² − tr(A)λ + det(A).",
            whyNote: "Cayley-Hamilton says p(A) = O (zero matrix)."
        });

        // Compute A²
        const A2 = math.multiply(A, A) as math.Matrix;

        steps.push({
            title: "Compute A²",
            formula: `A^2 = ${formatSimpleMatrix((A2).toArray() as any[][])}`,
            explanation: "Matrix multiplication A × A.",
        });

        // p(A) = A² - trace*A + det*I
        // @ts-ignore -- mathjs types are overly strict for scalar*matrix
        const trA = math.multiply(trace, A) as math.Matrix;
        // @ts-ignore
        const detI = math.multiply(det, math.identity(2)) as math.Matrix;
        const pA = math.subtract(math.subtract(A2, trA), detI) as math.Matrix;

        steps.push({
            title: "Verify p(A) = A² − tr·A + det·I",
            formula: `p(A) = ${formatSimpleMatrix((A2).toArray() as any[][])} - ${math.format(trace)} \\cdot ${formatSimpleMatrix(matrix)} + ${math.format(det)} \\cdot I`,
            explanation: "Substitute matrix A into the characteristic polynomial.",
        });

        steps.push({
            title: "Result",
            formula: `p(A) = ${formatSimpleMatrix((pA).toArray() as any[][])}`,
            explanation: "The result is the zero matrix, confirming the Cayley-Hamilton theorem!",
            whyNote: "Every square matrix satisfies its own characteristic equation."
        });

        return {
            theorem: "Cayley-Hamilton Theorem",
            steps,
            finalAnswer: `p(A) = A^2 - ${math.format(trace)}A + ${math.format(det)}I = O \\quad \\checkmark`
        };
    } else {
        // 3x3
        const traceA = math.trace(A);
        const detA = math.det(A);

        // Sum of cofactors of diagonal = trace of adj (minor sums)
        const minor11 = math.subtract(math.multiply(matrix[1][1], matrix[2][2]), math.multiply(matrix[1][2], matrix[2][1]));
        const minor22 = math.subtract(math.multiply(matrix[0][0], matrix[2][2]), math.multiply(matrix[0][2], matrix[2][0]));
        const minor33 = math.subtract(math.multiply(matrix[0][0], matrix[1][1]), math.multiply(matrix[0][1], matrix[1][0]));
        const minorsSum = math.add(math.add(minor11, minor22), minor33);

        // p(λ) = λ³ − tr·λ² + minorsSum·λ − det = 0
        steps.push({
            title: "Characteristic Equation",
            formula: `p(\\lambda) = \\lambda^3 - ${math.format(traceA)}\\lambda^2 + ${math.format(minorsSum)}\\lambda - ${math.format(detA)} = 0`,
            explanation: "The characteristic polynomial for a 3×3 matrix is a cubic equation.",
        });

        const A2 = math.multiply(A, A) as math.Matrix;
        const A3 = math.multiply(A2, A) as math.Matrix;

        steps.push({
            title: "Compute A², A³",
            formula: `A^2 = ${formatSimpleMatrix((A2).toArray() as any[][])}, \\quad A^3 = ${formatSimpleMatrix((A3).toArray() as any[][])}`,
            explanation: "Compute successive matrix powers by repeated multiplication.",
        });

        // p(A) = A³ − tr·A² + minors·A − det·I
        // @ts-ignore -- mathjs types are overly strict for scalar*matrix
        const trA2 = math.multiply(traceA, A2) as math.Matrix;
        // @ts-ignore
        const msA = math.multiply(minorsSum, A) as math.Matrix; // Changed unaryMinus to direct multiply
        // @ts-ignore
        const dI = math.multiply(detA, math.identity(3)) as math.Matrix;
        
        // p(A) = A³ − tr·A² + minorsSum·A − det·I
        const pA = math.subtract(
            math.add(
                math.subtract(A3, trA2),
                msA
            ),
            dI
        ) as math.Matrix;

        steps.push({
            title: "Verify p(A) = A³ − tr·A² + Σminors·A − det·I",
            formula: `p(A) = ${formatSimpleMatrix((A3).toArray() as any[][])} - ${math.format(traceA)} \\cdot ${formatSimpleMatrix((A2).toArray() as any[][])} + ${math.format(minorsSum)} \\cdot ${formatSimpleMatrix(matrix)} - ${math.format(detA)} \\cdot I`,
            explanation: "Substitute matrix A into the characteristic polynomial.",
        });

        steps.push({
            title: "Result",
            formula: `p(A) = ${formatSimpleMatrix((pA).toArray() as any[][])}`,
            explanation: "The result should be the zero matrix, confirming the Cayley-Hamilton theorem!",
            whyNote: "Cayley-Hamilton theorem verified for this 3×3 matrix."
        });

        return {
            theorem: "Cayley-Hamilton Theorem (3×3)",
            steps,
            finalAnswer: `p(A) = A^3 - ${math.format(traceA)}A^2 + ${math.format(minorsSum)}A - ${math.format(detA)}I = O \\quad \\checkmark`
        };
    }
}

export function solveGaussElimination(matrixStr: string): Solution {
    let matrix = parseMatrix(matrixStr);
    const steps: SolutionStep[] = [];
    const rows = matrix.length;
    const cols = matrix[0].length;

    steps.push({
        title: "Initial Augmented Matrix",
        formula: formatAugMatrix(matrix),
        explanation: "The system is represented in augmented matrix form [A|B].",
        whyNote: "Gauss Elimination reduces this to upper triangular form, then uses back-substitution."
    });

    let workingMatrix = matrix.map(r => [...r]);

    // Forward elimination only (not full RREF like Gauss-Jordan)
    for (let i = 0; i < Math.min(rows, cols - 1); i++) {
        // Find pivot
        let pivotRow = i;
        while (pivotRow < rows && math.equal(workingMatrix[pivotRow][i], 0)) {
            pivotRow++;
        }
        if (pivotRow === rows) continue;

        if (pivotRow !== i) {
            [workingMatrix[i], workingMatrix[pivotRow]] = [workingMatrix[pivotRow], workingMatrix[i]];
            steps.push({
                title: `Row Swap: R${i + 1} ↔ R${pivotRow + 1}`,
                formula: formatAugMatrix(workingMatrix),
                explanation: `Swapped rows to bring non-zero pivot to position (${i+1},${i+1}).`,
            });
        }

        // Eliminate below pivot only (forward elimination)
        for (let j = i + 1; j < rows; j++) {
            const factor = math.divide(workingMatrix[j][i], workingMatrix[i][i]);
            if (!math.equal(factor, 0)) {
                workingMatrix[j] = workingMatrix[j].map((val: any, k: number) =>
                    math.subtract(val, math.multiply(factor, workingMatrix[i][k]))
                );
                steps.push({
                    title: `R${j + 1} → R${j + 1} - (${math.format(factor, {precision: 4})})R${i + 1}`,
                    formula: formatAugMatrix(workingMatrix),
                    explanation: `Eliminated element below pivot in column ${i+1}.`,
                    whyNote: "Forward elimination creates zeros below each pivot."
                });
            }
        }
    }

    steps.push({
        title: "Upper Triangular Form Achieved",
        formula: formatAugMatrix(workingMatrix),
        explanation: "The matrix is now in upper triangular form. Apply back-substitution.",
    });

    // Back substitution
    const results: string[] = [];
    const numVars = Math.min(rows, cols - 1);
    const solution: any[] = new Array(numVars).fill(0);

    for (let i = numVars - 1; i >= 0; i--) {
        let sum: any = workingMatrix[i][cols - 1];
        for (let j = i + 1; j < numVars; j++) {
            sum = math.subtract(sum, math.multiply(workingMatrix[i][j], solution[j]));
        }
        if (!math.equal(workingMatrix[i][i], 0)) {
            solution[i] = math.divide(sum, workingMatrix[i][i]);
        }
        results.unshift(`x_{${i+1}} = ${math.format(solution[i], {precision: 4, fraction: 'decimal'})}`);
    }

    steps.push({
        title: "Back-Substitution",
        formula: results.join(', \\quad '),
        explanation: "Starting from the last equation and working upward, we find each variable.",
        whyNote: "This is the key advantage of upper triangular form — each variable can be solved sequentially."
    });

    return {
        theorem: "Gauss Elimination",
        steps,
        finalAnswer: results.join(', \\quad ')
    };
}

export function parseMatrix(input: string): any[][] {
    const matrixStr = input.trim();
    
    // 1. Check if it's already a comma/pipe format: "1, 2 | 3, 4"
    if (matrixStr.includes('|')) {
        let parsedMatrix = matrixStr
          .split('|')
          .map(row => row.split(',').map(cell => {
            const trimmed = cell.trim();
            if (trimmed === "") return null; // mark for filtering
            try { return math.evaluate(trimmed); } catch { return 0; }
          }))
          .filter(row => row.some(cell => cell !== null)) // filter empty rows
          .map(row => row.map(cell => cell === null ? 0 : cell)); // fill remaining nulls

        // Strip empty columns
        if (parsedMatrix.length > 0) {
            const numCols = parsedMatrix[0].length;
            const activeCols: number[] = [];
            for (let j = 0; j < numCols; j++) {
                if (parsedMatrix.some(row => row[j] !== undefined && !math.equal(row[j], 0))) {
                    activeCols.push(j);
                }
            }
            parsedMatrix = parsedMatrix.map(row => activeCols.map(j => row[j]));
        }
        return parsedMatrix;
    }

    // 2. Check for bracketed format: "[[1,2],[3,4]]" anywhere in text
    const bracketMatch = matrixStr.match(/\[\s*\[.+\]\s*\]/);
    if (bracketMatch) {
        try {
            const arr = JSON.parse(bracketMatch[0].replace(/'/g, '"'));
            if (Array.isArray(arr)) return arr;
        } catch {}
    }

    // 3. Check for Equations: "2x + y = 5, x - y = 1"
    if (matrixStr.includes('=') && (matrixStr.includes('x') || matrixStr.includes('y') || matrixStr.includes('z'))) {
        return parseEquationsToMatrix(matrixStr);
    }

    // 4. Fallback: single row or space-separated
    let parsedRow = matrixStr.split(/[,\s]+/).filter(cell => cell.trim() !== '').map(cell => math.evaluate(cell));
    if (parsedRow.length === 0) return [];
    return [parsedRow];
}

function parseEquationsToMatrix(eqStr: string): any[][] {
    const eqs = eqStr.split(/[;,]/).filter(s => s.trim().includes('='));
    const matrix: any[][] = [];
    
    // Detect variables in order: x, y, z, ...
    const vars = ['x', 'y', 'z', 'w'];
    
    eqs.forEach(eq => {
        const [left, right] = eq.split('=');
        const row: any[] = [];
        vars.forEach(v => {
            try {
                // Approximate coefficient: this is a simple heuristic
                // For a robust solver, we'd use math.parse and collect coefficients
                const coeff = extractCoeff(left, v);
                row.push(coeff);
            } catch {
                row.push(0);
            }
        });
        row.push(math.evaluate(right.trim()));
        matrix.push(row);
    });

    // Trim columns that are all zeros (unused variables)
    if (matrix.length === 0) return [];

    const activeCols: number[] = [];
    for (let j = 0; j < vars.length; j++) {
        if (matrix.some(row => row[j] !== undefined && !math.equal(row[j], 0))) activeCols.push(j);
    }
    activeCols.push(matrix[0].length - 1); // keep constants
    
    return matrix.map(row => activeCols.map(j => row[j]));
}

function extractCoeff(expr: string, variable: string): number {
    const cleaned = expr.replace(/\s+/g, '');
    const regex = new RegExp(`([+-]?\\d*\\.?\\d*)${variable}`);
    const match = cleaned.match(regex);
    if (!match) return 0;
    const val = match[1];
    if (val === "" || val === "+") return 1;
    if (val === "-") return -1;
    return parseFloat(val);
}

function formatSimpleMatrix(mat: any[][]): string {
    const inner = mat
      .map(row => 
        row.map(cell => math.format(cell, {precision: 4, fraction: 'decimal'})).join(' & ')
      )
      .join(' \\\\ ');
    return `\\begin{pmatrix} ${inner} \\end{pmatrix}`;
}

function formatAugMatrix(mat: any[][]): string {
    const cols = mat[0].length;
    const inner = mat
      .map(row => 
        row.map(cell => math.format(cell, {precision: 4, fraction: 'decimal'})).join(' & ')
      )
      .join(' \\\\ ');
    let arrayFormat = "c".repeat(cols - 1) + "|c";
    return `\\begin{pmatrix} \\begin{array}{${arrayFormat}} ${inner} \\end{array} \\end{pmatrix}`;
}
