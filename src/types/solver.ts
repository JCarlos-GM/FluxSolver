import type { Vector, Matrix } from './matrix';

export type SolverMethod = 'jacobi' | 'gauss-seidel';

export interface Iteration {
  k: number;           // Número de iteración
  x: Vector;           // Vector solución en esta iteración
  error: number;       // Error absoluto
  relativeError?: number;  // Error relativo
  residual?: number;   // Residuo
}

export interface SolverConfig {
  method: SolverMethod;
  tolerance: number;
  maxIterations: number;
  initialGuess?: Vector;
}

export interface SolverResult {
  solution: Vector;
  iterations: Iteration[];
  converged: boolean;
  finalError: number;
  iterationCount: number;
  method: SolverMethod;
  executionTime: number;  // en milisegundos
}

export interface ConvergenceInfo {
  isDiagonallyDominant: boolean;
  conditionNumber?: number;
  spectralRadius?: number;
  convergenceRate?: number;
}