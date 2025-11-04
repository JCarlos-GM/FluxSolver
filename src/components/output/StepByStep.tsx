import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';  // ✅ AGREGADO
import { Icons } from '../../icons';
import type { Matrix, Vector, Iteration, SolverMethod } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface StepByStepProps {
  matrix: Matrix;
  vector: Vector;
  iterations: Iteration[];
  method: SolverMethod;
}

export const StepByStep: React.FC<StepByStepProps> = ({
  matrix,
  vector,
  iterations,
  method,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const maxSteps = Math.min(iterations.length, 10); // Limitar a 10 pasos

  React.useEffect(() => {
    if (autoPlay && currentStep < maxSteps - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (autoPlay && currentStep >= maxSteps - 1) {
      setAutoPlay(false);
    }
  }, [autoPlay, currentStep, maxSteps]);

  const currentIteration = iterations[currentStep];

  const generateStepExplanation = (k: number): string[] => {
    if (k === 0) {
      return [
        'Comenzamos con el vector inicial x⁽⁰⁾ = [0, 0, ...]',
        'Aplicaremos las fórmulas del método iterativo a cada componente',
      ];
    }

    const n = matrix.length;
    const explanations: string[] = [];

    if (method === 'jacobi') {
      explanations.push(`Iteración ${k}: Método de Jacobi`);
      explanations.push(
        'En Jacobi, todas las variables se actualizan simultáneamente usando los valores de la iteración anterior.'
      );

      for (let i = 0; i < n; i++) {
        let formula = `x${i + 1}⁽${k}⁾ = (${formatNumber(vector[i], 2)}`;

        for (let j = 0; j < n; j++) {
          if (i !== j && matrix[i][j] !== 0) {
            formula += ` - ${formatNumber(matrix[i][j], 2)} × x${j + 1}⁽${k - 1}⁾`;
          }
        }

        formula += `) / ${formatNumber(matrix[i][i], 2)}`;
        explanations.push(formula);
      }
    } else {
      explanations.push(`Iteración ${k}: Método de Gauss-Seidel`);
      explanations.push(
        'En Gauss-Seidel, cada variable se actualiza usando los valores más recientes disponibles.'
      );

      for (let i = 0; i < n; i++) {
        let formula = `x${i + 1}⁽${k}⁾ = (${formatNumber(vector[i], 2)}`;

        for (let j = 0; j < n; j++) {
          if (i !== j && matrix[i][j] !== 0) {
            const superscript = j < i ? k : k - 1;
            formula += ` - ${formatNumber(matrix[i][j], 2)} × x${j + 1}⁽${superscript}⁾`;
          }
        }

        formula += `) / ${formatNumber(matrix[i][i], 2)}`;
        explanations.push(formula);
      }
    }

    return explanations;
  };

  const stepExplanations = generateStepExplanation(currentStep);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          Procedimiento Paso a Paso
        </h3>
        <Badge variant="info">
          Paso {currentStep + 1} de {maxSteps}
        </Badge>
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          icon="ArrowLeft"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={autoPlay ? 'Pause' : 'Play'}
            onClick={() => setAutoPlay(!autoPlay)}
          >
            {autoPlay ? 'Pausar' : 'Auto Play'}
          </Button>

          <div className="w-48 mx-4">
            <input
              type="range"
              min="0"
              max={maxSteps - 1}
              value={currentStep}
              onChange={(e) => setCurrentStep(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon="ArrowRight"
          onClick={() => setCurrentStep(Math.min(maxSteps - 1, currentStep + 1))}
          disabled={currentStep === maxSteps - 1}
        >
          Siguiente
        </Button>
      </div>

      {/* Explicación del paso */}
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Icons.BookOpen className="text-blue-500 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-3">
                Explicación del Paso {currentStep + 1}
              </h4>
              <div className="space-y-2">
                {stepExplanations.map((explanation, i) => (
                  <p
                    key={i}
                    className={`text-sm ${
                      i === 0 ? 'font-medium text-blue-900' : 'text-blue-700 font-mono'
                    }`}
                  >
                    {explanation}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vector en este paso */}
        {currentIteration && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Icons.CheckCircle className="text-green-500" size={20} />
              Vector x⁽{currentStep}⁾
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentIteration.x.map((value, i) => (
                <div key={i} className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-text-secondary mb-1">
                    x<sub>{i + 1}</sub>
                  </p>
                  <p className="text-lg font-bold text-green-700 font-mono">
                    {formatNumber(value, 6)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-green-600 mb-1">Error</p>
                <p className="text-sm font-mono text-green-800">
                  {currentIteration.error.toExponential(2)}
                </p>
              </div>
              {currentIteration.relativeError && (
                <div className="text-center">
                  <p className="text-xs text-green-600 mb-1">Error Relativo</p>
                  <p className="text-sm font-mono text-green-800">
                    {currentIteration.relativeError.toExponential(2)}
                  </p>
                </div>
              )}
              {currentIteration.residual && (
                <div className="text-center">
                  <p className="text-xs text-green-600 mb-1">Residuo</p>
                  <p className="text-sm font-mono text-green-800">
                    {currentIteration.residual.toExponential(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Indicador de progreso */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Progreso</span>
          <span>
            {Math.round((currentStep / (maxSteps - 1)) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / (maxSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
};