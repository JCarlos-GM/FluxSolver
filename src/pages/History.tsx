import React, { useState } from 'react';
import { Section } from '../components/layout/Section';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Icons } from '../icons';
import { useSolverContext } from '../context/SolverContext';
import { HistoryItem } from '../types';
import { formatDate, formatVector } from '../utils/formatters';

export const History: React.FC = () => {
  const { history, removeFromHistory, clearHistory, setSystem, updateConfig } =
    useSolverContext();

  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [filterMethod, setFilterMethod] = useState<'all' | 'jacobi' | 'gauss-seidel'>(
    'all'
  );

  const filteredHistory =
    filterMethod === 'all'
      ? history
      : history.filter((item) => item.method === filterMethod);

  const handleLoadSystem = (item: HistoryItem) => {
    setSystem(item.system.A, item.system.b);
    updateConfig({
      method: item.method,
      tolerance: item.config.tolerance,
      maxIterations: item.config.maxIterations,
    });

    // Scroll al solver
    document.getElementById('solver')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este elemento del historial?')) {
      removeFromHistory(id);
    }
  };

  const handleClearAll = () => {
    clearHistory();
    setShowClearModal(false);
  };

  if (history.length === 0) {
    return (
      <Section id="history" padding="xl" className="pt-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.History className="text-gray-400" size={64} />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            No hay historial aún
          </h2>
          <p className="text-text-secondary mb-8">
            Resuelve tu primer sistema de ecuaciones para comenzar a construir tu
            historial de resoluciones.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon="Play"
            onClick={() => {
              document.getElementById('solver')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            Ir al Solver
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section id="history" padding="xl" className="pt-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-text-primary mb-2">
            Historial de Resoluciones
          </h2>
          <p className="text-text-secondary">
            Total de {filteredHistory.length} resoluciones guardadas
          </p>
        </div>

        <Button
          variant="danger"
          icon="Trash2"
          onClick={() => setShowClearModal(true)}
        >
          Limpiar Historial
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-8">
        <Button
          variant={filterMethod === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilterMethod('all')}
        >
          Todos ({history.length})
        </Button>
        <Button
          variant={filterMethod === 'jacobi' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilterMethod('jacobi')}
        >
          Jacobi ({history.filter((h) => h.method === 'jacobi').length})
        </Button>
        <Button
          variant={filterMethod === 'gauss-seidel' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilterMethod('gauss-seidel')}
        >
          Gauss-Seidel ({history.filter((h) => h.method === 'gauss-seidel').length})
        </Button>
      </div>

      {/* Lista de historial */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <Card
            key={item.id}
            className="p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge
                  variant={item.result.converged ? 'success' : 'error'}
                  size="sm"
                >
                  {item.result.converged ? 'Convergió' : 'No convergió'}
                </Badge>
                <p className="text-xs text-text-secondary mt-2">
                  {formatDate(item.timestamp)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icons.Trash2 className="text-red-500" size={18} />
              </button>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Método:</span>
                <span className="font-semibold capitalize">
                  {item.method === 'jacobi' ? 'Jacobi' : 'Gauss-Seidel'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Dimensión:</span>
                <span className="font-semibold">
                  {item.system.A.length}×{item.system.A.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Iteraciones:</span>
                <span className="font-semibold">{item.result.iterations}</span>
              </div>
            </div>

            {/* Solución preview */}
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-xs text-text-secondary mb-1">Solución:</p>
              <p className="text-xs font-mono text-text-primary truncate">
                {formatVector(item.result.solution, 3)}
              </p>
            </div>

            {/* Acciones */}
            <Button
              variant="primary"
              size="sm"
              icon="Play"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSystem(item);
              }}
            >
              Cargar Sistema
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Detalles de la Resolución"
          size="lg"
        >
          <div className="space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary mb-1">Fecha:</p>
                <p className="font-semibold">{formatDate(selectedItem.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Método:</p>
                <p className="font-semibold capitalize">
                  {selectedItem.method === 'jacobi' ? 'Jacobi' : 'Gauss-Seidel'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Estado:</p>
                <Badge variant={selectedItem.result.converged ? 'success' : 'error'}>
                  {selectedItem.result.converged ? 'Convergió' : 'No convergió'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Iteraciones:</p>
                <p className="font-semibold">{selectedItem.result.iterations}</p>
              </div>
            </div>

            {/* Configuración */}
            <div>
              <h4 className="font-semibold text-text-primary mb-3">Configuración:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-text-secondary mb-1">Tolerancia:</p>
                  <p className="font-mono">
                    {selectedItem.config.tolerance.toExponential(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-text-secondary mb-1">Máx. Iteraciones:</p>
                  <p className="font-mono">{selectedItem.config.maxIterations}</p>
                </div>
              </div>
            </div>

            {/* Solución */}
            <div>
              <h4 className="font-semibold text-text-primary mb-3">Solución:</h4>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="font-mono text-text-primary">
                  x = {formatVector(selectedItem.result.solution, 6)}
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                icon="Play"
                onClick={() => {
                  handleLoadSystem(selectedItem);
                  setSelectedItem(null);
                }}
                fullWidth
              >
                Cargar Sistema
              </Button>
              <Button
                variant="danger"
                icon="Trash2"
                onClick={() => {
                  handleDelete(selectedItem.id);
                  setSelectedItem(null);
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmación para limpiar */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="¿Limpiar todo el historial?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Esta acción eliminará permanentemente todas las {history.length}{' '}
            resoluciones guardadas. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowClearModal(false)}
              fullWidth
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleClearAll} fullWidth>
              Sí, limpiar todo
            </Button>
          </div>
        </div>
      </Modal>
    </Section>
  );
};