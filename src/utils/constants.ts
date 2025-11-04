export const SOLVER_DEFAULTS = {
  TOLERANCE: 1e-6,
  MAX_ITERATIONS: 100,
  DEFAULT_MATRIX_SIZE: 3,
  MIN_MATRIX_SIZE: 2,
  MAX_MATRIX_SIZE: 10,
} as const;

export const MATRIX_SIZES = [
  { value: 2, label: '2×2' },
  { value: 3, label: '3×3' },
  { value: 4, label: '4×4' },
  { value: 5, label: '5×5' },
] as const;

export const SOLVER_METHODS = [
  { value: 'jacobi', label: 'Método de Jacobi' },
  { value: 'gauss-seidel', label: 'Método de Gauss-Seidel' },
] as const;

export const INPUT_MODES = [
  { value: 'manual', label: 'Manual', icon: 'Edit' },
  { value: 'voice', label: 'Voz', icon: 'Mic' },
  { value: 'image', label: 'Imagen', icon: 'Camera' },
] as const;

export const ERROR_MESSAGES = {
  INVALID_MATRIX: 'La matriz ingresada no es válida',
  SINGULAR_MATRIX: 'La matriz es singular (no tiene solución única)',
  NO_CONVERGENCE: 'El método no converge con esta matriz',
  NOT_DIAGONALLY_DOMINANT: 'La matriz no es diagonalmente dominante',
  INVALID_SIZE: 'El tamaño de la matriz no es válido',
  EMPTY_FIELD: 'Todos los campos deben estar llenos',
  INVALID_NUMBER: 'Ingrese solo números válidos',
} as const;

export const SUCCESS_MESSAGES = {
  SOLVED: 'Sistema resuelto exitosamente',
  SAVED: 'Guardado en el historial',
  EXPORTED: 'Exportado correctamente',
  COPIED: 'Copiado al portapapeles',
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const COLORS = {
  primary: '#12957D',
  secondary: '#69B1FF',
  accent: {
    orange: '#FF8D24',
    red: '#FF5D5D',
    yellow: '#FFB700',
    green: '#52C41A',
    purple: '#CB5DFF',
  },
} as const;