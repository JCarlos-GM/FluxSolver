export { jacobi, jacobiVectorized } from './jacobi';
export { gaussSeidel, gaussSeidelSOR } from './gaussSeidel';
export * from './utils';
export * from './convergence';

import type { Matrix, Vector, SolverConfig, SolverResult } from '../../types';
import { jacobi } from './jacobi';
import { gaussSeidel } from './gaussSeidel';

/**
 * Función unificada para resolver sistemas con cualquier método
 */
export const solve = (
  A: Matrix,
  b: Vector,
  config: SolverConfig
): SolverResult => {
  switch (config.method) {
    case 'jacobi':
      return jacobi(A, b, config);
    case 'gauss-seidel':
      return gaussSeidel(A, b, config);
    default:
      throw new Error(`Método desconocido: ${config.method}`);
  }
};