import React, { useState } from 'react';
import { Section } from '../layout/Section';
import { Icons } from '../../icons';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: '¿Qué son los métodos de Jacobi y Gauss-Seidel?',
      answer:
        'Son métodos iterativos para resolver sistemas de ecuaciones lineales. Jacobi actualiza todas las variables simultáneamente, mientras que Gauss-Seidel usa los valores más recientes en cada paso, generalmente convergiendo más rápido.',
    },
    {
      question: '¿Qué significa que una matriz sea diagonalmente dominante?',
      answer:
        'Una matriz es diagonalmente dominante cuando el valor absoluto de cada elemento diagonal es mayor que la suma de los valores absolutos de los demás elementos en su fila. Esta propiedad garantiza la convergencia de los métodos iterativos.',
    },
    {
      question: '¿Qué hago si mi sistema no converge?',
      answer:
        'Si el método no converge, verifica que la matriz sea diagonalmente dominante. Puedes intentar reordenar las ecuaciones o aumentar el número máximo de iteraciones. También puedes ajustar la tolerancia o usar el botón "Aleatorio" para generar un sistema con convergencia garantizada.',
    },
    {
      question: '¿Puedo resolver sistemas más grandes que 5×5?',
      answer:
        'Actualmente, FluxSolver soporta sistemas de hasta 5×5 para mantener una visualización clara y un rendimiento óptimo. Para sistemas más grandes, considera usar software especializado de álgebra lineal.',
    },
    {
      question: '¿Cómo funciona el reconocimiento de voz?',
      answer:
        'FluxSolver usa la Web Speech API del navegador para convertir tu voz en texto. Puedes dictar ecuaciones como "dos equis más tres ye igual a cinco" y la aplicación las interpretará automáticamente.',
    },
    {
      question: '¿Los datos se guardan en la nube?',
      answer:
        'No, toda tu información se guarda localmente en tu navegador usando localStorage. Tus datos nunca salen de tu dispositivo, garantizando total privacidad.',
    },
    {
      question: '¿Puedo exportar mis resultados?',
      answer:
        'Sí, puedes exportar tus resultados en formato PDF con el procedimiento completo, tablas de iteraciones y gráficas. También puedes guardar cada resolución en el historial para consultarla después.',
    },
    {
      question: '¿Qué navegadores son compatibles?',
      answer:
        'FluxSolver funciona en todos los navegadores modernos: Chrome, Firefox, Safari, Edge. Para las funciones de voz, recomendamos Chrome o Edge que tienen mejor soporte de la Web Speech API.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" background="gray" padding="xl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Preguntas <span className="text-primary">Frecuentes</span>
          </h2>
          <p className="text-xl text-text-secondary">
            Todo lo que necesitas saber sobre FluxSolver
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden transition-all hover:border-primary/30"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-text-primary pr-4">
                  {faq.question}
                </span>
                <Icons.ChevronDown
                  size={24}
                  className={`
                    flex-shrink-0 text-primary transition-transform duration-300
                    ${openIndex === index ? 'rotate-180' : ''}
                  `}
                />
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-300
                  ${openIndex === index ? 'max-h-96' : 'max-h-0'}
                `}
              >
                <div className="px-6 pb-5 text-text-secondary leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA adicional */}
        <div className="mt-12 text-center p-8 bg-primary/5 rounded-xl border-2 border-primary/20">
          <p className="text-text-primary font-medium mb-4">
            ¿No encontraste lo que buscabas?
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Icons.Mail size={20} />
            <a href="mailto:support@fluxsolver.com" className="hover:underline">
              Contáctanos en support@fluxsolver.com
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};