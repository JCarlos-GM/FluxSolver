import React from 'react';
import { MATRIX_SIZES } from '../../utils/constants';
import { Icons } from '../../icons';

interface SizeSelectorProps {
  size: number;
  onSizeChange: (size: number) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  size,
  onSizeChange,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200">
      <div className="flex items-center gap-2 text-text-primary">
        <Icons.Grid3x3 size={20} />
        <span className="font-medium">Tamaño de la matriz:</span>
      </div>

      <div className="flex gap-2">
        {MATRIX_SIZES.map((matrixSize) => (
          <button
            key={matrixSize.value}
            onClick={() => onSizeChange(matrixSize.value)}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all
              ${
                size === matrixSize.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }
            `}
          >
            {matrixSize.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 text-sm text-text-secondary">
        <Icons.Info size={16} />
        <span>
          {size === 2 && 'Solución gráfica 2D disponible'}
          {size === 3 && 'Solución gráfica 3D disponible'}
          {size > 3 && 'Solo tabla de iteraciones'}
        </span>
      </div>
    </div>
  );
};