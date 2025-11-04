import { useState, useCallback } from 'react';
import type { SolverConfig, SolverResult, Matrix, Vector, SolverMethod } from '../types';
import { solve } from '../modules/solvers';
import { SOLVER_DEFAULTS } from '../utils/constants';

interface UseSolverReturn {
  result: SolverResult | null;
  isLoading: boolean;
  error: string | null;
  config: SolverConfig;
  updateConfig: (partial: Partial<SolverConfig>) => void;
  solveMSystem: (A: Matrix, b: Vector) => Promise<void>;
  reset: () => void;
}

export const useSolver = (
  initialMethod: SolverMethod = 'jacobi'
): UseSolverReturn => {
  const [result, setResult] = useState<SolverResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<SolverConfig>({
    method: initialMethod,
    tolerance: SOLVER_DEFAULTS.TOLERANCE,
    maxIterations: SOLVER_DEFAULTS.MAX_ITERATIONS,
  });

  // Actualizar configuración
  const updateConfig = useCallback((partial: Partial<SolverConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  // Resolver sistema
  const solveSystem = useCallback(async (A: Matrix, b: Vector) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simular delay para mostrar loading (opcional)
      await new Promise(resolve => setTimeout(resolve, 100));

      const solverResult = solve(A, b, config);
      setResult(solverResult);

      if (!solverResult.converged) {
        setError(`El método no convergió después de ${solverResult.iterationCount} iteraciones`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al resolver sistema:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // Resetear estado
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    result,
    isLoading,
    error,
    config,
    updateConfig,
    solveMSystem: solveSystem,
    reset,
  };
};