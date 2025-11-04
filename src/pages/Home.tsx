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
        className="pt-32 md:pt-24"
      >
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6">
            <Icons.Zap className="text-primary" size={20} />
            <span className="font-semibold text-primary">
              Potenciado por IA
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6">
            Resuelve Sistemas de{' '}
            <span className="text-primary">Ecuaciones Lineales</span> al
            Instante
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed">
            La calculadora más potente con métodos de Jacobi y Gauss-Seidel.
            Entrada por voz, reconocimiento de imágenes, y visualización 3D.
          </p>

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
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">99.9%</p>
              <p className="text-text-secondary">Precisión</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">&lt;1s</p>
              <p className="text-text-secondary">Tiempo de respuesta</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">3</p>
              <p className="text-text-secondary">Modos de entrada</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Trusted by */}
      <Section padding="md" background="white">
        <div className="text-center">
          <p className="text-text-secondary mb-8">Confiado por estudiantes de</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            <div className="text-2xl font-bold text-text-primary">MIT</div>
            <div className="text-2xl font-bold text-text-primary">Stanford</div>
            <div className="text-2xl font-bold text-text-primary">
              UC Berkeley
            </div>
            <div className="text-2xl font-bold text-text-primary">Harvard</div>
            <div className="text-2xl font-bold text-text-primary">Caltech</div>
          </div>
        </div>
      </Section>
    </>
  );
};