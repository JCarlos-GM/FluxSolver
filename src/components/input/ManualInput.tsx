import React from 'react';
import { MatrixInput } from '../solver/MatrixInput';
import { SizeSelector } from '../solver/SizeSelector';

interface ManualInputProps {
  matrix: number[][];
  vector: number[];
  size: number;
  onCellChange: (row: number, col: number, value: number) => void;
  onVectorChange: (index: number, value: number) => void;
  onSizeChange: (size: number) => void;
  onClear: () => void;
  onFillRandom: () => void;
}

export const ManualInput: React.FC<ManualInputProps> = ({
  matrix,
  vector,
  size,
  onCellChange,
  onVectorChange,
  onSizeChange,
  onClear,
  onFillRandom,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-text-primary mb-2">
          Entrada Manual
        </h3>
        <p className="text-text-secondary">
          Ingresa los coeficientes de tu sistema de ecuaciones lineales
        </p>
      </div>

      <SizeSelector size={size} onSizeChange={onSizeChange} />

      <MatrixInput
        matrix={matrix}
        vector={vector}
        size={size}
        onCellChange={onCellChange}
        onVectorChange={onVectorChange}
        onClear={onClear}
        onFillRandom={onFillRandom}
      />
    </div>
  );
};