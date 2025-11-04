import React, { useState, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icons } from '../../icons';
import { useOCR } from '../../hooks/useOCR';
import { parseEquationsFromText, detectSystemSize } from '../../utils/equationParser';

interface ImageInputProps {
  onImageUpload: (file: File) => void;
  onSystemDetected?: (A: number[][], b: number[]) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  onImageUpload,
  onSystemDetected,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [detectedSystem, setDetectedSystem] = useState<{ A: number[][], b: number[] } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { extractText, isProcessing, progress, error: ocrError } = useOCR();

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, sube solo archivos de imagen');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploadedFile(file);
    setExtractedText('');
    setDetectedSystem(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUploadedFile(null);
    setExtractedText('');
    setDetectedSystem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) return;

    try {
      onImageUpload(uploadedFile);
      
      // Extraer texto con OCR
      const text = await extractText(uploadedFile);
      setExtractedText(text);

      // Parsear ecuaciones
      const size = detectSystemSize(text);
      const result = parseEquationsFromText(text, size);

      if (result) {
        setDetectedSystem(result);
        onSystemDetected?.(result.A, result.b);
      } else {
        alert('No se pudieron detectar ecuaciones válidas en la imagen');
      }
    } catch (err) {
      console.error('Error al procesar imagen:', err);
      alert('Error al procesar la imagen. Intenta con otra imagen más clara.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-text-primary mb-2">
          Entrada por Imagen
        </h3>
        <p className="text-text-secondary">
          Sube una foto de tus ecuaciones y FluxSolver las reconocerá
        </p>
      </div>

      <Card className="p-8">
        {!preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-4 border-dashed rounded-2xl p-12 text-center transition-all
              ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icons.Camera className="text-primary" size={48} />
              </div>

              <h4 className="text-xl font-semibold text-text-primary mb-2">
                Arrastra una imagen aquí
              </h4>
              <p className="text-text-secondary mb-6">
                o haz clic en el botón para seleccionar un archivo
              </p>

              <Button
                variant="primary"
                size="lg"
                icon="Upload"
                onClick={() => fileInputRef.current?.click()}
              >
                Seleccionar imagen
              </Button>

              <p className="text-sm text-text-secondary mt-4">
                Formatos soportados: JPG, PNG, WEBP
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Imagen preview */}
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain bg-gray-50"
              />

              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icons.RefreshCw
                      className="animate-spin mx-auto mb-2"
                      size={48}
                    />
                    <p className="font-semibold">Procesando imagen...</p>
                    <p className="text-sm mt-2">{progress}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Texto extraído */}
            {extractedText && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.FileText className="text-blue-500" size={20} />
                  <h4 className="font-semibold text-blue-800">Texto Detectado:</h4>
                </div>
                <pre className="text-sm text-blue-700 whitespace-pre-wrap font-mono">
                  {extractedText}
                </pre>
              </div>
            )}

            {/* Sistema detectado */}
            {detectedSystem && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.CheckCircle className="text-green-500" size={20} />
                  <h4 className="font-semibold text-green-800">
                    Sistema Detectado ({detectedSystem.A.length}×{detectedSystem.A.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {detectedSystem.A.map((row, i) => (
                    <div key={i} className="font-mono text-sm text-green-700">
                      {row.map((coef, j) => {
                        const sign = coef >= 0 && j > 0 ? '+' : '';
                        return `${sign}${coef}x${j + 1} `;
                      }).join('')}
                      = {detectedSystem.b[i]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error de OCR */}
            {ocrError && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <Icons.XCircle className="text-red-500" size={20} />
                  <p className="text-sm text-red-700">{ocrError}</p>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex justify-center gap-4">
              <Button
                variant="ghost"
                icon="Trash2"
                onClick={handleClear}
                disabled={isProcessing}
              >
                Eliminar
              </Button>
              <Button
                variant="primary"
                icon="Play"
                onClick={handleProcess}
                isLoading={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? `Procesando... ${progress}%` : 'Procesar imagen'}
              </Button>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">Consejos para mejores resultados:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Asegúrate de que la imagen esté bien iluminada</li>
                <li>Las ecuaciones deben estar claramente visibles</li>
                <li>Evita sombras y reflejos</li>
                <li>Letras y números deben ser legibles</li>
                <li>Preferiblemente en formato impreso o escritura clara</li>
                <li>Formato soportado: 2x + 3y = 5 o 2x1 + 3x2 = 5</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};