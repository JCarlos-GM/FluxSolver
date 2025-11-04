import React from 'react';
import { Button } from '../common/Button';
import { Icons } from '../../icons';

interface SolveButtonProps {
  onSolve: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  validationErrors?: string[];
  validationWarnings?: string[];
}

export const SolveButton: React.FC<SolveButtonProps> = ({
  onSolve,
  isLoading,
  isDisabled,
  validationErrors = [],
  validationWarnings = [],
}) => {
  const hasErrors = validationErrors.length > 0;
  const hasWarnings = validationWarnings.length > 0;

  return (
    <div className="space-y-4">
      {/* Errores */}
      {hasErrors && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-medium text-red-800 mb-2">
                No se puede resolver:
              </p>
              <ul className="space-y-1">
                {validationErrors.map((error, i) => (
                  <li key={i} className="text-sm text-red-600">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Advertencias */}
      {hasWarnings && !hasErrors && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-medium text-yellow-800 mb-2">
                Advertencias:
              </p>
              <ul className="space-y-1">
                {validationWarnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-600">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Botón de resolver */}
      <Button
        onClick={onSolve}
        disabled={isDisabled || hasErrors}
        isLoading={isLoading}
        icon="Play"
        size="lg"
        fullWidth
      >
        {isLoading ? 'Resolviendo...' : 'Resolver Sistema'}
      </Button>

      {/* Indicador de estado */}
      {!hasErrors && !isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
          <Icons.CheckCircle className="text-green-500" size={16} />
          <span>Sistema listo para resolver</span>
        </div>
      )}
    </div>
  );
};