import React, { useState } from 'react';
import { Section } from '../components/layout/Section';
import { InputModeSelector } from '../components/input/InputModeSelector';
import { ManualInput } from '../components/input/ManualInput';
import { VoiceInput } from '../components/input/VoiceInput';
import { ImageInput } from '../components/input/ImageInput';
import { MethodSelector } from '../components/solver/MethodSelector';
import { SolveButton } from '../components/solver/SolveButton';
import { ResultDisplay } from '../components/output/ResultDisplay';
import { IterationTable } from '../components/output/IterationTable';
import { StepByStep } from '../components/output/StepByStep';
import { ConvergenceChart } from '../components/output/ConvergenceChart';
import { Summary } from '../components/output/Summary';
import { useSolverContext } from '../context/SolverContext';
import type { InputMode } from '../types';
import { Icons } from '../icons';

export const Solver: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('manual');

  const {
    matrix,
    vector,
    size,
    setSize,
    updateCell,
    updateVectorCell,
    clearMatrix,
    fillRandom,
    getSystem,
    validation,
    isValid,
    config,
    updateConfig,
    solveSystem,
    result,
    isLoading,
    error: solverError,
    addToHistory,
  } = useSolverContext();

  const handleSolve = async () => {
    const system = getSystem();
    await solveSystem(system.A, system.b);
  };

  const handleVoiceTranscript = (transcript: string) => {
    console.log('Voice transcript:', transcript);
    // TODO: Implementar parser de voz a ecuaciones
  };

  const handleVoiceParse = (transcript: string) => {
    console.log('Parsing transcript:', transcript);
    // TODO: Implementar conversión de texto a matriz
  };

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file);
    // TODO: Implementar OCR con Tesseract.js
  };

  const handleSaveToHistory = () => {
    if (result) {
      addToHistory({
        system: {
          A: matrix,
          b: vector,
        },
        method: config.method,
        result: {
          solution: result.solution,
          iterations: result.iterationCount,
          converged: result.converged,
        },
        config: {
          tolerance: config.tolerance,
          maxIterations: config.maxIterations,
        },
      });
    }
  };

  const handleExportPDF = () => {
    console.log('Exporting to PDF...');
    // TODO: Implementar exportación con jsPDF
  };

  return (
    <>
      {/* Solver Input Section */}
      <Section id="solver" padding="xl" className="pt-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Calculadora de Sistemas Lineales
          </h2>
          <p className="text-xl text-text-secondary">
            Elige tu método de entrada preferido
          </p>
        </div>

        <InputModeSelector activeMode={inputMode} onModeChange={setInputMode} />

        <div className="mt-12">
          {inputMode === 'manual' && (
            <ManualInput
              matrix={matrix}
              vector={vector}
              size={size}
              onCellChange={updateCell}
              onVectorChange={updateVectorCell}
              onSizeChange={setSize}
              onClear={clearMatrix}
              onFillRandom={fillRandom}
            />
          )}

          {inputMode === 'voice' && (
            <VoiceInput
              onTranscriptChange={handleVoiceTranscript}
              onParse={handleVoiceParse}
            />
          )}

          {inputMode === 'image' && (
            <ImageInput onImageUpload={handleImageUpload} />
          )}
        </div>

        {/* Method Configuration */}
        {inputMode === 'manual' && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MethodSelector
                method={config.method}
                tolerance={config.tolerance}
                maxIterations={config.maxIterations}
                onMethodChange={(method) => updateConfig({ method })}
                onToleranceChange={(tolerance) => updateConfig({ tolerance })}
                onMaxIterationsChange={(maxIterations) =>
                  updateConfig({ maxIterations })
                }
              />
            </div>
            <div>
              <SolveButton
                onSolve={handleSolve}
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
                validationErrors={validation.errors}
                validationWarnings={validation.warnings}
              />
            </div>
          </div>
        )}

        {/* Solver Error */}
        {solverError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Icons.XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-800 mb-1">Error al resolver</p>
                <p className="text-sm text-red-600">{solverError}</p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Results Section */}
      {result && (
        <Section id="results" background="gray" padding="xl">
          <div className="space-y-8">
            {/* Summary */}
            <Summary
              result={result}
              matrix={matrix}
              vector={vector}
              onExportPDF={handleExportPDF}
              onSaveToHistory={handleSaveToHistory}
            />

            {/* Main Result */}
            <ResultDisplay result={result} />

            {/* Convergence Chart */}
            <ConvergenceChart iterations={result.iterations} />

            {/* Iteration Table */}
            <IterationTable iterations={result.iterations} />

            {/* Step by Step */}
            <StepByStep
              matrix={matrix}
              vector={vector}
              iterations={result.iterations}
              method={result.method}
            />
          </div>
        </Section>
      )}
    </>
  );
};