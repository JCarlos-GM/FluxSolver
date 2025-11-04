import React, { useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Icons } from '../../icons';
import { useVoice } from '../../hooks/useVoice';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  onParse: (transcript: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscriptChange,
  onParse,
}) => {
  const {
    isListening,
    transcript,
    confidence,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoice('es-ES');

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const handleParse = () => {
    if (transcript) {
      onParse(transcript);
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-12 text-center">
        <Icons.XCircle className="mx-auto mb-4 text-red-500" size={64} />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Reconocimiento de voz no disponible
        </h3>
        <p className="text-text-secondary mb-4">
          Tu navegador no soporta la Web Speech API. Por favor, usa Chrome o Edge
          para esta funcionalidad.
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Recargar página
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-text-primary mb-2">
          Entrada por Voz
        </h3>
        <p className="text-text-secondary">
          Dicta tus ecuaciones y FluxSolver las reconocerá automáticamente
        </p>
      </div>

      <Card className="p-8">
        {/* Visualización del micrófono */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div
            className={`
              relative w-32 h-32 rounded-full flex items-center justify-center
              transition-all duration-300
              ${
                isListening
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                  : 'bg-primary shadow-md'
              }
            `}
          >
            <Icons.Mic className="text-white" size={48} />

            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
            )}
          </div>

          <p className="mt-4 text-lg font-semibold text-text-primary">
            {isListening ? 'Escuchando...' : 'Listo para escuchar'}
          </p>
          {confidence > 0 && (
            <p className="text-sm text-text-secondary">
              Confianza: {(confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>

        {/* Controles */}
        <div className="flex justify-center gap-4 mb-8">
          {!isListening ? (
            <Button
              variant="primary"
              size="lg"
              icon="Mic"
              onClick={startListening}
            >
              Comenzar a dictar
            </Button>
          ) : (
            <Button
              variant="danger"
              size="lg"
              icon="Pause"
              onClick={stopListening}
            >
              Detener
            </Button>
          )}

          {transcript && (
            <>
              <Button
                variant="ghost"
                size="lg"
                icon="Trash2"
                onClick={resetTranscript}
              >
                Limpiar
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="Play"
                onClick={handleParse}
              >
                Procesar
              </Button>
            </>
          )}
        </div>

        {/* Transcripción */}
        {transcript && (
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Icons.FileText className="text-primary" size={20} />
              <span className="font-semibold text-text-primary">
                Transcripción:
              </span>
            </div>
            <p className="text-text-primary leading-relaxed">{transcript}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <Icons.AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-red-800 mb-1">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Icons.Info className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">Cómo dictar ecuaciones:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Habla claramente y de forma pausada</li>
                <li>Ejemplo: "dos equis más tres ye igual a cinco"</li>
                <li>Puedes decir: "siguiente ecuación" para separar ecuaciones</li>
                <li>Di "punto" para números decimales</li>
                <li>Di "menos" para números negativos</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};