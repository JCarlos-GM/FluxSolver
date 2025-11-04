export type InputMode = 'manual' | 'voice' | 'image';

export interface VoiceInputResult {
  transcript: string;
  confidence: number;
  isListening: boolean;
}

export interface ImageInputResult {
  imageUrl: string;
  extractedText: string;
  equations: string[];
  confidence: number;
}

export interface ParsedEquation {
  coefficients: number[];
  constant: number;
  variables: string[];
  raw: string;
}