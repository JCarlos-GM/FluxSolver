import React from 'react';
import { Icons, type IconName } from '../../icons';
import type { InputMode } from '../../types';

interface InputModeSelectorProps {
  activeMode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

export const InputModeSelector: React.FC<InputModeSelectorProps> = ({
  activeMode,
  onModeChange,
}) => {
  const modes: Array<{ value: InputMode; label: string; icon: IconName }> = [
    { value: 'manual', label: 'Manual', icon: 'Edit' },
    { value: 'voice', label: 'Voz', icon: 'Mic' },
    { value: 'image', label: 'Imagen', icon: 'Camera' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white rounded-full border-2 border-gray-200 w-fit mx-auto max-w-full">
      {modes.map((mode) => {
        const Icon = Icons[mode.icon];
        const isActive = activeMode === mode.value;

        return (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`
              flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold transition-all text-sm sm:text-base
              ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-transparent text-text-secondary hover:bg-gray-100'
              }
            `}
          >
            <Icon size={16} className="sm:w-5 sm:h-5" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};