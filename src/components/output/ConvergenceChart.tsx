import React from 'react';
import { Card } from '../common/Card';
import { Icons } from '../../icons';
import type { Iteration } from '../../types';

interface ConvergenceChartProps {
  iterations: Iteration[];
  title?: string;
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({
  iterations,
  title = 'Gráfica de Convergencia',
}) => {
  const maxError = Math.max(...iterations.map((it) => it.error));
  const minError = Math.min(...iterations.map((it) => it.error));

  // Normalizar errores para visualización
  const normalizeError = (error: number) => {
    if (maxError === minError) return 50;
    return ((error - minError) / (maxError - minError)) * 80 + 10;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Icons.TrendingUp size={16} />
          <span>Error vs Iteración</span>
        </div>
      </div>

      {/* Gráfica simple con SVG */}
      <div className="relative h-64 bg-gray-50 rounded-lg p-4">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Eje Y (Error) */}
          <line
            x1="40"
            y1="10"
            x2="40"
            y2="220"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          {/* Eje X (Iteraciones) */}
          <line
            x1="40"
            y1="220"
            x2="95%"
            y2="220"
            stroke="#94A3B8"
            strokeWidth="2"
          />

          {/* Línea de convergencia */}
          <polyline
            fill="none"
            stroke="#12957D"
            strokeWidth="3"
            points={iterations
              .map((it, i) => {
                const x = 50 + (i / (iterations.length - 1)) * 85 + '%';
                const y = 220 - normalizeError(it.error) * 2;
                return `${x},${y}`;
              })
              .join(' ')}
          />

          {/* Puntos en cada iteración */}
          {iterations.map((it, i) => {
            const x = 50 + (i / (iterations.length - 1)) * 85;
            const y = 220 - normalizeError(it.error) * 2;
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={y}
                  r="4"
                  fill="#12957D"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>
                    Iteración {it.k}: {it.error.toExponential(2)}
                  </title>
                </circle>
              </g>
            );
          })}

          {/* Etiquetas */}
          <text x="10" y="15" fontSize="12" fill="#64748B">
            Error
          </text>
          <text x="95%" y="235" fontSize="12" fill="#64748B" textAnchor="end">
            Iteración
          </text>
        </svg>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span className="text-text-secondary">Error absoluto</span>
          </div>
        </div>
        <div className="text-text-secondary">
          {iterations.length} iteraciones
        </div>
      </div>
    </Card>
  );
};