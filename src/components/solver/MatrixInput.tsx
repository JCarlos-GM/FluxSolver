import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icons } from '../../icons'; 

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
}

export const MatrixInput: React.FC<MatrixInputProps> = ({
  matrix,
  vector,
  size,
  onCellChange,
  onVectorChange,
  onClear,
  onFillRandom,
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

  // Estilo base para todas las celdas
  // CLAVES: text-2xl y sin font-bold/font-semibold
  const baseCellStyle = `
    w-24 h-14 text-2xl text-center rounded-lg  
    border border-gray-300 bg-gray-100 
    input-focus 
    ${hideSpinners}
  `;

  return (
    <Card className="p-6">
      
      {/* Controles y Título */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-text-primary">
          Sistema de Ecuaciones
        </h3>
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

      {/* Cuadrícula de Inputs */}
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
                      // Eliminada la clase font-semibold aquí
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
    </Card>
  );
};