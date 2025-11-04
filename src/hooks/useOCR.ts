import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

interface UseOCRReturn {
  extractText: (image: File | string) => Promise<string>;
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export const useOCR = (): UseOCRReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const extractText = useCallback(async (image: File | string): Promise<string> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await Tesseract.recognize(
        image,
        'eng+spa', // Inglés y español
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        }
      );

      setIsProcessing(false);
      return result.data.text;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar imagen';
      setError(errorMessage);
      setIsProcessing(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    extractText,
    isProcessing,
    progress,
    error,
  };
};