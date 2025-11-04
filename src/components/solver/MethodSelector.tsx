import React from 'react';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icons } from '../../icons';
import type { SolverMethod } from '../../types';
import { SOLVER_METHODS, SOLVER_DEFAULTS } from '../../utils/constants';

interface MethodSelectorProps {
  method: SolverMethod;
  tolerance: number;
  maxIterations: number;
  onMethodChange: (method: SolverMethod) => void;
  onToleranceChange: (tolerance: number) => void;
  onMaxIterationsChange: (maxIterations: number) => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  method,
  tolerance,
  maxIterations,
  onMethodChange,
  onToleranceChange,
  onMaxIterationsChange,
}) => {
  const methodInfo = {
    jacobi: {
      description: 'Actualiza todas las variables simultáneamente usando los valores de la iteración anterior.',
      pros: ['Simple de implementar', 'Fácil de paralelizar'],
      cons: ['Puede ser más lento que Gauss-Seidel'],
      complexity: 'O(n² × k)',
    },
    'gauss-seidel': {
      description: 'Actualiza cada variable usando los valores más recientes disponibles.',
      pros: ['Generalmente converge más rápido', 'Usa menos memoria'],
      cons: ['No es paralelizable'],
      complexity: 'O(n² × k)',
    },
  };

  const currentInfo = methodInfo[method];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-6">
        Configuración del Método
      </h3>

      <div className="space-y-6">
        {/* Selector de Método */}
        <div>
          <Select
            label="Método Iterativo"
            value={method}
            onChange={(e) => onMethodChange(e.target.value as SolverMethod)}
            options={SOLVER_METHODS.map((m) => ({
              value: m.value,
              label: m.label,
            }))}
            fullWidth
          />

          {/* Información del método seleccionado */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-text-secondary mb-3">
              {currentInfo.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs font-medium text-text-primary mb-2">
                  Ventajas:
                </p>
                <ul className="space-y-1">
                  {currentInfo.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-green-600 flex items-start gap-1">
                      <Icons.Check size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium text-text-primary mb-2">
                  Desventajas:
                </p>
                <ul className="space-y-1">
                  {currentInfo.cons.map((con, i) => (
                    <li key={i} className="text-xs text-orange-600 flex items-start gap-1">
                      <Icons.AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Badge variant="info" size="sm">
              Complejidad: {currentInfo.complexity}
            </Badge>
          </div>
        </div>

        {/* Tolerancia */}
        <div>
          <Input
            type="number"
            label="Tolerancia"
            value={tolerance}
            onChange={(e) => onToleranceChange(parseFloat(e.target.value))}
            step="0.000001"
            min="0"
            helperText="Error mínimo aceptable para considerar convergencia"
            fullWidth
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[1e-3, 1e-6, 1e-9, 1e-12].map((tol) => (
              <button
                key={tol}
                onClick={() => onToleranceChange(tol)}
                className={`
                  px-3 py-1 text-xs rounded-full transition-all
                  ${
                    tolerance === tol
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }
                `}
              >
                {tol.toExponential(0)}
              </button>
            ))}
          </div>
        </div>

        {/* Máximo de Iteraciones */}
        <div>
          <Input
            type="number"
            label="Máximo de Iteraciones"
            value={maxIterations}
            onChange={(e) => onMaxIterationsChange(parseInt(e.target.value))}
            step="10"
            min="1"
            max="1000"
            helperText="Número máximo de iteraciones antes de detenerse"
            fullWidth
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[50, 100, 200, 500].map((max) => (
              <button
                key={max}
                onClick={() => onMaxIterationsChange(max)}
                className={`
                  px-3 py-1 text-xs rounded-full transition-all
                  ${
                    maxIterations === max
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }
                `}
              >
                {max}
              </button>
            ))}
          </div>
        </div>

        {/* Botón para restaurar valores por defecto */}
        <Button
          variant="ghost"
          size="sm"
          icon="RefreshCw"
          onClick={() => {
            onToleranceChange(SOLVER_DEFAULTS.TOLERANCE);
            onMaxIterationsChange(SOLVER_DEFAULTS.MAX_ITERATIONS);
          }}
          fullWidth
        >
          Restaurar valores por defecto
        </Button>
      </div>
    </Card>
  );
};