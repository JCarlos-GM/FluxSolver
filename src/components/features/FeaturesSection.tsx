import React from 'react';
import { FeatureCard } from './FeatureCard';
import { Section } from '../layout/Section';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: 'Zap' as const,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100',
      title: 'Solución Rápida',
      description:
        'Obtén resultados instantáneos con nuestros algoritmos optimizados de Jacobi y Gauss-Seidel.',
    },
    {
      icon: 'Target' as const,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      title: 'Alta Precisión',
      description:
        'Resultados con hasta 12 decimales de precisión. Configura la tolerancia según tus necesidades.',
    },
    {
      icon: 'BookOpen' as const,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      title: 'Paso a Paso',
      description:
        'Visualiza cada iteración del proceso con explicaciones detalladas para aprender mientras resuelves.',
    },
    {
      icon: 'BarChart3' as const,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      title: 'Visualización 3D',
      description:
        'Para sistemas 3×3, visualiza los planos y su intersección en un gráfico interactivo 3D.',
    },
    {
      icon: 'Mic' as const,
      iconColor: 'text-red-600',
      iconBgColor: 'bg-red-100',
      title: 'Entrada por Voz',
      description:
        'Dicta tus ecuaciones y deja que la IA las reconozca y convierta en un sistema de ecuaciones.',
    },
    {
      icon: 'Camera' as const,
      iconColor: 'text-indigo-600',
      iconBgColor: 'bg-indigo-100',
      title: 'Reconocimiento de Imágenes',
      description:
        'Sube una foto de tus ecuaciones escritas a mano o impresas y FluxSolver las interpretará.',
    },
    {
      icon: 'History' as const,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      title: 'Historial Completo',
      description:
        'Guarda y revisa todas tus resoluciones anteriores. Nunca pierdas tus cálculos importantes.',
    },
    {
      icon: 'Download' as const,
      iconColor: 'text-teal-600',
      iconBgColor: 'bg-teal-100',
      title: 'Exportación a PDF',
      description:
        'Exporta tus resultados con el procedimiento completo, tablas e iteraciones en formato PDF.',
    },
  ];

  return (
    <Section id="features" background="gray" padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Características Potentes para{' '}
          <span className="text-primary">Resolver Cualquier Sistema</span>
        </h2>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          FluxSolver combina potencia computacional con facilidad de uso para ofrecerte
          la mejor experiencia en resolución de sistemas de ecuaciones lineales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </Section>
  );
};