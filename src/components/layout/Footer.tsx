import React from 'react';
import { Icons } from '../../icons';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Características', href: '#features' },
      { label: 'Cómo funciona', href: '#how-it-works' },
      { label: 'Métodos', href: '#methods' },
      { label: 'Preguntas frecuentes', href: '#faq' },
    ],
    resources: [
      { label: 'Documentación', href: '#docs' },
      { label: 'Tutoriales', href: '#tutorials' },
      { label: 'Ejemplos', href: '#examples' },
      { label: 'Blog', href: '#blog' },
    ],
    company: [
      { label: 'Acerca de', href: '#about' },
      { label: 'Contacto', href: '#contact' },
      { label: 'Privacidad', href: '#privacy' },
      { label: 'Términos', href: '#terms' },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Icons.Calculator className="text-primary" size={24} />
              </div>
              <span className="text-xl font-bold text-text-primary">
                FluxSolver
              </span>
            </div>
            <p className="text-text-secondary text-sm">
              Resuelve sistemas de ecuaciones lineales con los métodos de Jacobi
              y Gauss-Seidel de forma rápida y precisa.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Producto</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Compañía</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">
              © {currentYear} FluxSolver. Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label="Sitio web"
              >
                <Icons.Globe size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label="Compartir"
              >
                <Icons.Share2 size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-primary transition-colors"
                aria-label="Correo"
              >
                <Icons.Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
