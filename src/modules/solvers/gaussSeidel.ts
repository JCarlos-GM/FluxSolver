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
 * Método de Gauss-Seidel para resolver sistemas de ecuaciones lineales
 * 
 * Ax = b
 * 
 * x^(k+1)_i = (b_i - Σ(a_ij * x^(k+1)_j) - Σ(a_ij * x^(k)_j)) / a_ii
 *              j<i                        j>i
 * 
 * @param A - Matriz de coeficientes
 * @param b - Vector de términos independientes
 * @param config - Configuración del solver
 * @returns Resultado de la resolución
 */
export const gaussSeidel = (
  A: Matrix,
  b: Vector,
  config: SolverConfig
): SolverResult => {
  const startTime = performance.now();
  const n = A.length;

  // Validación: verificar que no haya ceros en la diagonal
  if (hasZeroDiagonal(A)) {
    throw new Error('La matriz tiene ceros en la diagonal. El método de Gauss-Seidel no puede aplicarse.');
  }

  // Vector inicial
  let x = config.initialGuess 
    ? copyVector(config.initialGuess)
    : generateInitialGuess(n, 'zero');

  const iterations: Iteration[] = [];
  let converged = false;

  // Iteración principal
  for (let k = 0; k < config.maxIterations; k++) {
    const xPrev = copyVector(x);

    // Actualizar cada componente de x
    for (let i = 0; i < n; i++) {
      let sum = 0;

      // Suma de los términos con valores ya actualizados (j < i)
      for (let j = 0; j < i; j++) {
        sum += A[i][j] * x[j];
      }

      // Suma de los términos con valores de la iteración anterior (j > i)
      for (let j = i + 1; j < n; j++) {
        sum += A[i][j] * x[j];
      }

      // Calcular el nuevo valor
      x[i] = (b[i] - sum) / A[i][i];
    }

    // Calcular errores
    const error = normInf(x.map((val, i) => val - xPrev[i]));
    const relError = relativeError(x, xPrev);
    const residual = calculateResidual(A, b, x);

    // Guardar iteración
    iterations.push({
      k: k + 1,
      x: copyVector(x),
      error,
      relativeError: relError,
      residual,
    });

    // Verificar convergencia
    if (error < config.tolerance) {
      converged = true;
      break;
    }
  }

  const endTime = performance.now();

  return {
    solution: x,
    iterations,
    converged,
    finalError: iterations[iterations.length - 1]?.error || 0,
    iterationCount: iterations.length,
    method: 'gauss-seidel',
    executionTime: endTime - startTime,
  };
};

/**
 * Método de Gauss-Seidel con factor de relajación (SOR - Successive Over-Relaxation)
 * 
 * x^(k+1)_i = (1-ω)x^(k)_i + (ω/a_ii)[b_i - Σ(a_ij*x^(k+1)_j) - Σ(a_ij*x^(k)_j)]
 * 
 * @param A - Matriz de coeficientes
 * @param b - Vector de términos independientes
 * @param omega - Factor de relajación (0 < ω < 2)
 * @param config - Configuración del solver
 */
export const gaussSeidelSOR = (
  A: Matrix,
  b: Vector,
  omega: number,
  config: SolverConfig
): SolverResult => {
  const startTime = performance.now();
  const n = A.length;

  if (hasZeroDiagonal(A)) {
    throw new Error('La matriz tiene ceros en la diagonal.');
  }

  if (omega <= 0 || omega >= 2) {
    throw new Error('El factor de relajación debe estar entre 0 y 2.');
  }

  let x = config.initialGuess 
    ? copyVector(config.initialGuess)
    : generateInitialGuess(n, 'zero');

  const iterations: Iteration[] = [];
  let converged = false;

  for (let k = 0; k < config.maxIterations; k++) {
    const xPrev = copyVector(x);

    for (let i = 0; i < n; i++) {
      let sum = 0;

      for (let j = 0; j < i; j++) {
        sum += A[i][j] * x[j];
      }

      for (let j = i + 1; j < n; j++) {
        sum += A[i][j] * x[j];
      }

      const xGaussSeidel = (b[i] - sum) / A[i][i];
      
      // Aplicar relajación
      x[i] = (1 - omega) * x[i] + omega * xGaussSeidel;
    }

    const error = normInf(x.map((val, i) => val - xPrev[i]));
    const relError = relativeError(x, xPrev);
    const residual = calculateResidual(A, b, x);

    iterations.push({
      k: k + 1,
      x: copyVector(x),
      error,
      relativeError: relError,
      residual,
    });

    if (error < config.tolerance) {
      converged = true;
      break;
    }
  }

  const endTime = performance.now();

  return {
    solution: x,
    iterations,
    converged,
    finalError: iterations[iterations.length - 1]?.error || 0,
    iterationCount: iterations.length,
    method: 'gauss-seidel',
    executionTime: endTime - startTime,
  };
};