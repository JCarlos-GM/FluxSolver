// En: utils/excelExporter.ts

import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver'; // Usamos file-saver para guardar el archivo

/**
 * Exporta un array de objetos a un archivo Excel (.xlsx) con estilos personalizados.
 * @param data El array de datos (objetos).
 * @param fileName El nombre del archivo (sin .xlsx).
 * @param sheetName El nombre de la pestaña en Excel.
 */
export const exportToExcel = async (
  data: any[],
  fileName: string,
  sheetName: string
) => {
  if (!data || data.length === 0) {
    console.error('No hay datos para exportar.');
    return;
  }

  const workbook = new Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  // --- 1. Título "FluxSolver" ---
  // Añadimos el título en la primera fila
  const titleRow = sheet.addRow(['FluxSolver - Resultados de Simulación']);
  titleRow.font = { name: 'Arial', size: 16, bold: true };

  // Obtenemos las cabeceras para saber cuántas columnas combinar
  const headers = Object.keys(data[0]);
  sheet.mergeCells(1, 1, 1, headers.length); // Combinar Fila 1, Col 1 hasta Fila 1, Col [total]
  sheet.getRow(1).alignment = { horizontal: 'center' }; // Centrar el título

  // Añadir una fila en blanco
  sheet.addRow([]);

  // --- 2. Encabezados (Verde Teal y Blanco) ---
  const headerRow = sheet.addRow(headers);

  headerRow.eachCell((cell, colNumber) => {
    // Aplicamos los estilos que pediste
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF008080' }, // Un buen color Verde Teal (Hex: 008080)
    };
    cell.font = {
      color: { argb: 'FFFFFFFF' }, // Texto Blanco (Hex: FFFFFF)
      bold: true,
    };
    cell.alignment = { horizontal: 'center' };
  });

  // --- 3. Añadir Datos ---
  data.forEach(d => {
    // Añadimos los datos, simplemente como un array de valores
    sheet.addRow(Object.values(d));
  });

  // --- 4. Añadir Bordes a la tabla ---
  // Iteramos sobre todas las filas DESPUÉS del título y la fila en blanco
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 2) {
      row.eachCell(cell => {
        // Borde delgado en todas las celdas con datos
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
  });
  
  // --- 5. (BONUS) Auto-ajustar el ancho de las columnas ---
  // --- 5. Ajustar el ancho de las columnas (Aún más estrechas) ---
  sheet.columns.forEach((column, index) => {
    const header = headers[index];

    if (header === 'K') {
      // Columna 'K' (Iteración) - Mínimo
      column.width = 4;
    } else if (header.startsWith('X')) {
      // Columnas 'X1', 'X2', etc. - Súper ajustado
      // (-0.806751 tiene 9 caracteres)
      column.width = 9;
    } else {
      // Columnas de 'Error' y 'Residuo' - Padding mínimo
      column.width = header.length + 2;
    }
  });

  // --- 6. Guardar Archivo ---
  // Escribimos el buffer y usamos file-saver para descargarlo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
};