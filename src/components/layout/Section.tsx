import React from 'react';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'white' | 'gray' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  containerSize = 'xl',
  background = 'white',
  padding = 'lg',
}) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-primary-light to-white',
  };

  const paddings = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  };

  return (
    <section
      id={id}
      className={`
        ${backgrounds[background]}
        ${paddings[padding]}
        ${className}
      `}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
};