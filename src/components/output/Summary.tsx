import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icons } from '../../icons';
import type { SolverResult, Matrix, Vector } from '../../types';
import { formatVector, formatExecutionTime } from '../../utils/formatters';

interface SummaryProps {
  result: SolverResult;
  matrix: Matrix;
  vector: Vector;
  onExportPDF?: () => void;
  onSaveToHistory?: () => void;
}

export const Summary: React.FC<SummaryProps> = ({
  result,
  matrix,
  vector,
  onExportPDF,
  onSaveToHistory,
}) => {
  const convergenceRate =
    result.iterations.length > 1
      ? result.iterations[result.iterations.length - 1].error /
        result.iterations[0].error
      : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Resumen de la Resolución
          </h3>
          <p className="text-text-secondary">
            Sistema {matrix.length}×{matrix.length} - Método de{' '}
            {result.method === 'jacobi' ? 'Jacobi' : 'Gauss-Seidel'}
          </p>
        </div>

        <div className="flex gap-2">
          {onSaveToHistory && (
            <Button variant="ghost" size="sm" icon="Save" onClick={onSaveToHistory}>
              Guardar
            </Button>
          )}
          {onExportPDF && (
            <Button variant="primary" size="sm" icon="Download" onClick={onExportPDF}>
              Exportar PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del sistema */}
        <div className="space-y-4">
          <h4 className="font-semibold text-text-primary flex items-center gap-2">
            <Icons.FileText size={20} />
            Información del Sistema
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Iteraciones:</span>
              <span className="font-semibold">{result.iterationCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Error final:</span>
              <span className="font-mono font-semibold">
                {result.finalError.toExponential(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Tiempo de ejecución:</span>
              <span className="font-semibold">
                {formatExecutionTime(result.executionTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Tasa de convergencia:</span>
              <span className="font-mono font-semibold">
                {convergenceRate.toExponential(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Solución */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-primary/20">
        <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Icons.Target size={20} className="text-primary" />
          Vector Solución
        </h4>
        <p className="font-mono text-text-primary">
          x = {formatVector(result.solution, 6)}
        </p>
      </div>

      {/* Nota adicional */}
      {result.converged ? (
        <div className="mt-6 flex items-start gap-2 p-4 bg-green-50 rounded-lg">
          <Icons.CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-green-700">
            El método convergió exitosamente en {result.iterationCount} iteraciones,
            alcanzando un error de {result.finalError.toExponential(2)}.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex items-start gap-2 p-4 bg-yellow-50 rounded-lg">
          <Icons.AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-yellow-700">
            El método no convergió después de {result.iterationCount} iteraciones.
            Considera aumentar el número máximo de iteraciones o verificar que la
            matriz sea diagonalmente dominante.
          </p>
        </div>
      )}
    </Card>
  );
};