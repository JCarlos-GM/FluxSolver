import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '../types';

const STORAGE_KEY = 'fluxsolver_history';
const MAX_HISTORY_ITEMS = 50;

interface UseHistoryReturn {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getHistoryItem: (id: string) => HistoryItem | undefined;
  isLoading: boolean;
}

export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar historial del localStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir timestamps de string a Date
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(historyWithDates);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar historial en localStorage cuando cambia
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Error al guardar historial:', error);
      }
    }
  }, [history, isLoading]);

  // Agregar item al historial
  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setHistory(prev => {
      const updated = [newItem, ...prev];
      // Limitar tamaño del historial
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  // Eliminar item del historial
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  // Limpiar todo el historial
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Obtener un item específico
  const getHistoryItem = useCallback((id: string): HistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryItem,
    isLoading,
  };
};