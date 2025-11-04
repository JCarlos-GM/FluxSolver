import type { Matrix, Vector } from '../types';

/**
 * Formatea un número con precisión específica
 */
export const formatNumber = (
  num: number,
  precision: number = 6,
  removeTrailingZeros: boolean = true
): string => {
  const formatted = num.toFixed(precision);
  return removeTrailingZeros ? parseFloat(formatted).toString() : formatted;
};

/**
 * Formatea un número en notación científica si es muy grande o pequeño
 */
export const formatScientific = (num: number, threshold: number = 1e-4): string => {
  if (Math.abs(num) < threshold && num !== 0) {
    return num.toExponential(4);
  }
  if (Math.abs(num) > 1e6) {
    return num.toExponential(4);
  }
  return formatNumber(num);
};

/**
 * Formatea un vector como string
 */
export const formatVector = (vector: Vector, precision: number = 6): string => {
  return `[${vector.map(v => formatNumber(v, precision)).join(', ')}]`;
};

/**
 * Formatea una matriz como string legible
 */
export const formatMatrix = (matrix: Matrix, precision: number = 4): string => {
  return matrix
    .map(row => `[${row.map(v => formatNumber(v, precision).padStart(10)).join(' ')}]`)
    .join('\n');
};

/**
 * Formatea un error (porcentaje)
 */
export const formatError = (error: number): string => {
  if (error < 1e-10) return '< 1e-10';
  if (error < 0.01) return error.toExponential(2);
  return `${(error * 100).toFixed(4)}%`;
};

/**
 * Formatea tiempo de ejecución
 */
export const formatExecutionTime = (milliseconds: number): string => {
  if (milliseconds < 1) return '< 1ms';
  if (milliseconds < 1000) return `${milliseconds.toFixed(0)}ms`;
  return `${(milliseconds / 1000).toFixed(2)}s`;
};

/**
 * Formatea una fecha
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea una fecha relativa (hace X tiempo)
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  
  return formatDate(date);
};

/**
 * Convierte una matriz a formato LaTeX
 */
export const matrixToLatex = (matrix: Matrix): string => {
  const rows = matrix
    .map(row => row.map(v => formatNumber(v, 4)).join(' & '))
    .join(' \\\\ ');
  
  return `\\begin{bmatrix}\n${rows}\n\\end{bmatrix}`;
};

/**
 * Convierte un sistema de ecuaciones a formato LaTeX
 */
export const systemToLatex = (matrix: Matrix, vector: Vector): string => {
  const n = matrix.length;
  const variables = Array.from({ length: n }, (_, i) => `x_${i + 1}`);
  
  const equations = matrix.map((row, i) => {
    const terms = row
      .map((coef, j) => {
        if (coef === 0) return null;
        const sign = coef > 0 && j > 0 ? '+' : '';
        const coefStr = Math.abs(coef) === 1 ? '' : Math.abs(coef).toString();
        return `${sign}${coef < 0 ? '-' : ''}${coefStr}${variables[j]}`;
      })
      .filter(Boolean)
      .join(' ');
    
    return `${terms} &= ${vector[i]}`;
  });

  return `\\begin{cases}\n${equations.join(' \\\\ \n')}\n\\end{cases}`;
};