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

import { parseMatrix } from './matrix-solvers';

export function solveGaussJordan(matrixStr: string): Solution {
  let matrix = parseMatrix(matrixStr);

  const steps: SolutionStep[] = [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  steps.push({
    title: "Initial Augmented Matrix",
    formula: formatMatrix(matrix),
    explanation: "The system is represented in augmented matrix form [A|B].",
    whyNote: "This representation allows us to apply row operations consistently to all coefficients and constants at once."
  });

  let workingMatrix = matrix.map(r => [...r]);

  for (let i = 0; i < Math.min(rows, cols - 1); i++) {
    // 1. Find pivot (and swap if needed)
    let pivotRow = i;
    while (pivotRow < rows && math.equal(workingMatrix[pivotRow][i], 0)) {
      pivotRow++;
    }

    if (pivotRow === rows) continue; // No pivot in this column

    if (pivotRow !== i) {
      [workingMatrix[i], workingMatrix[pivotRow]] = [workingMatrix[pivotRow], workingMatrix[i]];
      steps.push({
        title: `Row Swap: R${i + 1} ↔ R${pivotRow + 1}`,
        formula: formatMatrix(workingMatrix),
        explanation: `Swapped Row ${i+1} and Row ${pivotRow+1} to bring a non-zero element to the pivot position.`,
        whyNote: "Row swapping keeps the system equivalent while ensuring we can divide by a non-zero pivot."
      });
    }

    // 2. Normalize pivot row
    const pivot = workingMatrix[i][i];
    if (!math.equal(pivot, 1)) {
      workingMatrix[i] = workingMatrix[i].map(val => math.divide(val, pivot));
      steps.push({
        title: `Normalization: R${i + 1} → R${i + 1} / ${math.format(pivot, {precision: 4})}`,
        formula: formatMatrix(workingMatrix),
        explanation: `Divided Row ${i+1} by its pivot element ${math.format(pivot, {precision: 4})} to make the pivot value equal to 1.`,
        whyNote: "Normalizing the pivot to 1 simplifies the subsequent elimination of other elements in the column."
      });
    }

    // 3. Eliminate other rows
    for (let j = 0; j < rows; j++) {
      if (i === j) continue;
      const factor = workingMatrix[j][i];
      if (!math.equal(factor, 0)) {
        workingMatrix[j] = workingMatrix[j].map((val, k) => 
          math.subtract(val, math.multiply(factor, workingMatrix[i][k]))
        );
        steps.push({
          title: `Elimination: R${j + 1} → R${j + 1} - (${math.format(factor, {precision: 4})})R${i + 1}`,
          formula: formatMatrix(workingMatrix),
          explanation: `Eliminated the coefficient in Row ${j+1}, Column ${i+1} by subtracting a multiple of the pivot row.`,
          whyNote: "This zeroing-out continues until we reach the Reduced Row Echelon Form (RREF)."
        });
      }
    }
  }

  // Extract answers
  const results: string[] = [];
  for (let i = 0; i < Math.min(rows, cols - 1); i++) {
      const val = math.format(workingMatrix[i][cols-1], {precision: 4, fraction: 'decimal'});
      results.push(`x_{${i+1}} = ${val}`);
  }

  return {
    theorem: "Gauss-Jordan Elimination",
    steps: steps,
    finalAnswer: results.join(", ")
  };
}

function formatMatrix(mat: any[][]): string {
  const inner = mat
    .map(row => 
      row.map(cell => math.format(cell, {precision: 4, fraction: 'decimal'})).join(' & ')
    )
    .join(' \\\\ ');
  // Find where the augmentation bar should be (last column)
  const rows = mat.length;
  const cols = mat[0].length;
  let arrayFormat = "c".repeat(cols - 1) + "|c";
  return `\\begin{pmatrix} \\begin{array}{${arrayFormat}} ${inner} \\end{array} \\end{pmatrix}`;
}
