import React from 'react';
import { Section } from '../components/layout/Section';
import { Button } from '../components/common/Button';
import { Icons } from '../icons';

export const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <Section
        id="hero"
        background="gradient"
        padding="xl"
        className="pt-32 md:pt-24 px-4 sm:px-6"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Header Tag */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6">
            <Icons.Zap className="text-primary" size={20} />
            <span className="font-semibold text-primary text-sm sm:text-base">
              Nico y la China
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
            Resuelve Sistemas de{' '}
            <span className="text-primary">Ecuaciones Lineales</span> al
            Instante
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-2xl text-text-secondary mb-12 leading-relaxed px-2 sm:px-0">
            La calculadora más potente con métodos de Jacobi y Gauss-Seidel.
            Entrada por voz, reconocimiento de imágenes y visualización 3D.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              Comenzar Ahora
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon="BookOpen"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
            >
              Ver Cómo Funciona
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                99.9%
              </p>
              <p className="text-text-secondary text-sm sm:text-base">
                Precisión
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                &lt;1s
              </p>
              <p className="text-text-secondary text-sm sm:text-base">
                Tiempo de respuesta
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                3
              </p>
              <p className="text-text-secondary text-sm sm:text-base">
                Modos de entrada
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
