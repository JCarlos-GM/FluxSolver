import { useState, useCallback } from 'react';
import type { Matrix, Vector, LinearSystem, MatrixValidation } from '../types';
import { validateLinearSystem } from '../utils/validators';
import { SOLVER_DEFAULTS } from '../utils/constants';

interface UseMatrixReturn {
  matrix: Matrix;
  vector: Vector;
  size: number;
  validation: MatrixValidation;
  setSize: (size: number) => void;
  updateCell: (row: number, col: number, value: number) => void;
  updateVectorCell: (index: number, value: number) => void;
  clearMatrix: () => void;
  fillRandom: () => void;
  setSystem: (A: Matrix, b: Vector) => void;
  getSystem: () => LinearSystem;
  isValid: boolean;
}

export const useMatrix = (initialSize: number = SOLVER_DEFAULTS.DEFAULT_MATRIX_SIZE): UseMatrixReturn => {
  const createEmptyMatrix = useCallback((n: number): Matrix => {
    return Array(n).fill(0).map(() => Array(n).fill(0));
  }, []);

  const createEmptyVector = useCallback((n: number): Vector => {
    return Array(n).fill(0);
  }, []);

  const [size, setSize] = useState(initialSize);
  const [matrix, setMatrix] = useState<Matrix>(() => createEmptyMatrix(initialSize));
  const [vector, setVector] = useState<Vector>(() => createEmptyVector(initialSize));
  const [validation, setValidation] = useState<MatrixValidation>({
    isValid: false,
    errors: [],
    warnings: [],
  });

  // Actualizar tamaño de la matriz
  const handleSetSize = useCallback((newSize: number) => {
    if (newSize < SOLVER_DEFAULTS.MIN_MATRIX_SIZE || newSize > SOLVER_DEFAULTS.MAX_MATRIX_SIZE) {
      return;
    }
    
    setSize(newSize);
    setMatrix(createEmptyMatrix(newSize));
    setVector(createEmptyVector(newSize));
  }, [createEmptyMatrix, createEmptyVector]);

  // Actualizar una celda de la matriz
  const updateCell = useCallback((row: number, col: number, value: number) => {
    setMatrix(prev => {
      const newMatrix = prev.map(r => [...r]);
      newMatrix[row][col] = value;
      return newMatrix;
    });
  }, []);

  // Actualizar una celda del vector
  const updateVectorCell = useCallback((index: number, value: number) => {
    setVector(prev => {
      const newVector = [...prev];
      newVector[index] = value;
      return newVector;
    });
  }, []);

  // Limpiar matriz y vector
  const clearMatrix = useCallback(() => {
    setMatrix(createEmptyMatrix(size));
    setVector(createEmptyVector(size));
  }, [size, createEmptyMatrix, createEmptyVector]);

  // Llenar con valores aleatorios
  const fillRandom = useCallback(() => {
    const randomMatrix = Array(size).fill(0).map((_, i) =>
      Array(size).fill(0).map((_, j) => {
        // Hacer la diagonal dominante para asegurar convergencia
        if (i === j) {
          return Math.floor(Math.random() * 20) + 10;
        }
        return Math.floor(Math.random() * 10) - 5;
      })
    );
    
    const randomVector = Array(size).fill(0).map(() =>
      Math.floor(Math.random() * 20) - 10
    );

    setMatrix(randomMatrix);
    setVector(randomVector);
  }, [size]);

  // Establecer sistema completo
  const setSystem = useCallback((A: Matrix, b: Vector) => {
    if (A.length !== b.length) {
      console.error('Las dimensiones de A y b no coinciden');
      return;
    }
    
    setSize(A.length);
    setMatrix(A.map(row => [...row]));
    setVector([...b]);
  }, []);

  // Obtener sistema completo
  const getSystem = useCallback((): LinearSystem => {
    return {
      A: matrix.map(row => [...row]),
      b: [...vector],
      size,
    };
  }, [matrix, vector, size]);

  // Validar sistema cuando cambia
  useState(() => {
    const newValidation = validateLinearSystem(matrix, vector);
    setValidation(newValidation);
  });

  return {
    matrix,
    vector,
    size,
    validation,
    setSize: handleSetSize,
    updateCell,
    updateVectorCell,
    clearMatrix,
    fillRandom,
    setSystem,
    getSystem,
    isValid: validation.isValid,
  };
};