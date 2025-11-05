import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icons } from '../../icons';
import type { Matrix, Vector, Iteration, SolverMethod } from '../../types';
import { formatNumber } from '../../utils/formatters';

// 1. Importar el componente de KaTeX y su CSS
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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

  const maxSteps = Math.min(iterations.length, 10);

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

  // --- MODIFICADO ---
  // 2. Ahora, esta función genera *todo* como strings de LaTeX
  const generateStepExplanation = (k: number): string[] => {
    // \text{} se usa para poner texto normal dentro de un bloque de LaTeX
    if (k === 0) {
      return [
        '\\text{Comenzamos con el vector inicial.}',
        'x^{(0)} = [0, 0, ...]',
      ];
    }

    const n = matrix.length;
    const explanations: string[] = [];

    if (method === 'jacobi') {
      // Título y descripción ahora son LaTeX
      explanations.push(`\\text{Iteración ${k}: Método de Jacobi}`);
      explanations.push(
        `\\text{Usamos los valores de la iteración anterior, } x^{(k-1)}, \\text{ para calcular todos los nuevos valores de } x^{(k)}.`
      );

      for (let i = 0; i < n; i++) {
        let numerator = `${formatNumber(vector[i], 2)}`;
        for (let j = 0; j < n; j++) {
          if (i !== j && matrix[i][j] !== 0) {
            const coeff = matrix[i][j];
            const sign = coeff < 0 ? '+' : '-';
            const val = Math.abs(coeff);
            numerator += ` ${sign} ${formatNumber(val, 2)} \\cdot x_{${j + 1}}^{( ${k - 1} )}`;
          }
        }
        const denominator = `${formatNumber(matrix[i][i], 2)}`;
        const latexFormula = `x_{${i + 1}}^{(${k})} = \\frac{${numerator}}{${denominator}}`;
        explanations.push(latexFormula);
      }
    } else {
      // Título y descripción ahora son LaTeX
      explanations.push(`\\text{Iteración ${k}: Método de Gauss-Seidel}`);
      explanations.push(
        `\\text{Usamos los valores más recientes. Para } x_{i}^{(k)}, \\text{usamos los } x_{j<i}^{(k)} \\text{ que ya calculamos y los } x_{j>i}^{(k-1)} \\text{ restantes.}`
      );

      for (let i = 0; i < n; i++) {
        let numerator = `${formatNumber(vector[i], 2)}`;
        for (let j = 0; j < n; j++) {
          if (i !== j && matrix[i][j] !== 0) {
            const coeff = matrix[i][j];
            const sign = coeff < 0 ? '+' : '-';
            const val = Math.abs(coeff);
            const superscript = j < i ? k : k - 1;
            numerator += ` ${sign} ${formatNumber(val, 2)} \\cdot x_{${j + 1}}^{( ${superscript} )}`;
          }
        }
        const denominator = `${formatNumber(matrix[i][i], 2)}`;
        const latexFormula = `x_{${i + 1}}^{(${k})} = \\frac{${numerator}}{${denominator}}`;
        explanations.push(latexFormula);
      }
    }

    return explanations;
  };

  const stepExplanations = generateStepExplanation(currentStep);

  return (
    <Card className="p-6">
      {/* ... (Controles no cambian) ... */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          Procedimiento Paso a Paso
        </h3>
        <Badge variant="info">
          Paso {currentStep + 1} de {maxSteps}
        </Badge>
      </div>
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

      {/* --- MODIFICADO --- */}
      {/* 3. Renderizamos *todo* con BlockMath y ajustamos tamaños */}
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Icons.BookOpen className="text-blue-500 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-3">
                Explicación del Paso {currentStep + 1}
              </h4>
              <div className="space-y-4">
                {stepExplanations.map((explanation, i) => {
                  return (
                    <div
                      key={i}
                      // i === 0: Título (ej. "Iteración 1...")
                      // i === 1: Descripción (ej. "Usamos los valores...")
                      // i > 1: Fórmulas
                      // Aplicamos el 'text-xl' a las fórmulas, y tamaños más pequeños al resto.
                      className={`
                        ${i > 1 ? 'text-xl' : (i === 0 ? 'text-lg font-medium' : 'text-base')}
                        text-blue-900 overflow-x-auto
                      `}
                    >
                      <BlockMath math={explanation} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ... (Tarjeta de Vector no cambia) ... */}
        {currentIteration && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Icons.CheckCircle className="text-green-500" size={20} />
              {/* Usamos KaTeX aquí también para el superíndice */}
              <BlockMath math={`\\text{Vector } x^{(${currentStep})}`} />
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

      {/* ... (Progreso no cambia) ... */}
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