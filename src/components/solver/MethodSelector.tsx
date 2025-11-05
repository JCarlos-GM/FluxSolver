import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icons } from '../../icons';
import type { SolverMethod } from '../../types';
import { SOLVER_METHODS, SOLVER_DEFAULTS } from '../../utils/constants';

type InputViewMode = 'matricial' | 'coeficientes' | 'ecuacion';

interface MethodSelectorProps {
  method: SolverMethod;
  tolerance: number;
  maxIterations: number;
  viewMode?: InputViewMode; // ✅ Prop del padre
  onMethodChange: (method: SolverMethod) => void;
  onToleranceChange: (tolerance: number) => void;
  onMaxIterationsChange: (maxIterations: number) => void;
  onViewModeChange?: (mode: InputViewMode) => void; // ✅ Callback para cambiar vista
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  method,
  tolerance,
  maxIterations,
  viewMode = 'matricial', // ✅ Valor por defecto
  onMethodChange,
  onToleranceChange,
  onMaxIterationsChange,
  onViewModeChange,
}) => {
  // ❌ ELIMINADO: const [viewMode, setViewMode] = useState<InputViewMode>('matricial');
  const [showModal, setShowModal] = useState(false);

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

  const viewModeOptions = [
    { value: 'matricial', label: 'Matricial' },
    { value: 'coeficientes', label: 'Coeficientes' },
    { value: 'ecuacion', label: 'Ecuación Directa' },
  ];

  return (
    <>
      {/* Barra de controles compacta */}
      <div className="flex gap-3 items-stretch">
        {/* Selector de vista */}
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange?.(e.target.value as InputViewMode)}
          className="flex-1 px-4 py-3 text-base font-medium border-2 border-gray-300 rounded-lg bg-white hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
        >
          {viewModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Selector de método */}
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value as SolverMethod)}
          className="flex-1 px-4 py-3 text-base font-medium border-2 border-gray-300 rounded-lg bg-white hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
        >
          {SOLVER_METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Botón de configuración avanzada */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-primary transition-all"
          title="Configuración avanzada"
        >
          <Icons.Settings size={20} className="text-text-secondary" />
        </button>
      </div>

      {/* Modal de configuración avanzada */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
                <Icons.Settings size={24} className="text-primary" />
                Configuración Avanzada
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icons.X size={24} className="text-text-secondary" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Información del método seleccionado */}
              <div>
                <h4 className="text-lg font-semibold text-text-primary mb-3">
                  Método: {SOLVER_METHODS.find((m) => m.value === method)?.label}
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-base text-text-secondary mb-3">
                    {currentInfo.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-text-primary mb-2">
                        Ventajas:
                      </p>
                      <ul className="space-y-1">
                        {currentInfo.pros.map((pro, i) => (
                          <li
                            key={i}
                            className="text-sm text-green-600 flex items-start gap-1"
                          >
                            <Icons.Check size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-text-primary mb-2">
                        Desventajas:
                      </p>
                      <ul className="space-y-1">
                        {currentInfo.cons.map((con, i) => (
                          <li
                            key={i}
                            className="text-sm text-orange-600 flex items-start gap-1"
                          >
                            <Icons.AlertCircle
                              size={14}
                              className="mt-0.5 flex-shrink-0"
                            />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

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
                <div className="mt-3 flex flex-wrap gap-2">
                  {[1e-3, 1e-6, 1e-9, 1e-12].map((tol) => (
                    <button
                      key={tol}
                      onClick={() => onToleranceChange(tol)}
                      className={`
                        px-4 py-2 text-sm rounded-lg font-medium transition-all
                        ${
                          tolerance === tol
                            ? 'bg-primary text-white shadow-sm'
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
                  onChange={(e) =>
                    onMaxIterationsChange(parseInt(e.target.value))
                  }
                  step="10"
                  min="1"
                  max="1000"
                  helperText="Número máximo de iteraciones antes de detenerse"
                  fullWidth
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {[50, 100, 200, 500].map((max) => (
                    <button
                      key={max}
                      onClick={() => onMaxIterationsChange(max)}
                      className={`
                        px-4 py-2 text-sm rounded-lg font-medium transition-all
                        ${
                          maxIterations === max
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                        }
                      `}
                    >
                      {max}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3 flex gap-3">
              <button
                onClick={() => {
                  onToleranceChange(SOLVER_DEFAULTS.TOLERANCE);
                  onMaxIterationsChange(SOLVER_DEFAULTS.MAX_ITERATIONS);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-text-secondary bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Icons.RefreshCw size={16} />
                Restaurar valores por defecto
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all"
              >
                Guardar y Cerrar
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};