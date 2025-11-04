import React from 'react';
import { Section } from '../components/layout/Section';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Icons } from '../icons';

export const About: React.FC = () => {
  return (
    <>
      {/* Hero */}
      <Section id="about-hero" background="gradient" padding="xl" className="pt-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Sobre <span className="text-primary">FluxSolver</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            La herramienta definitiva para resolver sistemas de ecuaciones lineales
            con métodos iterativos, creada por estudiantes, para estudiantes.
          </p>
        </div>
      </Section>

      {/* Misión */}
      <Section padding="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Nuestra Misión
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              FluxSolver nació de la necesidad de tener una herramienta moderna,
              intuitiva y poderosa para resolver sistemas de ecuaciones lineales
              usando métodos numéricos iterativos.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              Creemos que aprender matemáticas debe ser visual, interactivo y
              accesible. Por eso combinamos algoritmos precisos con interfaces
              modernas y múltiples formas de entrada.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center">
              <Icons.Target className="text-primary mx-auto mb-3" size={48} />
              <p className="text-3xl font-bold text-text-primary mb-2">99.9%</p>
              <p className="text-sm text-text-secondary">Precisión</p>
            </Card>
            <Card className="p-6 text-center">
              <Icons.Zap className="text-yellow-500 mx-auto mb-3" size={48} />
              <p className="text-3xl font-bold text-text-primary mb-2">&lt;1s</p>
              <p className="text-sm text-text-secondary">Velocidad</p>
            </Card>
            <Card className="p-6 text-center">
              <Icons.User className="text-blue-500 mx-auto mb-3" size={48} />
              <p className="text-3xl font-bold text-text-primary mb-2">10K+</p>
              <p className="text-sm text-text-secondary">Usuarios</p>
            </Card>
            <Card className="p-6 text-center">
              <Icons.Globe className="text-green-500 mx-auto mb-3" size={48} />
              <p className="text-3xl font-bold text-text-primary mb-2">50+</p>
              <p className="text-sm text-text-secondary">Idiomas</p>
            </Card>
          </div>
        </div>
      </Section>

      {/* Tecnología */}
      <Section background="gray" padding="xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Tecnología de Vanguardia
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            FluxSolver está construido con las mejores herramientas modernas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'React', icon: '⚛️' },
            { name: 'TypeScript', icon: '📘' },
            { name: 'Tailwind CSS', icon: '🎨' },
            { name: 'Vite', icon: '⚡' },
            { name: 'Web Speech API', icon: '🎤' },
            { name: 'Tesseract.js', icon: '📷' },
            { name: 'Plotly.js', icon: '📊' },
            { name: 'jsPDF', icon: '📄' },
          ].map((tech) => (
            <Card key={tech.name} className="p-6 text-center hover:shadow-lg">
              <div className="text-4xl mb-3">{tech.icon}</div>
              <p className="font-semibold text-text-primary">{tech.name}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Equipo (opcional) */}
      <Section padding="xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Desarrollado con ❤️
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Por estudiantes de ingeniería apasionados por las matemáticas y la
            tecnología
          </p>
        </div>

        <Card className="p-8 max-w-2xl mx-auto text-center">
          <Icons.User className="text-primary mx-auto mb-4" size={64} />
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Juan Carlos
          </h3>
          <p className="text-text-secondary mb-4">Fundador & Desarrollador Principal</p>
          <p className="text-text-secondary leading-relaxed mb-6">
            Estudiante de Ingeniería con pasión por los métodos numéricos y el
            desarrollo web moderno. FluxSolver es mi proyecto para hacer las
            matemáticas más accesibles para todos.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" icon="Globe">
              Portfolio
            </Button>
            <Button variant="ghost" icon="Mail">
              Contacto
            </Button>
          </div>
        </Card>
      </Section>

      {/* CTA Final */}
      <Section background="gradient" padding="xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Únete a miles de estudiantes que ya usan FluxSolver para resolver sus
            sistemas de ecuaciones
          </p>
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
        </div>
      </Section>
    </>
  );
};