import React, { createContext, useContext, type ReactNode } from 'react';
import { useMatrix } from '../hooks/useMatrix';
import { useSolver } from '../hooks/useSolver';
import { useHistory } from '../hooks/useHistory';

interface SolverContextType {
  // Matrix
  matrix: ReturnType<typeof useMatrix>['matrix'];
  vector: ReturnType<typeof useMatrix>['vector'];
  size: ReturnType<typeof useMatrix>['size'];
  validation: ReturnType<typeof useMatrix>['validation'];
  setSize: ReturnType<typeof useMatrix>['setSize'];
  updateCell: ReturnType<typeof useMatrix>['updateCell'];
  updateVectorCell: ReturnType<typeof useMatrix>['updateVectorCell'];
  clearMatrix: ReturnType<typeof useMatrix>['clearMatrix'];
  fillRandom: ReturnType<typeof useMatrix>['fillRandom'];
  setSystem: ReturnType<typeof useMatrix>['setSystem'];
  getSystem: ReturnType<typeof useMatrix>['getSystem'];
  isValid: ReturnType<typeof useMatrix>['isValid'];
  
  // Solver
  result: ReturnType<typeof useSolver>['result'];
  isLoading: ReturnType<typeof useSolver>['isLoading'];
  error: ReturnType<typeof useSolver>['error'];
  config: ReturnType<typeof useSolver>['config'];
  updateConfig: ReturnType<typeof useSolver>['updateConfig'];
  solveSystem: ReturnType<typeof useSolver>['solveMSystem'];
  reset: ReturnType<typeof useSolver>['reset'];
  
  // History
  history: ReturnType<typeof useHistory>['history'];
  addToHistory: ReturnType<typeof useHistory>['addToHistory'];
  removeFromHistory: ReturnType<typeof useHistory>['removeFromHistory'];
  clearHistory: ReturnType<typeof useHistory>['clearHistory'];
  getHistoryItem: ReturnType<typeof useHistory>['getHistoryItem'];
}

const SolverContext = createContext<SolverContextType | undefined>(undefined);

export const SolverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const matrix = useMatrix();
  const solver = useSolver();
  const history = useHistory();

  const value: SolverContextType = {
    // Matrix
    matrix: matrix.matrix,
    vector: matrix.vector,
    size: matrix.size,
    validation: matrix.validation,
    setSize: matrix.setSize,
    updateCell: matrix.updateCell,
    updateVectorCell: matrix.updateVectorCell,
    clearMatrix: matrix.clearMatrix,
    fillRandom: matrix.fillRandom,
    setSystem: matrix.setSystem,
    getSystem: matrix.getSystem,
    isValid: matrix.isValid,
    
    // Solver
    result: solver.result,
    isLoading: solver.isLoading,
    error: solver.error,
    config: solver.config,
    updateConfig: solver.updateConfig,
    solveSystem: solver.solveMSystem,
    reset: solver.reset,
    
    // History
    history: history.history,
    addToHistory: history.addToHistory,
    removeFromHistory: history.removeFromHistory,
    clearHistory: history.clearHistory,
    getHistoryItem: history.getHistoryItem,
  };

  return (
    <SolverContext.Provider value={value}>
      {children}
    </SolverContext.Provider>
  );
};

export const useSolverContext = () => {
  const context = useContext(SolverContext);
  if (context === undefined) {
    throw new Error('useSolverContext debe ser usado dentro de SolverProvider');
  }
  return context;
};