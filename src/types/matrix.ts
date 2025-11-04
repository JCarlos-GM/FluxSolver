export type Matrix = number[][];
export type Vector = number[];

export interface MatrixSize {
  rows: number;
  cols: number;
}

export interface LinearSystem {
  A: Matrix;  // Matriz de coeficientes
  b: Vector;  // Vector de términos independientes
  size: number;
}

export interface MatrixValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}