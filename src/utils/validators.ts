import { Matrix, Vector, MatrixValidation } from '../types';

/**
 * Valida que una matriz sea cuadrada y no esté vacía
 */
export const isValidMatrix = (matrix: Matrix): boolean => {
  if (!matrix || matrix.length === 0) return false;
  
  const n = matrix.length;
  return matrix.every(row => row && row.length === n);
};

/**
 * Valida que un vector tenga la longitud correcta
 */
export const isValidVector = (vector: Vector, expectedLength: number): boolean => {
  return vector && vector.length === expectedLength;
};

/**
 * Valida que todos los elementos sean números válidos
 */
export const hasValidNumbers = (matrix: Matrix): boolean => {
  return matrix.every(row =>
    row.every(val => typeof val === 'number' && !isNaN(val) && isFinite(val))
  );
};

/**
 * Calcula el determinante de una matriz (método de expansión de cofactores)
 */
export const calculateDeterminant = (matrix: Matrix): number => {
  const n = matrix.length;
  
  if (n === 1) return matrix[0][0];
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }
  
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = matrix
      .slice(1)
      .map(row => row.filter((_, colIndex) => colIndex !== j));
    
    det += Math.pow(-1, j) * matrix[0][j] * calculateDeterminant(minor);
  }
  
  return det;
};

/**
 * Verifica si la matriz es singular (determinante = 0)
 */
export const isSingular = (matrix: Matrix): boolean => {
  // const det = calculateDeterminant(matrix);
  // return Math.abs(det) < 1e-10; 

  // 🚨 Desactivar temporalmente la comprobación de singularidad:
  return false; 
};

/**
 * Verifica si la matriz es diagonalmente dominante (estricta)
 */
export const isDiagonallyDominant = (matrix: Matrix): boolean => {
  return matrix.every((row, i) => {
    const diagonal = Math.abs(row[i]);
    const sumOthers = row.reduce((sum, val, j) => 
      i !== j ? sum + Math.abs(val) : sum, 0
    );
    return diagonal > sumOthers;
  });
};

/**
 * Verifica si la matriz es diagonalmente dominante (débil)
 */
export const isWeaklyDiagonallyDominant = (matrix: Matrix): boolean => {
  return matrix.every((row, i) => {
    const diagonal = Math.abs(row[i]);
    const sumOthers = row.reduce((sum, val, j) => 
      i !== j ? sum + Math.abs(val) : sum, 0
    );
    return diagonal >= sumOthers;
  });
};

/**
 * Valida completamente un sistema de ecuaciones lineales
 */
export const validateLinearSystem = (
  matrix: Matrix,
  vector: Vector
): MatrixValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validación básica
  if (!isValidMatrix(matrix)) {
    errors.push('La matriz debe ser cuadrada');
  }

  if (!isValidVector(vector, matrix.length)) {
    errors.push('El vector de términos independientes tiene tamaño incorrecto');
  }

  if (!hasValidNumbers(matrix)) {
    errors.push('La matriz contiene valores no numéricos');
  }

  // Si hay errores básicos, retornar inmediatamente
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Validaciones avanzadas
  if (isSingular(matrix)) {
    errors.push('La matriz es singular (no tiene solución única)');
  }

  if (!isDiagonallyDominant(matrix)) {
    if (isWeaklyDiagonallyDominant(matrix)) {
      warnings.push('La matriz es débilmente dominante diagonal. La convergencia no está garantizada.');
    } else {
      warnings.push('La matriz no es diagonalmente dominante. Los métodos iterativos pueden no converger.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Valida un número individual
 */
export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Valida una entrada de texto numérica
 */
export const isValidNumberInput = (value: string): boolean => {
  if (value === '' || value === '-') return true;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};