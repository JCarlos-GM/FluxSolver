// src/utils/pdfExporter.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { SolverResult, Matrix, Vector, SolverConfig } from '../types';
import { formatExecutionTime, formatNumber, systemToLatex } from './formatters';

// Opciones de datos para el exportador
interface PDFExportData {
  result: SolverResult;
  matrix: Matrix;
  vector: Vector;
  config: SolverConfig;
}

// Constantes de diseño
const A4_WIDTH_PT = 595.28;
const MARGIN_PT = 40;
const CONTENT_WIDTH_PT = A4_WIDTH_PT - MARGIN_PT * 2;
const PRIMARY_COLOR = '#12957D'; // Tu color primario

/**
 * Función auxiliar para añadir títulos de sección
 */
const addSectionTitle = (doc: jsPDF, title: string, y: number): number => {
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text(title, MARGIN_PT, y);
  doc.setDrawColor(PRIMARY_COLOR);
  doc.line(MARGIN_PT, y + 4, MARGIN_PT + CONTENT_WIDTH_PT, y + 4);
  return y + 24;
};

/**
 * Función auxiliar para añadir texto normal
 */
const addText = (doc: jsPDF, text: string, y: number): number => {
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#1A1A1A'); // text-primary
  const splitText = doc.splitTextToSize(text, CONTENT_WIDTH_PT);
  doc.text(splitText, MARGIN_PT, y);
  return y + splitText.length * 12 + 4;
};

/**
 * Función auxiliar para añadir pares de clave-valor
 */
const addInfoPair = (doc: jsPDF, label: string, value: string, y: number) => {
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor('#1A1A1A');
  doc.text(label, MARGIN_PT, y);

  doc.setFont('Helvetica', 'normal');
  doc.text(value, MARGIN_PT + 120, y);
};

/**
 * Función principal de exportación a PDF
 */
export const exportPDF = async (data: PDFExportData): Promise<void> => {
  const { result, matrix, vector, config } = data;
  const doc = new jsPDF('p', 'pt', 'a4');
  let currentY = MARGIN_PT;

  // --- 1. Título ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text('FluxSolver - Reporte de Solución', MARGIN_PT, currentY);
  currentY += 20;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor('#6B7280'); // text-secondary
  doc.text(new Date().toLocaleString('es-ES'), MARGIN_PT, currentY);
  currentY += 30;

  // --- 2. Resumen de Resultados ---
  currentY = addSectionTitle(doc, 'Resumen de la Resolución', currentY);

  addInfoPair(
    doc,
    'Estado:',
    result.converged ? '✅ Convergió' : '❌ No Convergió',
    currentY
  );
  currentY += 18;
  addInfoPair(
    doc,
    'Método:',
    config.method === 'jacobi' ? 'Jacobi' : 'Gauss-Seidel',
    currentY
  );
  currentY += 18;
  addInfoPair(doc, 'Iteraciones:', `${result.iterationCount}`, currentY);
  currentY += 18;
  addInfoPair(
    doc,
    'Error Final:',
    `${result.finalError.toExponential(4)}`,
    currentY
  );
  currentY += 18;
  addInfoPair(
    doc,
    'Tiempo:',
    `${formatExecutionTime(result.executionTime)}`,
    currentY
  );
  currentY += 24;

  // --- 3. Vector Solución ---
  currentY = addSectionTitle(doc, 'Vector Solución (x)', currentY);
  result.solution.forEach((val, i) => {
    addInfoPair(doc, `x${i + 1}:`, `${formatNumber(val, 8)}`, currentY);
    currentY += 18;
  });
  currentY += 6;

  // --- 4. Sistema Original (Matriz A y Vector b) ---
  currentY = addSectionTitle(doc, 'Sistema de Ecuaciones (A | b)', currentY);

  const systemHead = [
    matrix[0].map((_, i) => `x${i + 1}`).concat(['b']),
  ];
  const systemBody = matrix.map((row, i) => [
    ...row.map(val => formatNumber(val, 3)),
    formatNumber(vector[i], 3),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: systemHead,
    body: systemBody,
    theme: 'grid',
    headStyles: {
      fillColor: PRIMARY_COLOR,
      textColor: '#FFFFFF',
    },
    styles: {
      cellPadding: 4,
      fontSize: 9,
    },
  });
  
  // ***** CAMBIO 1/2 *****
  // Reemplazar 'autoTable.previous.finalY' con 'lastAutoTable.finalY'
  currentY = (doc as any).lastAutoTable.finalY + 24;

  // --- 5. Gráfica de GeoGebra ---
  // (Solo si es 2x2 o 3x3)
  const size = matrix.length;
  if (size === 2 || size === 3) {
    // Añadir salto de página si no hay espacio
    if (currentY + 300 > doc.internal.pageSize.height) {
      doc.addPage();
      currentY = MARGIN_PT;
    }

    currentY = addSectionTitle(doc, `Gráfica ${size}D (GeoGebra)`, currentY);

    const graphContainer = document.getElementById('geogebra-container');
    if (graphContainer) {
      try {
        const canvas = await html2canvas(graphContainer, {
          useCORS: true,
          logging: false,
          scale: 1.5, // Aumentar resolución
          backgroundColor: '#ffffff', // Fondo blanco
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = CONTENT_WIDTH_PT;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', MARGIN_PT, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 24;

      } catch (err) {
        console.error('Error al capturar GeoGebra:', err);
        currentY = addText(doc, 'Error: No se pudo capturar la gráfica.', currentY);
      }
    } else {
      currentY = addText(doc, 'No se encontró el contenedor de la gráfica.', currentY);
    }
  }

  // --- 6. Tabla de Iteraciones ---
  if (currentY + 50 > doc.internal.pageSize.height) {
    doc.addPage();
    currentY = MARGIN_PT;
  }

  currentY = addSectionTitle(doc, 'Tabla de Iteraciones', currentY);

  const iterationsHead = [
    ['k', ...result.iterations[0].x.map((_, i) => `x${i + 1}`), 'Error'],
  ];
  const iterationsBody = result.iterations.map(it => [
    it.k,
    ...it.x.map(val => formatNumber(val, 6)),
    it.error.toExponential(3),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: iterationsHead,
    body: iterationsBody,
    theme: 'striped',
    headStyles: {
      fillColor: '#F3F4F6', // bg-gray
      textColor: '#1A1A1A',
    },
    styles: {
      cellPadding: 4,
      fontSize: 8,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
  });

  // ***** CAMBIO 2/2 *****
  // Actualizar el 'currentY' por si acaso necesitas añadir más secciones después.
  currentY = (doc as any).lastAutoTable.finalY + 24;

  // --- 7. Guardar el PDF ---
  doc.save(`FluxSolver_Reporte_${new Date().toISOString().split('T')[0]}.pdf`);
};