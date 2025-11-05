import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icons } from '../../icons';
import type { Iteration } from '../../types';
import { formatNumber, formatScientific } from '../../utils/formatters';

// 1. Importar nuestra función de exportación
import { exportToExcel } from '../../utils/excelExporter';

interface IterationTableProps {
  iterations: Iteration[];
  showAll?: boolean;
}

export const IterationTable: React.FC<IterationTableProps> = ({
  iterations,
  showAll = false,
}) => {
  const [expanded, setExpanded] = useState(showAll);
  const [selectedIteration, setSelectedIteration] = useState<number | null>(null);

  // 2. Estado de carga para el botón
  const [isExporting, setIsExporting] = useState(false);

  const displayedIterations = expanded ? iterations : iterations.slice(0, 5);
  const hasMore = iterations.length > 5;

  // 3. Handler para el botón de exportar a Excel (versión exceljs)
  const handleExcelExport = async () => {
    setIsExporting(true);

    const dataToExport = iterations.map(it => {
      const row: { [key: string]: any } = {
        'K': it.k,
      };
      it.x.forEach((value, index) => {
        row[`X${index + 1}`] = value;
      });
      row['Error Absoluto'] = it.error;
      row['Error Relativo'] = it.relativeError || null;
      row['Residuo'] = it.residual || null;
      return row;
    });

    try {
      // Usamos await porque exceljs es asíncrono
      await exportToExcel(
        dataToExport,
        'FluxSolver_Iteraciones',
        'Iteraciones'
      );
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            Tabla de Iteraciones
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Total de iteraciones: {iterations.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 4. Conectamos el botón al nuevo handler y estado de carga */}
          <Button
            variant="ghost"
            size="sm"
            icon={isExporting ? 'RefreshCw' : 'Download'}
            onClick={handleExcelExport}
            disabled={isExporting}
            className={isExporting ? 'animate-spin' : ''}
          >
            {isExporting ? 'Generando...' : 'Exportar Excel'}
          </Button>
        </div>
      </div>

      {/* Tabla responsive */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {/* --- MODIFICADO --- */}
              <th className="px-4 py-3 text-left text-base font-semibold text-text-primary">
                k
              </th>
              {iterations[0]?.x.map((_, i) => (
                <th
                  key={i}
                  // --- MODIFICADO ---
                  className="px-4 py-3 text-center text-base font-semibold text-text-primary"
                >
                  x<sub>{i + 1}</sub>
                </th>
              ))}
              {/* --- MODIFICADO --- */}
              <th className="px-4 py-3 text-center text-base font-semibold text-text-primary">
                Error Absoluto
              </th>
              {/* --- MODIFICADO --- */}
              <th className="px-4 py-3 text-center text-base font-semibold text-text-primary">
                Error Relativo
              </th>
              {/* --- MODIFICADO --- */}
              <th className="px-4 py-3 text-center text-base font-semibold text-text-primary">
                Residuo
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedIterations.map((iteration, idx) => (
              <tr
                key={iteration.k}
                onClick={() =>
                  setSelectedIteration(
                    selectedIteration === iteration.k ? null : iteration.k
                  )
                }
                className={`
                  border-b border-gray-100 transition-colors cursor-pointer
                  ${selectedIteration === iteration.k ? 'bg-primary/5' : 'hover:bg-gray-50'}
                  ${idx === displayedIterations.length - 1 ? 'bg-green-50' : ''}
                `}
              >
                {/* --- MODIFICADO --- */}
                <td className="px-4 py-3 text-base font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    {iteration.k}
                    {idx === displayedIterations.length - 1 && (
                      <Badge variant="success" size="sm">
                        Final
                      </Badge>
                    )}
                  </div>
                </td>
                {iteration.x.map((value, i) => (
                  <td
                    key={i}
                    // --- MODIFICADO ---
                    className="px-4 py-3 text-center text-base text-text-primary font-mono"
                  >
                    {formatNumber(value, 6)}
                  </td>
                ))}
                {/* --- MODIFICADO --- */}
                <td className="px-4 py-3 text-center text-base font-mono">
                  <span
                    // --- MODIFICADO --- (el 'text-base' se hereda, pero lo ponemos en el span para asegurar)
                    className={`
                      inline-flex items-center px-2 py-1 rounded text-base
                      ${
                        iteration.error < 1e-6
                          ? 'bg-green-100 text-green-700'
                          : iteration.error < 1e-3
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }
                    `}
                  >
                    {formatScientific(iteration.error)}
                  </span>
                </td>
                {/* --- MODIFICADO --- */}
                <td className="px-4 py-3 text-center text-base font-mono text-text-secondary">
                  {iteration.relativeError
                    ? formatScientific(iteration.relativeError)
                    : '-'}
                </td>
                {/* --- MODIFICADO --- */}
                <td className="px-4 py-3 text-center text-base font-mono text-text-secondary">
                  {iteration.residual ? formatScientific(iteration.residual) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para expandir/colapsar */}
      {hasMore && !showAll && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            icon="ChevronDown"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            {expanded
              ? 'Mostrar menos'
              : `Mostrar todas (${iterations.length - 5} más)`}
          </Button>
        </div>
      )}

      {/* Detalles de iteración seleccionada */}
      {selectedIteration !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Icons.Info className="text-blue-500" size={20} />
            <h4 className="font-semibold text-blue-800">
              Detalles de Iteración {selectedIteration}
            </h4>
          </div>
          {(() => {
            const iteration = iterations.find((it) => it.k === selectedIteration);
            if (!iteration) return null;

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-blue-600 mb-1">Error Absoluto</p>
                  <p className="text-sm font-mono text-blue-800">
                    {formatScientific(iteration.error)}
                  </p>
                </div>
                {iteration.relativeError && (
                  <div>
                    <p className="text-xs text-blue-600 mb-1">Error Relativo</p>
                    <p className="text-sm font-mono text-blue-800">
                      {formatScientific(iteration.relativeError)}
                    </p>
                  </div>
                )}
                {iteration.residual && (
                  <div>
                    <p className="text-xs text-blue-600 mb-1">Residuo</p>
                    <p className="text-sm font-mono text-blue-800">
                      {formatScientific(iteration.residual)}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </Card>
  );
};