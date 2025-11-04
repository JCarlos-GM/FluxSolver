import React from 'react';
import { Card } from '../common/Card';
import { Section } from '../layout/Section';
import { Icons } from '../../icons';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Ingresa tu Sistema',
      description:
        'Escribe manualmente las ecuaciones, usa tu voz, o sube una imagen. FluxSolver se adapta a ti.',
      icon: 'Edit' as const,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: 2,
      title: 'Selecciona el Método',
      description:
        'Elige entre Jacobi o Gauss-Seidel. Configura la tolerancia y número máximo de iteraciones.',
      icon: 'Settings' as const,
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: 3,
      title: 'Obtén los Resultados',
      description:
        'Visualiza la solución, el procedimiento paso a paso, la tabla de iteraciones y gráficas de convergencia.',
      icon: 'CheckCircle' as const,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <Section id="how-it-works" padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          ¿Cómo Funciona{' '}
          <span className="text-primary">FluxSolver</span>?
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Resolver sistemas de ecuaciones nunca fue tan fácil. Solo tres pasos te separan
          de la solución.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Líneas conectoras (solo desktop) */}
        <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-10" />

        {steps.map((step) => {
          const Icon = Icons[step.icon];
          return (
            <Card
              key={step.number}
              className="relative text-center p-8"
              hover
            >
              {/* Número */}
              <div
                className={`
                absolute -top-6 left-1/2 -translate-x-1/2
                w-12 h-12 rounded-full bg-gradient-to-br ${step.color}
                flex items-center justify-center text-white font-bold text-xl
                shadow-lg
              `}
              >
                {step.number}
              </div>

              {/* Ícono */}
              <div className="mt-8 mb-4 flex justify-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon size={40} className="text-primary" />
                </div>
              </div>

              {/* Contenido */}
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
};