import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icons } from '../../icons';

type InputViewMode = 'matricial' | 'coeficientes' | 'ecuacion';

// Clases para ocultar los spinners de los inputs tipo 'number'
const hideSpinners =
  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

interface MatrixInputProps {
  matrix: number[][];
  vector: number[];
  size: number;
  onCellChange: (row: number, col: number, value: number) => void;
  onVectorChange: (index: number, value: number) => void;
  onClear?: () => void;
  onFillRandom?: () => void;
  viewMode?: InputViewMode;
}

export const MatrixInput: React.FC<MatrixInputProps> = ({
  matrix,
  vector,
  size,
  onCellChange,
  onVectorChange,
  onClear,
  onFillRandom,
  viewMode = 'matricial',
}) => {
  const handleCellInput = (row: number, col: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onCellChange(row, col, numValue);
    } else if (value === '') {
      onCellChange(row, col, 0);
    }
  };

  const handleVectorInput = (index: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onVectorChange(index, numValue);
    } else if (value === '') {
      onVectorChange(index, 0);
    }
  };

  // Variables para las ecuaciones
  const getVariableName = (index: number): string => {
    return String.fromCharCode(120 + index); // x, y, z, w, v
  };

  // ==================== VISTA MATRICIAL (CON SCROLL PARA 4×4 Y 5×5) ====================
  const renderMatricialView = () => {
    // Tamaños dinámicos según el tamaño de la matriz
    const cellSize = size >= 4 ? 'w-20 h-12 text-xl' : 'w-24 h-14 text-2xl';
    const gap = size >= 4 ? 'gap-2' : 'gap-3';
    
    const baseCellStyle = `
      ${cellSize} text-center rounded-lg  
      border border-gray-300 bg-gray-100 
      input-focus 
      ${hideSpinners}
    `;

    return (
      <div className="overflow-x-auto">
        <div className="flex justify-center items-center gap-6 p-4 min-w-fit">
          {/* Matriz A */}
          <div className="p-3">
            <div className={`flex flex-col ${gap}`}>
              {matrix.map((row, i) => (
                <div key={i} className={`flex ${gap}`}>
                  {row.map((cell, j) => (
                    <div key={j} className="relative">
                      <input
                        type="number"
                        step="any"
                        value={cell === 0 ? '' : cell}
                        onChange={(e) => handleCellInput(i, j, e.target.value)}
                        placeholder="0"
                        aria-label={`Coeficiente A fila ${i + 1} columna ${j + 1}`}
                        className={`${baseCellStyle} ${
                          i === j ? 'text-primary' : ''
                        }`}
                      />
                      {i === j && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          d
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Separador */}
          <div className={`w-1 ${size >= 4 ? 'h-20' : 'h-24'} bg-primary rounded-full`}></div>

          {/* Vector b */}
          <div className="p-3">
            <div className={`flex flex-col ${gap}`}>
              {vector.map((value, i) => (
                <input
                  key={i}
                  type="number"
                  step="any"
                  value={value === 0 ? '' : value}
                  onChange={(e) => handleVectorInput(i, e.target.value)}
                  placeholder="0"
                  aria-label={`Valor b fila ${i + 1}`}
                  className={baseCellStyle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== VISTA COEFICIENTES (CENTRADA) ====================
  const renderCoeficientesView = () => (
    <div className="flex justify-center items-center p-4">
      <div className="space-y-4 w-full max-w-4xl">
        {matrix.map((row, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-base font-semibold text-text-secondary min-w-[100px]">
              Ecuación {i + 1}:
            </span>
            
            <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
              {row.map((coeff, j) => (
                <React.Fragment key={j}>
                  {j > 0 && (
                    <span className="text-text-secondary text-xl font-bold">+</span>
                  )}
                  <input
                    type="number"
                    step="any"
                    value={coeff === 0 ? '' : coeff}
                    onChange={(e) => handleCellInput(i, j, e.target.value)}
                    placeholder="0"
                    className={`w-16 h-12 text-xl text-center rounded-lg border-2 border-gray-300 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${hideSpinners}`}
                  />
                  <span className="text-text-primary font-medium text-lg">
                    {getVariableName(j)}
                  </span>
                </React.Fragment>
              ))}
              
              <span className="text-text-secondary text-2xl font-bold mx-2">=</span>
              
              <input
                type="number"
                step="any"
                value={vector[i] === 0 ? '' : vector[i]}
                onChange={(e) => handleVectorInput(i, e.target.value)}
                placeholder="0"
                className={`w-20 h-12 text-xl text-center rounded-lg border-2 border-primary bg-primary/5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold ${hideSpinners}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== VISTA ECUACIÓN DIRECTA (ESTILO INPUT ÚNICO) ====================
  const renderEcuacionView = () => (
    <div className="flex justify-center items-center p-4">
      <div className="space-y-3 w-full max-w-4xl">
        {matrix.map((row, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Ecuación {i + 1}
            </label>
            <input
              type="text"
              value={formatEquation(row, vector[i])}
              onChange={(e) => parseEquation(e.target.value, i)}
              placeholder={`Ej: 2x + 3y - z = 5`}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );

  // Formatear ecuación desde matriz a texto
  const formatEquation = (row: number[], result: number): string => {
    let equation = '';
    
    row.forEach((coeff, j) => {
      if (coeff === 0) return; // Ignorar términos con coeficiente 0
      
      const variable = getVariableName(j);
      const absCoeff = Math.abs(coeff);
      
      if (j === 0) {
        // Primer término
        if (coeff < 0) equation += '-';
        if (absCoeff !== 1) equation += absCoeff;
        equation += variable;
      } else {
        // Términos siguientes
        equation += coeff > 0 ? ' + ' : ' - ';
        if (absCoeff !== 1) equation += absCoeff;
        equation += variable;
      }
    });
    
    equation += ` = ${result}`;
    return equation || '0 = 0';
  };

  // Parsear ecuación desde texto a matriz
  const parseEquation = (text: string, rowIndex: number) => {
    try {
      // Separar por el signo igual
      const [leftSide, rightSide] = text.split('=').map(s => s.trim());
      
      if (!rightSide) return;
      
      // Parsear el lado derecho (resultado)
      const result = parseFloat(rightSide) || 0;
      onVectorChange(rowIndex, result);
      
      // Parsear el lado izquierdo (coeficientes)
      // Reemplazar espacios y preparar para parsing
      const normalized = leftSide
        .replace(/\s+/g, '') // Eliminar espacios
        .replace(/([+-])/g, ' $1 ') // Separar signos
        .trim();
      
      const terms = normalized.split(' ').filter(t => t);
      
      // Inicializar todos los coeficientes en 0
      const newCoefficients = new Array(size).fill(0);
      
      let currentSign = 1;
      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        
        if (term === '+') {
          currentSign = 1;
        } else if (term === '-') {
          currentSign = -1;
        } else {
          // Es un término con variable
          for (let varIndex = 0; varIndex < size; varIndex++) {
            const varName = getVariableName(varIndex);
            if (term.includes(varName)) {
              // Extraer coeficiente
              const coeffStr = term.replace(varName, '');
              const coeff = coeffStr === '' || coeffStr === '+' || coeffStr === '-' 
                ? 1 
                : parseFloat(coeffStr) || 1;
              
              newCoefficients[varIndex] = currentSign * coeff;
              currentSign = 1; // Reset
              break;
            }
          }
        }
      }
      
      // Actualizar todos los coeficientes
      newCoefficients.forEach((coeff, j) => {
        onCellChange(rowIndex, j, coeff);
      });
      
    } catch (error) {
      console.error('Error parseando ecuación:', error);
    }
  };

  return (
    <Card className="p-6">
      {/* Controles y Título */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            Sistema de Ecuaciones
          </h3>
          <p className="text-x text-text-secondary mt-1">
            {viewMode === 'matricial' && 'Vista Matricial'}
            {viewMode === 'coeficientes' && 'Vista por Coeficientes'}
            {viewMode === 'ecuacion' && 'Vista de Ecuación Directa'}
          </p>
        </div>
        <div className="flex gap-2">
          {onFillRandom && (
            <Button
              variant="ghost"
              size="sm"
              icon="RefreshCw"
              onClick={onFillRandom}
            >
              Aleatorio
            </Button>
          )}
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={onClear}
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Renderizar vista según el modo */}
      {viewMode === 'matricial' && renderMatricialView()}
      {viewMode === 'coeficientes' && renderCoeficientesView()}
      {viewMode === 'ecuacion' && renderEcuacionView()}

      {/* Ayuda visual */}
      <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-l text-blue-700">
          {viewMode === 'matricial' && (
            <>
              <p className="font-medium mb-1">Vista Matricial</p>
              <p className="text-m">Los valores de la diagonal (marcados con 'd') deben ser dominantes para mejor convergencia.</p>
            </>
          )}
          {viewMode === 'coeficientes' && (
            <>
              <p className="font-medium mb-1">Vista por Coeficientes</p>
              <p className="text-m">Ingresa cada coeficiente seguido de su variable. El último valor es el resultado.</p>
            </>
          )}
          {viewMode === 'ecuacion' && (
            <>
              <p className="font-medium mb-1">Vista de Ecuación Directa</p>
              <p className="text-m">Escribe directamente las ecuaciones. Ejemplo: 2x + 3y - z = 5. Puedes omitir coeficientes igual a 1.</p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};