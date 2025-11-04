import type { Matrix, Vector } from '../types';

interface ParsedEquation {
  coefficients: number[];
  constant: number;
}

/**
 * Parsea texto extraído de OCR a un sistema de ecuaciones
 */
export const parseEquationsFromText = (text: string, expectedSize?: number): { A: Matrix; b: Vector } | null => {
  try {
    // Limpiar y normalizar el texto
    const cleanedText = cleanText(text);
    
    // Extraer ecuaciones
    const equations = extractEquations(cleanedText);
    
    if (equations.length === 0) {
      throw new Error('No se encontraron ecuaciones en el texto');
    }

    // Determinar el tamaño del sistema
    const size = expectedSize || equations.length;
    
    // Parsear cada ecuación
    const parsed: ParsedEquation[] = equations.map(eq => parseEquation(eq, size));
    
    // Validar que todas las ecuaciones tengan el mismo número de variables
    if (parsed.some(eq => eq.coefficients.length !== size)) {
      throw new Error('Las ecuaciones tienen diferente número de variables');
    }

    // Construir matriz A y vector b
    const A: Matrix = parsed.map(eq => eq.coefficients);
    const b: Vector = parsed.map(eq => eq.constant);

    return { A, b };
  } catch (err) {
    console.error('Error al parsear ecuaciones:', err);
    return null;
  }
};

/**
 * Limpia y normaliza el texto
 */
const cleanText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
    .replace(/[{}[\]]/g, '') // Eliminar llaves y corchetes
    .trim();
};

/**
 * Extrae ecuaciones individuales del texto
 */
const extractEquations = (text: string): string[] => {
  // Patrones comunes de separación de ecuaciones
  const separators = [
    /\n+/,           // Saltos de línea
    /[;,]\s*/,       // Punto y coma o coma
    /\s+y\s+/,       // "y"
    /ecuación\s*\d*/i, // "ecuación 1", "ecuación 2"
  ];

  // Intentar separar por cada patrón
  for (const separator of separators) {
    const split = text.split(separator).filter(s => s.trim().length > 0);
    if (split.length > 1) {
      return split;
    }
  }

  // Si no hay separadores claros, buscar por el signo igual
  const equalsMatches = text.match(/[^=]+=\s*-?\d+(?:\.\d+)?/g);
  if (equalsMatches && equalsMatches.length > 0) {
    return equalsMatches;
  }

  // Si solo hay una línea, devolverla
  return [text];
};

/**
 * Parsea una ecuación individual
 */
const parseEquation = (equation: string, size: number): ParsedEquation => {
  // Dividir por el signo igual
  const parts = equation.split('=');
  if (parts.length !== 2) {
    throw new Error(`Ecuación inválida: ${equation}`);
  }

  const leftSide = parts[0].trim();
  const rightSide = parts[1].trim();

  // Parsear el lado derecho (constante)
  const constant = parseFloat(rightSide);
  if (isNaN(constant)) {
    throw new Error(`Constante inválida en: ${equation}`);
  }

  // Parsear el lado izquierdo (coeficientes)
  const coefficients = parseCoefficients(leftSide, size);

  return { coefficients, constant };
};

/**
 * Parsea los coeficientes del lado izquierdo de una ecuación
 */
const parseCoefficients = (expression: string, size: number): number[] => {
  const coefficients = Array(size).fill(0);
  
  // Normalizar la expresión
  let normalized = expression
    .replace(/\s+/g, '')  // Eliminar espacios
    .replace(/−/g, '-')   // Reemplazar guiones largos
    .replace(/×/g, '*')   // Reemplazar por multiplicación
    .replace(/\*/g, '')   // Eliminar signos de multiplicación explícitos
    ;

  // Agregar + al inicio si no hay signo
  if (normalized[0] !== '+' && normalized[0] !== '-') {
    normalized = '+' + normalized;
  }

  // Patrones para detectar términos
  // Ejemplos: +2x, -3y, +x, -z, +5x1, -2x2
  const termPattern = /([+-])\s*(\d*\.?\d*)\s*([a-z]\d*)/gi;
  
  const matches = [...normalized.matchAll(termPattern)];

  for (const match of matches) {
    const sign = match[1] === '-' ? -1 : 1;
    const coef = match[2] === '' ? 1 : parseFloat(match[2]);
    const variable = match[3].toLowerCase();

    // Determinar el índice de la variable
    let index = -1;
    
    // Si es x, y, z, w, etc.
    if (variable.length === 1) {
      index = variable.charCodeAt(0) - 'x'.charCodeAt(0);
    } 
    // Si es x1, x2, x3, etc.
    else if (variable[0] === 'x') {
      index = parseInt(variable.substring(1)) - 1;
    }

    // Validar índice
    if (index >= 0 && index < size) {
      coefficients[index] = sign * coef;
    }
  }

  return coefficients;
};

/**
 * Función auxiliar para detectar el tamaño del sistema automáticamente
 */
export const detectSystemSize = (text: string): number => {
  const cleanedText = cleanText(text);
  const variables = new Set<string>();

  // Buscar todas las variables
  const variablePattern = /([a-z]\d*)/gi;
  const matches = cleanedText.matchAll(variablePattern);

  for (const match of matches) {
    variables.add(match[1].toLowerCase());
  }

  return Math.max(2, Math.min(5, variables.size)); // Entre 2 y 5
};

/**
 * Ejemplos de formatos soportados:
 * 
 * "2x + 3y = 5"
 * "x - 2y = 3"
 * 
 * "2x1 + 3x2 = 5"
 * "x1 - 2x2 = 3"
 * 
 * "2*x + 3*y = 5"
 * "x - 2*y = 3"
 */