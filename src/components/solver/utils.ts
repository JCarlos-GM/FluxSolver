import type { Matrix, Vector } from '../../types';

/**
 * Calcula la norma infinito de un vector
 */
export const normInf = (vector: Vector): number => {
  return Math.max(...vector.map(v => Math.abs(v)));
};

/**
 * Calcula la norma euclidiana de un vector
 */
export const norm2 = (vector: Vector): number => {
  return Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
};

/**
 * Calcula la diferencia entre dos vectores
 */
export const vectorDifference = (v1: Vector, v2: Vector): Vector => {
  return v1.map((val, i) => val - v2[i]);
};

/**
 * Multiplica una matriz por un vector
 */
export const matrixVectorMultiply = (matrix: Matrix, vector: Vector): Vector => {
  return matrix.map(row =>
    row.reduce((sum, val, j) => sum + val * vector[j], 0)
  );
};

/**
 * Calcula el residuo: r = b - Ax
 */
export const calculateResidual = (
  A: Matrix,
  b: Vector,
  x: Vector
): number => {
  const Ax = matrixVectorMultiply(A, x);
  const residual = vectorDifference(b, Ax);
  return normInf(residual);
};

/**
 * Copia un vector
 */
export const copyVector = (vector: Vector): Vector => {
  return [...vector];
};

/**
 * Verifica si un elemento diagonal es cero
 */
export const hasZeroDiagonal = (matrix: Matrix): boolean => {
  return matrix.some((row, i) => row[i] === 0);
};

/**
 * Calcula el error relativo entre dos vectores
 */
export const relativeError = (current: Vector, previous: Vector): number => {
  const diff = normInf(vectorDifference(current, previous));
  const norm = normInf(current);
  return norm !== 0 ? diff / norm : diff;
};

/**
 * Genera un vector inicial (puede ser cero o aleatorio)
 */
export const generateInitialGuess = (
  size: number,
  type: 'zero' | 'random' = 'zero'
): Vector => {
  if (type === 'zero') {
    return Array(size).fill(0);
  }
  return Array.from({ length: size }, () => Math.random());
};

/**
 * Calcula el radio espectral aproximado (para convergencia)
 */
export const estimateSpectralRadius = (
  A: Matrix,
  method: 'jacobi' | 'gauss-seidel'
): number => {
  const n = A.length;
  
  if (method === 'jacobi') {
    // Para Jacobi: ρ(D^-1(L+U))
    let maxSum = 0;
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sum += Math.abs(A[i][j] / A[i][i]);
        }
      }
      maxSum = Math.max(maxSum, sum);
    }
    return maxSum;
  } else {
    // Para Gauss-Seidel (aproximación)
    let maxSum = 0;
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += Math.abs(A[i][j] / A[i][i]);
      }
      maxSum = Math.max(maxSum, sum);
    }
    return maxSum;
  }
};