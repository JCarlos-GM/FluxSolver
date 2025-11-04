import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Icons } from '../../icons';
import type { SolverResult } from '../../types';
import { formatNumber, formatExecutionTime } from '../../utils/formatters';

interface ResultDisplayProps {
  result: SolverResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          Solución del Sistema
        </h3>
        <Badge variant={result.converged ? 'success' : 'error'}>
          {result.converged ? 'Convergió' : 'No convergió'}
        </Badge>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Target className="text-blue-500" size={16} />
            <span className="text-xs text-blue-600 font-medium">Iteraciones</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {result.iterationCount}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icons.TrendingUp className="text-green-500" size={16} />
            <span className="text-xs text-green-600 font-medium">Error Final</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {result.finalError.toExponential(2)}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Zap className="text-purple-500" size={16} />
            <span className="text-xs text-purple-600 font-medium">Método</span>
          </div>
          <p className="text-lg font-bold text-purple-700 capitalize">
            {result.method === 'jacobi' ? 'Jacobi' : 'Gauss-Seidel'}
          </p>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icons.Clock className="text-orange-500" size={16} />
            <span className="text-xs text-orange-600 font-medium">Tiempo</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {formatExecutionTime(result.executionTime)}
          </p>
        </div>
      </div>

      {/* Vector solución */}
      <div className="space-y-4">
        <h4 className="font-semibold text-text-primary flex items-center gap-2">
          <Icons.CheckCircle className="text-green-500" size={20} />
          Vector Solución
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.solution.map((value, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/20"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-white font-bold">
                x<sub>{i + 1}</sub>
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Variable {i + 1}</p>
                <p className="text-lg font-bold text-text-primary">
                  {formatNumber(value, 6)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advertencia si no convergió */}
      {!result.converged && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-red-800 mb-1">
                El método no convergió
              </p>
              <p className="text-sm text-red-600">
                Se alcanzó el número máximo de iteraciones sin lograr la tolerancia deseada.
                La solución mostrada es una aproximación que puede no ser precisa.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};