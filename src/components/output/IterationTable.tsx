import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icons } from '../../icons';
import type { Iteration } from '../../types';
import { formatNumber, formatScientific } from '../../utils/formatters';

// --- AÑADIDO ---
// 1. Importar nuestra nueva función de exportación
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

  // --- AÑADIDO ---
  // 2. Estado de carga para el botón
  const [isExporting, setIsExporting] = useState(false);

  const displayedIterations = expanded ? iterations : iterations.slice(0, 5);
  const hasMore = iterations.length > 5;

  // --- AÑADIDO ---
  // 3. Handler para el botón de exportar a Excel
  const handleExcelExport = () => {
    setIsExporting(true);

    // 3a. Transformar los datos para el Excel
    // Queremos un array de objetos "plano"
    const dataToExport = iterations.map(it => {
      // Creamos un objeto base
      const row: { [key: string]: any } = {
        'K': it.k,
      };

      // 3b. Añadimos las variables X (x1, x2, ...) dinámicamente
      it.x.forEach((value, index) => {
        row[`X${index + 1}`] = value; // Exportamos el NÚMERO crudo
      });

      // 3c. Añadimos el resto de las columnas
      row['Error Absoluto'] = it.error;
      row['Error Relativo'] = it.relativeError || null; // Usamos null si no existe
      row['Residuo'] = it.residual || null;

      return row;
    });

    // 3d. Llamar a nuestra función exportadora
    try {
      exportToExcel(
        dataToExport,
        'FluxSolver_Iteraciones',
        'Iteraciones'
      );
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      // Aquí podrías mostrar una notificación de error al usuario
    } finally {
      setIsExporting(false);
    }
  };

  return (
    // Ya no necesitamos el ID para 'html2canvas'
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
          {/* --- MODIFICADO --- */}
          {/* 4. Conectamos el botón al nuevo handler y estado de carga */}
          <Button
            variant="ghost"
            size="sm"
            icon={isExporting ? 'RefreshCw' : 'Download'}
            onClick={handleExcelExport} // <-- Nueva función
            disabled={isExporting}
          >
            {isExporting ? 'Generando...' : 'Exportar Excel'}
          </Button>
        </div>
      </div>

      {/* Tabla responsive */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* ... (sin cambios en el resto de la tabla) ... */}
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                k
              </th>
              {iterations[0]?.x.map((_, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center text-sm font-semibold text-text-primary"
                >
                  x<sub>{i + 1}</sub>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
                Error Absoluto
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
                Error Relativo
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
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
                <td className="px-4 py-3 text-sm font-medium text-text-primary">
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
                    className="px-4 py-3 text-center text-sm text-text-primary font-mono"
                  >
                    {formatNumber(value, 6)}
                  </td>
                ))}
                <td className="px-4 py-3 text-center text-sm font-mono">
                  <span
                    className={`
                      inline-flex items-center px-2 py-1 rounded
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
                <td className="px-4 py-3 text-center text-sm font-mono text-text-secondary">
                  {iteration.relativeError
                    ? formatScientific(iteration.relativeError)
                    : '-'}
                </td>
                <td className="px-4 py-3 text-center text-sm font-mono text-text-secondary">
                  {iteration.residual ? formatScientific(iteration.residual) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ... (sin cambios en 'Mostrar todas' ni 'Detalles') ... */}
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