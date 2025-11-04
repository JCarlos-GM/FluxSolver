import type { Matrix, ConvergenceInfo } from '../../types';
import { estimateSpectralRadius } from './utils';
import { isDiagonallyDominant } from '../../utils/validators';

/**
 * Analiza las condiciones de convergencia para un método iterativo
 */
export const analyzeConvergence = (
  A: Matrix,
  method: 'jacobi' | 'gauss-seidel'
): ConvergenceInfo => {
  const n = A.length;
  
  // Verificar dominancia diagonal
  const diagonallyDominant = isDiagonallyDominant(A);
  
  // Estimar radio espectral
  const spectralRadius = estimateSpectralRadius(A, method);
  
  // Calcular número de condición (aproximado)
  const conditionNumber = calculateConditionNumber(A);
  
  return {
    isDiagonallyDominant: diagonallyDominant,
    spectralRadius,
    conditionNumber,
  };
};

/**
 * Calcula el número de condición de una matriz (aproximado)
 */
const calculateConditionNumber = (A: Matrix): number => {
  const n = A.length;
  
  // Norma infinito de A
  let normA = 0;
  for (let i = 0; i < n; i++) {
    const rowSum = A[i].reduce((sum, val) => sum + Math.abs(val), 0);
    normA = Math.max(normA, rowSum);
  }
  
  // Aproximación simple del número de condición
  // (requeriría calcular la inversa para ser exacto)
  return normA;
};

/**
 * Predice el número de iteraciones necesarias
 */
export const predictIterations = (
  spectralRadius: number,
  tolerance: number
): number => {
  if (spectralRadius >= 1) {
    return Infinity; // No converge
  }
  
  // Estimación basada en la tasa de convergencia
  // k ≈ ln(tol) / ln(ρ)
  const k = Math.log(tolerance) / Math.log(spectralRadius);
  return Math.ceil(Math.abs(k));
};

/**
 * Sugiere el mejor método basado en la matriz
 */
export const suggestMethod = (A: Matrix): 'jacobi' | 'gauss-seidel' => {
  const jacobiRadius = estimateSpectralRadius(A, 'jacobi');
  const gsRadius = estimateSpectralRadius(A, 'gauss-seidel');
  
  // Gauss-Seidel generalmente converge más rápido
  return gsRadius < jacobiRadius ? 'gauss-seidel' : 'jacobi';
};

/**
 * Calcula la tasa de convergencia promedio
 */
export const calculateConvergenceRate = (errors: number[]): number => {
  if (errors.length < 2) return 0;
  
  let sumRates = 0;
  let count = 0;
  
  for (let i = 1; i < errors.length; i++) {
    if (errors[i - 1] !== 0) {
      sumRates += errors[i] / errors[i - 1];
      count++;
    }
  }
  
  return count > 0 ? sumRates / count : 0;
};