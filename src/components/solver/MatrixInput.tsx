import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Icons } from '../../icons';

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
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellInput = (row: number, col: number, value: string) => {
    // Permitir input temporal (incluso vacío o con punto decimal)
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onCellChange(row, col, numValue);
    }
  };

  const handleVectorInput = (index: number, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onVectorChange(index, numValue);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          Sistema de Ecuaciones {size}×{size}
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

      <div className="overflow-x-auto">
        <div className="inline-flex gap-4 items-center min-w-full">
          {/* Matriz A */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-text-secondary mb-2 text-center">
              Matriz de Coeficientes (A)
            </div>
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((cell, j) => (
                  <div key={j} className="relative">
                    <input
                      type="number"
                      step="any"
                      value={cell || ''}
                      onChange={(e) => handleCellInput(i, j, e.target.value)}
                      onFocus={() => setFocusedCell({ row: i, col: j })}
                      onBlur={() => setFocusedCell(null)}
                      placeholder="0"
                      className={`
                        w-20 h-12 text-center rounded-lg border-2 transition-all
                        focus:outline-none focus:ring-2 focus:ring-primary/20
                        ${
                          focusedCell?.row === i && focusedCell?.col === j
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 bg-white'
                        }
                        ${i === j ? 'font-semibold' : ''}
                      `}
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

          {/* Variables */}
          <div className="flex flex-col gap-2 justify-center">
            <div className="text-sm font-medium text-text-secondary mb-2 text-center opacity-0">
              x
            </div>
            {Array.from({ length: size }).map((_, i) => (
              <div
                key={i}
                className="h-12 flex items-center justify-center text-lg font-semibold text-text-primary"
              >
                x<sub>{i + 1}</sub>
              </div>
            ))}
          </div>

          {/* Símbolo igual */}
          <div className="flex flex-col gap-2 justify-center">
            <div className="text-sm font-medium text-text-secondary mb-2 text-center opacity-0">
              =
            </div>
            {Array.from({ length: size }).map((_, i) => (
              <div
                key={i}
                className="h-12 flex items-center justify-center text-2xl text-text-secondary"
              >
                =
              </div>
            ))}
          </div>

          {/* Vector b */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-text-secondary mb-2 text-center">
              Vector (b)
            </div>
            {vector.map((value, i) => (
              <div key={i}>
                <input
                  type="number"
                  step="any"
                  value={value || ''}
                  onChange={(e) => handleVectorInput(i, e.target.value)}
                  placeholder="0"
                  className="w-20 h-12 text-center rounded-lg border-2 border-gray-200 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ayuda visual */}
      <div className="mt-6 flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <Icons.Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Consejos para mejor convergencia:</p>
          <ul className="space-y-1 text-xs">
            <li>• Los valores de la diagonal (marcados con 'd') deben ser mayores que la suma de los otros valores de la fila</li>
            <li>• Evita valores muy grandes o muy pequeños</li>
            <li>• Usa el botón "Aleatorio" para generar un sistema con convergencia garantizada</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};