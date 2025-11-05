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

  // ==================== VISTA MATRICIAL (TU DISEÑO ACTUAL) ====================
  const renderMatricialView = () => {
    const baseCellStyle = `
      w-24 h-14 text-2xl text-center rounded-lg  
      border border-gray-300 bg-gray-100 
      input-focus 
      ${hideSpinners}
    `;

    return (
      <div className="flex justify-center items-center gap-6 p-4">
        {/* Matriz A */}
        <div className="p-3">
          <div className="flex flex-col gap-3">
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-3">
                {row.map((cell, j) => (
                  <div key={j} className="relative">
                    <input
                      type="number"
                      step="any"
                      value={cell === 0 ? '' : cell}
                      onChange={(e) => handleCellInput(i, j, e.target.value)}
                      placeholder="0"
                      aria-label={`Coeficiente A fila ${i + 1} columna ${j + 1}`}
                      className={`${baseCellStyle} ${i === j ? 'text-primary' : ''
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
        <div className="w-1 h-24 bg-primary rounded-full"></div>

        {/* Vector b */}
        <div className="p-3">
          <div className="flex flex-col gap-3">
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
    );
  };

  // ==================== VISTA COEFICIENTES ====================
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

  // ==================== VISTA ECUACIÓN DIRECTA ====================
  const renderEcuacionView = () => (
    <div className="flex justify-center items-center p-4">
      <div className="space-y-4 w-full max-w-3xl">
        {matrix.map((row, i) => (
          <div key={i} className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {row.map((coeff, j) => (
                <React.Fragment key={j}>
                  {/* Mostrar signo solo si no es el primero */}
                  {j > 0 && (
                    <span
                      className={`text-2xl font-bold mx-2 ${coeff >= 0 ? 'text-primary' : 'text-red-500'
                        }`}
                    >
                      {coeff >= 0 ? '+' : '−'}
                    </span>
                  )}

                  <input
                    type="number"
                    step="any"
                    value={coeff === 0 ? '' : Math.abs(coeff)}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      // Si es el primer término o era positivo, mantener el signo actual
                      // Si era negativo, mantenerlo negativo
                      const finalValue = (j > 0 && coeff < 0) ? -Math.abs(value) : Math.abs(value);
                      handleCellInput(i, j, finalValue.toString());
                    }}
                    placeholder="0"
                    className={`
                    w-16 h-12 text-xl text-center rounded-lg border-2 transition-all
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                    ${hideSpinners}
                    ${coeff !== 0
                        ? 'border-primary bg-primary/5 font-bold'
                        : 'border-gray-300 bg-white'
                      }
                  `}
                  />
                  <span className="text-xl font-semibold text-text-primary">
                    {getVariableName(j)}
                  </span>
                </React.Fragment>
              ))}

              <span className="text-2xl text-text-secondary mx-3 font-bold">=</span>

              <input
                type="number"
                step="any"
                value={vector[i] === 0 ? '' : vector[i]}
                onChange={(e) => handleVectorInput(i, e.target.value)}
                placeholder="0"
                className={`w-20 h-12 text-xl text-center rounded-lg border-2 border-primary bg-primary/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold ${hideSpinners}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      {/* Controles y Título */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            Sistema de Ecuaciones
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {viewMode === 'matricial' && '📊 Vista Matricial'}
            {viewMode === 'coeficientes' && '🔢 Vista por Coeficientes'}
            {viewMode === 'ecuacion' && '✏️ Vista de Ecuación Directa'}
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
        <Icons.Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-700">
          {viewMode === 'matricial' && (
            <>
              <p className="font-medium mb-1">Vista Matricial - Formato tradicional</p>
              <p className="text-xs">Los valores de la diagonal (marcados con 'd') deben ser dominantes para mejor convergencia.</p>
            </>
          )}
          {viewMode === 'coeficientes' && (
            <>
              <p className="font-medium mb-1">Vista por Coeficientes - Ecuación por fila</p>
              <p className="text-xs">Ingresa cada coeficiente seguido de su variable. El último valor es el resultado.</p>
            </>
          )}
          {viewMode === 'ecuacion' && (
            <>
              <p className="font-medium mb-1">Vista de Ecuación Directa - Formato natural</p>
              <p className="text-xs">Los signos se ajustan automáticamente. Formato: 2x + 3y - z = 5</p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};