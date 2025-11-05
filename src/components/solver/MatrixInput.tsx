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
    if (!isNaN(numValue)) onCellChange(row, col, numValue);
    else if (value === '') onCellChange(row, col, 0);
  };

  const handleVectorInput = (index: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) onVectorChange(index, numValue);
    else if (value === '') onVectorChange(index, 0);
  };

  const getVariableName = (index: number): string => String.fromCharCode(120 + index);

  // ==================== VISTA MATRICIAL ====================
  const renderMatricialView = () => {
    const cellSize = size >= 4 ? 'w-16 h-10 sm:w-20 sm:h-12 text-lg sm:text-xl' : 'w-20 h-12 sm:w-24 sm:h-14 text-xl sm:text-2xl';
    const gap = size >= 4 ? 'gap-1 sm:gap-2' : 'gap-2 sm:gap-3';
    const baseCellStyle = `
      ${cellSize} text-center rounded-lg border border-gray-300 bg-gray-100 input-focus ${hideSpinners}
    `;

    return (
      <div className="overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 p-2 sm:p-4 min-w-fit">
          {/* Matriz A */}
          <div className="p-2 sm:p-3">
            <div className={`flex flex-col ${gap}`}>
              {matrix.map((row, i) => (
                <div key={i} className={`flex justify-center ${gap}`}>
                  {row.map((cell, j) => (
                    <div key={j} className="relative">
                      <input
                        type="number"
                        step="any"
                        value={cell === 0 ? '' : cell}
                        onChange={(e) => handleCellInput(i, j, e.target.value)}
                        placeholder="0"
                        aria-label={`Coeficiente A fila ${i + 1} columna ${j + 1}`}
                        className={`${baseCellStyle} ${i === j ? 'text-primary' : ''}`}
                      />
                      {i === j && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] sm:text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
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
          <div className={`w-1 ${size >= 4 ? 'h-12 sm:h-20' : 'h-16 sm:h-24'} bg-primary rounded-full`} />

          {/* Vector b */}
          <div className="p-2 sm:p-3">
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

  // ==================== VISTA COEFICIENTES ====================
  const renderCoeficientesView = () => (
    <div className="flex justify-center items-center p-2 sm:p-4">
      <div className="space-y-3 sm:space-y-4 w-full max-w-4xl">
        {matrix.map((row, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 text-center sm:text-left"
          >
            <span className="text-sm sm:text-base font-semibold text-text-secondary min-w-[90px] sm:min-w-[100px]">
              Ecuación {i + 1}:
            </span>

            <div className="flex-1 flex flex-wrap justify-center sm:justify-start gap-2">
              {row.map((coeff, j) => (
                <React.Fragment key={j}>
                  {j > 0 && <span className="text-text-secondary text-lg sm:text-xl font-bold">+</span>}
                  <input
                    type="number"
                    step="any"
                    value={coeff === 0 ? '' : coeff}
                    onChange={(e) => handleCellInput(i, j, e.target.value)}
                    placeholder="0"
                    className={`w-14 sm:w-16 h-10 sm:h-12 text-lg text-center rounded-lg border-2 border-gray-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${hideSpinners}`}
                  />
                  <span className="text-text-primary font-medium text-base sm:text-lg">{getVariableName(j)}</span>
                </React.Fragment>
              ))}

              <span className="text-text-secondary text-xl sm:text-2xl font-bold mx-1 sm:mx-2">=</span>

              <input
                type="number"
                step="any"
                value={vector[i] === 0 ? '' : vector[i]}
                onChange={(e) => handleVectorInput(i, e.target.value)}
                placeholder="0"
                className={`w-16 sm:w-20 h-10 sm:h-12 text-lg text-center rounded-lg border-2 border-primary bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold ${hideSpinners}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== VISTA ECUACIÓN ====================
  const renderEcuacionView = () => (
    <div className="flex justify-center items-center p-2 sm:p-4">
      <div className="space-y-2 sm:space-y-3 w-full max-w-4xl">
        {matrix.map((row, i) => (
          <div key={i}>
            <label className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
              Ecuación {i + 1}
            </label>
            <input
              type="text"
              value={formatEquation(row, vector[i])}
              onChange={(e) => parseEquation(e.target.value, i)}
              placeholder="Ej: 2x + 3y - z = 5"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-lg border-2 border-gray-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );

  // === Helpers para ecuaciones ===
  const formatEquation = (row: number[], result: number): string => {
    let equation = '';
    row.forEach((coeff, j) => {
      if (coeff === 0) return;
      const variable = getVariableName(j);
      const absCoeff = Math.abs(coeff);
      if (j === 0) {
        if (coeff < 0) equation += '-';
        if (absCoeff !== 1) equation += absCoeff;
        equation += variable;
      } else {
        equation += coeff > 0 ? ' + ' : ' - ';
        if (absCoeff !== 1) equation += absCoeff;
        equation += variable;
      }
    });
    equation += ` = ${result}`;
    return equation || '0 = 0';
  };

  const parseEquation = (text: string, rowIndex: number) => {
    try {
      const [leftSide, rightSide] = text.split('=').map((s) => s.trim());
      if (!rightSide) return;
      const result = parseFloat(rightSide) || 0;
      onVectorChange(rowIndex, result);
      const normalized = leftSide.replace(/\s+/g, '').replace(/([+-])/g, ' $1 ').trim();
      const terms = normalized.split(' ').filter((t) => t);
      const newCoefficients = new Array(size).fill(0);
      let currentSign = 1;
      for (const term of terms) {
        if (term === '+') currentSign = 1;
        else if (term === '-') currentSign = -1;
        else {
          for (let varIndex = 0; varIndex < size; varIndex++) {
            const varName = getVariableName(varIndex);
            if (term.includes(varName)) {
              const coeffStr = term.replace(varName, '');
              const coeff = coeffStr === '' || coeffStr === '+' || coeffStr === '-' ? 1 : parseFloat(coeffStr) || 1;
              newCoefficients[varIndex] = currentSign * coeff;
              currentSign = 1;
              break;
            }
          }
        }
      }
      newCoefficients.forEach((coeff, j) => onCellChange(rowIndex, j, coeff));
    } catch (error) {
      console.error('Error parseando ecuación:', error);
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3 sm:gap-0 text-center sm:text-left">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-text-primary">Sistema de Ecuaciones</h3>
          <p className="text-sm sm:text-base text-text-secondary mt-1">
            {viewMode === 'matricial' && 'Vista Matricial'}
            {viewMode === 'coeficientes' && 'Vista por Coeficientes'}
            {viewMode === 'ecuacion' && 'Vista de Ecuación Directa'}
          </p>
        </div>

        <div className="flex justify-center sm:justify-end gap-2 flex-wrap">
          {onFillRandom && (
            <Button variant="ghost" size="sm" icon="RefreshCw" onClick={onFillRandom}>
              Aleatorio
            </Button>
          )}
          {onClear && (
            <Button variant="ghost" size="sm" icon="Trash2" onClick={onClear}>
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Vistas */}
      {viewMode === 'matricial' && renderMatricialView()}
      {viewMode === 'coeficientes' && renderCoeficientesView()}
      {viewMode === 'ecuacion' && renderEcuacionView()}

      {/* Ayuda visual */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start gap-2 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm sm:text-base text-center sm:text-left">
        <div className="text-blue-700">
          {viewMode === 'matricial' && (
            <>
              <p className="font-medium mb-1">Vista Matricial</p>
              <p>Los valores de la diagonal (marcados con 'd') deben ser dominantes para mejor convergencia.</p>
            </>
          )}
          {viewMode === 'coeficientes' && (
            <>
              <p className="font-medium mb-1">Vista por Coeficientes</p>
              <p>Ingresa cada coeficiente seguido de su variable. El último valor es el resultado.</p>
            </>
          )}
          {viewMode === 'ecuacion' && (
            <>
              <p className="font-medium mb-1">Vista de Ecuación Directa</p>
              <p>Escribe directamente las ecuaciones. Ejemplo: 2x + 3y - z = 5. Puedes omitir coeficientes igual a 1.</p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
