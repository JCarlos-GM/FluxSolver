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
      {/* Botón de resolver - PRIMERO */}
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

      {/* Indicador de estado OK - DESPUÉS DEL BOTÓN */}
      {!hasErrors && !hasWarnings && !isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          <Icons.CheckCircle size={18} />
          <span className="font-medium">Sistema listo para resolver</span>
        </div>
      )}

      {/* Advertencias - DESPUÉS DEL BOTÓN */}
      {hasWarnings && !hasErrors && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-medium text-yellow-800 mb-2">
                ⚠️ Advertencias:
              </p>
              <ul className="space-y-1">
                {validationWarnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-700">
                    • {warning}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-yellow-600 mt-2">
                El método puede tardar más en converger o no converger.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Errores - DESPUÉS DEL BOTÓN */}
      {hasErrors && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-medium text-red-800 mb-2">
                No se puede resolver:
              </p>
              <ul className="space-y-1">
                {validationErrors.map((error, i) => (
                  <li key={i} className="text-x text-red-600 font-medium">
                    • {error}
                  </li>
                ))}
              </ul>
              <div className="mt-3 p-2 bg-red-100 rounded text-x text-red-700">
                <p className="font-medium mb-1">Soluciones:</p>
                <ul className="space-y-0.5">
                  <li>Asegúrate de llenar todos los valores</li>
                  <li>Verifica que la diagonal no tenga ceros</li>
                  <li>Usa el botón "Aleatorio" para generar un sistema válido</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};