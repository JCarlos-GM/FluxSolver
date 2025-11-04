export * from './matrix';
export * from './solver';
export * from './input';

export interface HistoryItem {
  id: string;
  timestamp: Date;
  system: {
    A: number[][];
    b: number[];
  };
  method: 'jacobi' | 'gauss-seidel';
  result: {
    solution: number[];
    iterations: number;
    converged: boolean;
  };
  config: {
    tolerance: number;
    maxIterations: number;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultMethod: 'jacobi' | 'gauss-seidel';
  defaultTolerance: number;
  defaultMaxIterations: number;
  showAnimations: boolean;
  defaultMatrixSize: number;
}