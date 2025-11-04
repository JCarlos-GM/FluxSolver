import type { Matrix, Vector, SolverConfig, SolverResult, Iteration } from '../../types';
import {
  normInf,
  calculateResidual,
  copyVector,
  hasZeroDiagonal,
  relativeError,
  generateInitialGuess,
} from './utils';

/**
 * Método de Jacobi para resolver sistemas de ecuaciones lineales
 * 
 * Ax = b
 * 
 * x^(k+1)_i = (b_i - Σ(a_ij * x^(k)_j)) / a_ii  para j ≠ i
 * 
 * @param A - Matriz de coeficientes
 * @param b - Vector de términos independientes
 * @param config - Configuración del solver
 * @returns Resultado de la resolución
 */
export const jacobi = (
  A: Matrix,
  b: Vector,
  config: SolverConfig
): SolverResult => {
  const startTime = performance.now();
  const n = A.length;
  
  // Validación: verificar que no haya ceros en la diagonal
  if (hasZeroDiagonal(A)) {
    throw new Error('La matriz tiene ceros en la diagonal. El método de Jacobi no puede aplicarse.');
  }

  // Vector inicial
  let x = config.initialGuess 
    ? copyVector(config.initialGuess)
    : generateInitialGuess(n, 'zero');
  
  let xNew = Array(n).fill(0);
  const iterations: Iteration[] = [];
  let converged = false;

  // Iteración principal
  for (let k = 0; k < config.maxIterations; k++) {
    // Calcular x^(k+1)
    for (let i = 0; i < n; i++) {
      let sum = 0;
      
      // Sumar todos los términos excepto el diagonal
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      
      // Calcular el nuevo valor
      xNew[i] = (b[i] - sum) / A[i][i];
    }

    // Calcular errores
    const error = normInf(xNew.map((val, i) => val - x[i]));
    const relError = relativeError(xNew, x);
    const residual = calculateResidual(A, b, xNew);

    // Guardar iteración
    iterations.push({
      k: k + 1,
      x: copyVector(xNew),
      error,
      relativeError: relError,
      residual,
    });

    // Verificar convergencia
    if (error < config.tolerance) {
      converged = true;
      x = copyVector(xNew);
      break;
    }

    // Actualizar x para la siguiente iteración
    x = copyVector(xNew);
  }

  const endTime = performance.now();

  return {
    solution: x,
    iterations,
    converged,
    finalError: iterations[iterations.length - 1]?.error || 0,
    iterationCount: iterations.length,
    method: 'jacobi',
    executionTime: endTime - startTime,
  };
};

/**
 * Versión vectorizada del método de Jacobi (más eficiente)
 */
export const jacobiVectorized = (
  A: Matrix,
  b: Vector,
  config: SolverConfig
): SolverResult => {
  const startTime = performance.now();
  const n = A.length;

  if (hasZeroDiagonal(A)) {
    throw new Error('La matriz tiene ceros en la diagonal.');
  }

  // Descomponer A = D + L + U
  const D = Array(n).fill(0).map((_, i) => A[i][i]);
  const LplusU = A.map((row, i) => 
    row.map((val, j) => (i === j ? 0 : val))
  );

  let x = config.initialGuess 
    ? copyVector(config.initialGuess)
    : generateInitialGuess(n, 'zero');

  const iterations: Iteration[] = [];
  let converged = false;

  for (let k = 0; k < config.maxIterations; k++) {
    // x^(k+1) = D^(-1) * (b - (L+U)*x^(k))
    const LplusUx = LplusU.map(row =>
      row.reduce((sum, val, j) => sum + val * x[j], 0)
    );

    const xNew = b.map((bi, i) => (bi - LplusUx[i]) / D[i]);

    const error = normInf(xNew.map((val, i) => val - x[i]));
    const relError = relativeError(xNew, x);
    const residual = calculateResidual(A, b, xNew);

    iterations.push({
      k: k + 1,
      x: copyVector(xNew),
      error,
      relativeError: relError,
      residual,
    });

    if (error < config.tolerance) {
      converged = true;
      x = copyVector(xNew);
      break;
    }

    x = copyVector(xNew);
  }

  const endTime = performance.now();

  return {
    solution: x,
    iterations,
    converged,
    finalError: iterations[iterations.length - 1]?.error || 0,
    iterationCount: iterations.length,
    method: 'jacobi',
    executionTime: endTime - startTime,
  };
};