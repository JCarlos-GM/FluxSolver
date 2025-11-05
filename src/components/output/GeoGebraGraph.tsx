import React, { useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Icons } from '../../icons';
import type { Matrix, Vector } from '../../types';

interface GeoGebraGraphProps {
  matrix: Matrix;
  vector: Vector;
  solution: Vector;
}

// Declarar el objeto global de GeoGebra
declare global {
  interface Window {
    GGBApplet: any;
  }
}

export const GeoGebraGraph: React.FC<GeoGebraGraphProps> = ({
  matrix,
  vector,
  solution,
}) => {
  const appletRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const size = matrix.length;
  const is2D = size === 2;
  const is3D = size === 3;

  useEffect(() => {
    // Cargar el script de GeoGebra si no está cargado
    if (!window.GGBApplet) {
      const script = document.createElement('script');
      script.src = 'https://www.geogebra.org/apps/deployggb.js';
      script.async = true;
      script.onload = () => initGeoGebra();
      document.body.appendChild(script);
    } else {
      initGeoGebra();
    }

    return () => {
      // Cleanup
      if (appletRef.current) {
        try {
          if (appletRef.current.removeApplet) {
            appletRef.current.removeApplet();
          }
          appletRef.current = null;
        } catch (e) {
          console.error('Error al limpiar GeoGebra:', e);
        }
      }
    };
  }, [matrix, vector, solution]);

  const initGeoGebra = () => {
    if (!containerRef.current) return;

    // Configuración del applet
    const parameters = {
      appName: is3D ? '3d' : 'graphing',
      width: containerRef.current.offsetWidth,
      height: 600,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      showResetIcon: true,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      enableRightClick: false,
      showFullscreenButton: true,
      scale: 1,
      disableAutoScale: false,
      allowUpscale: false,
      clickToLoad: false,
      appletOnLoad: (api: any) => onAppletLoad(api),
      showLogging: false,
      errorDialogsActive: false,
      useBrowserForJS: false,
      algebraInputPosition: 'none',
      allowReplace: true,
    };

    containerRef.current.innerHTML = '';

    const applet = new window.GGBApplet(parameters, true);
    applet.inject(containerRef.current);
  };

  const onAppletLoad = (api: any) => {
    appletRef.current = api;
    console.log('GeoGebra cargado');

    if (is2D) {
      draw2DSystem(api);
    } else if (is3D) {
      draw3DSystem(api);
    }
  };

  /**
   * Dibuja sistema 2D (2 rectas)
   */
  const draw2DSystem = (api: any) => {
    try {
      const [a1, b1] = matrix[0];
      const c1 = vector[0];
      const [a2, b2] = matrix[1];
      const c2 = vector[1];

      // Limpiar objetos previos si existen (importante al re-renderizar)
      // api.deleteAllObjects(); // <--- LÍNEA INCORRECTA
      api.evalCommand("New()");  // <--- LÍNEA CORREGIDA

      // Construir ecuaciones para GeoGebra
      if (b1 !== 0) {
        const eq1 = `(${c1} - ${a1}*x) / ${b1}`;
        api.evalCommand(`f(x) = ${eq1}`);
        api.setColor('f', 59, 130, 246); // Azul
        api.setLineThickness('f', 3);
      } else if (a1 !== 0) {
        const xVal = c1 / a1;
        api.evalCommand(`Line1: x = ${xVal}`);
        api.setColor('Line1', 59, 130, 246);
        api.setLineThickness('Line1', 3);
      }

      if (b2 !== 0) {
        const eq2 = `(${c2} - ${a2}*x) / ${b2}`;
        api.evalCommand(`g(x) = ${eq2}`);
        api.setColor('g', 16, 185, 129); // Verde
        api.setLineThickness('g', 3);
      } else if (a2 !== 0) {
        const xVal = c2 / a2;
        api.evalCommand(`Line2: x = ${xVal}`);
        api.setColor('Line2', 16, 185, 129);
        api.setLineThickness('Line2', 3);
      }

      // Marcar punto de intersección (solución)
      const [x, y] = solution;
      api.evalCommand(`S = (${x}, ${y})`);
      api.setColor('S', 239, 68, 68); // Rojo
      api.setPointSize('S', 5);
      api.setLabelVisible('S', true);
      api.setCaption('S', 'Solución');

      api.setCoordSystem(-10, 10, -10, 10);

      console.log('Sistema 2D dibujado');
    } catch (error) {
      console.error('Error al dibujar sistema 2D:', error);
    }
  };

  /**
   * Dibuja sistema 3D (3 planos)
   */
  const draw3DSystem = (api: any) => {
    try {
      const [a1, b1, c1] = matrix[0];
      const d1 = vector[0];
      const [a2, b2, c2] = matrix[1];
      const d2 = vector[1];
      const [a3, b3, c3] = matrix[2];
      const d3 = vector[2];

      // Limpiar objetos previos
      // api.deleteAllObjects(); // <--- LÍNEA INCORRECTA
      api.evalCommand("New()");  // <--- LÍNEA CORREGIDA

      // Crear los planos en GeoGebra
      api.evalCommand(`Plano1: ${a1}*x + ${b1}*y + ${c1}*z = ${d1}`);
      api.setColor('Plano1', 59, 130, 246); // Azul
      api.setLineThickness('Plano1', 2);

      api.evalCommand(`Plano2: ${a2}*x + ${b2}*y + ${c2}*z = ${d2}`);
      api.setColor('Plano2', 16, 185, 129); // Verde
      api.setLineThickness('Plano2', 2);

      api.evalCommand(`Plano3: ${a3}*x + ${b3}*y + ${c3}*z = ${d3}`);
      api.setColor('Plano3', 245, 158, 11); // Naranja
      api.setLineThickness('Plano3', 2);

      // Marcar punto de intersección (solución)
      const [x, y, z] = solution;
      api.evalCommand(`S = (${x}, ${y}, ${z})`);
      api.setColor('S', 239, 68, 68); // Rojo
      api.setPointSize('S', 7);
      api.setLabelVisible('S', true);
      api.setCaption('S', 'Solución');

      api.setCoordSystem(-10, 10, -10, 10, -10, 10);

      console.log('Sistema 3D dibujado');
    } catch (error) {
      console.error('Error al dibujar sistema 3D:', error);
    }
  };

  if (!is2D && !is3D) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-text-secondary">
          <Icons.Info size={20} />
          <p>
            La visualización gráfica solo está disponible para sistemas 2×2 y 3×3
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">
            Visualización Gráfica {is3D ? '3D' : '2D'}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {is3D
              ? 'Los tres planos se intersectan en el punto rojo (solución)'
              : 'Las dos rectas se intersectan en el punto rojo (solución)'}
          </p>
        </div>
        <Icons.Eye className="text-primary" size={24} />
      </div>

      {/* Container de GeoGebra */}
      <div
        ref={containerRef}
        id="geogebra-container" // <-- Cambio implementado aquí
        className="w-full h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden bg-white"
      />

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>{is3D ? 'Plano 1' : 'Recta 1'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>{is3D ? 'Plano 2' : 'Recta 2'}</span>
        </div>
        {is3D && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Plano 3</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="font-semibold">Solución</span>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Icons.Info className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Controles:</p>
            <ul className="space-y-0.5">
              <li>• Clic y arrastrar: Rotar vista {is3D ? '3D' : '(mover gráfica)'}</li>
              <li>• Scroll: Zoom in/out</li>
              <li>• Botón de reset: Restaurar vista inicial</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};