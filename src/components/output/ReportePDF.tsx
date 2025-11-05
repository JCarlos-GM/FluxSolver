// src/components/output/ReportePDF.tsx
import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  // --- CAMBIO ---
  // Importar Svg y Path para los iconos
  Svg,
  Path,
} from '@react-pdf/renderer';
import type { Iteration, Matrix, Vector } from '../../types';

// --- Interfaz de Props ---
interface ReportePDFProps {
  solutionData: {
    method: string;
    status: string;
    iterations: number;
    finalError: number;
    solution: Vector;
    matrix: Matrix;
    vector: Vector;
    iterationTable: Iteration[];
  };
}

// --- Paleta de Colores (Coherente con FluxSolver) ---
const colors = {
  primary: '#12957d',
  primaryDark: '#0f7a66',
  primaryLight: '#e6f7f4',
  textPrimary: '#1a1a1a',
  textSecondary: '#6b7280',
  bgGray: '#f9fafb',
  borderGray: '#e5e7eb',
  statusBg: '#dcfcec',
  statusText: '#15803d',
  white: '#ffffff',
  red: '#ef4444',
  redLight: '#fee2e2',
};

// --- CAMBIO: Registro de Fuentes ---
// Asegúrate de tener estos archivos de fuentes (ej. .ttf)
// en tu proyecto (ej. en /public/fonts)
// ¡Esto es lo que más mejorará el aspecto!
/*
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});
Font.register({
  family: 'JetBrainsMono',
  fonts: [
    { src: '/fonts/JetBrainsMono-Regular.ttf' },
    { src: '/fonts/JetBrainsMono-Bold.ttf', fontWeight: 'bold' },
  ],
});
*/

// --- Estilos ---
const styles = StyleSheet.create({
  // --- Contenedor de Página ---
  page: {
    // --- CAMBIO ---
    fontFamily: 'Inter', // Usar la fuente registrada
    fontSize: 10,
    backgroundColor: colors.bgGray,
    color: colors.textPrimary,
  },

  // ... (bgShapeTop y bgShapeBottom sin cambios) ...
  bgShapeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    backgroundColor: colors.primaryLight,
    opacity: 0.5,
    borderBottomRightRadius: 200,
  },
  bgShapeBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 150,
    height: 150,
    backgroundColor: colors.primary,
    opacity: 0.2,
    borderTopLeftRadius: 150,
  },

  // --- Layout Principal (Contenido) ---
  content: {
    padding: 32,
  },

  // --- Encabezado ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
    width: '100%',
  },
  headerTitleBlock: {
    // Espacio para el título
  },
  headerColorBlock: {
    position: 'absolute',
    top: -32, // Alinea con el borde de la página
    right: -32, // Alinea con el borde de la página
    width: 250,
    height: 120,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 700, // 'bold'
    color: colors.textPrimary,
    fontFamily: 'Inter', // --- CAMBIO ---
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // --- Tarjeta (Card) ---
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGray,
    marginBottom: 24,
    overflow: 'hidden',
  },

  // --- Encabezado de Sección (Dentro de la tarjeta) ---
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    backgroundColor: colors.bgGray,
    // --- CAMBIO ---
    // Evita que el header de sección quede huérfano al final de una página
    wrap: false,
  },
  sectionIcon: {
    width: 32, // --- CAMBIO --- (más grande para SVG)
    height: 32,
    borderRadius: 8, // --- CAMBIO ---
    backgroundColor: colors.primaryLight,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // sectionIconShape (eliminado, ahora usamos SVG)
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600, // 'semibold'
    color: colors.primary,
    fontFamily: 'Inter', // --- CAMBIO ---
  },
  cardContent: {
    padding: 20,
  },

  // --- Resumen de Resolución ---
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    paddingRight: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 14,
    fontWeight: 600, // 'semibold'
    color: colors.textPrimary,
    fontFamily: 'Inter', // --- CAMBIO ---
  },
  statusBadge: {
    backgroundColor: colors.statusBg,
    color: colors.statusText,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 700, // 'bold'
    fontFamily: 'Inter', // --- CAMBIO ---
    textTransform: 'capitalize',
    // --- CAMBIO --- (para que quepa el texto)
    width: 'auto',
    display: 'flex',
    flexGrow: 0,
    flexShrink: 1,
    alignSelf: 'flex-start',
  },
  statusBadgeError: {
    backgroundColor: colors.redLight,
    color: colors.red,
  },

  // --- Solución Final (Nueva Card) ---
  solutionCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  solutionContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  solutionItem: {
    alignItems: 'center',
  },
  solutionLabel: {
    fontSize: 18,
    fontWeight: 700, // 'bold'
    color: colors.textSecondary,
    fontFamily: 'Inter', // --- CAMBIO ---
  },
  solutionValue: {
    fontSize: 22,
    fontWeight: 700, // 'bold'
    color: colors.primary,
    fontFamily: 'Inter', // --- CAMBIO ---
    marginTop: 4,
  },

  // --- Datos de Entrada (Matriz) ---
  dataSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'JetBrainsMono', // --- CAMBIO ---
    fontSize: 11,
    color: colors.textSecondary,
    backgroundColor: colors.bgGray,
    padding: 16,
    borderRadius: 8,
  },
  // --- CAMBIO ---
  // Añadimos "corchetes" para la matriz y el vector
  bracket: {
    fontSize: 64, // Tamaño grande para el corchete
    color: colors.borderGray,
    fontFamily: 'Helvetica', // Los corchetes suelen verse bien en Helvetica
  },
  matrixView: {
    paddingHorizontal: 8,
  },
  matrixRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  matrixCell: {
    width: 60,
    textAlign: 'right',
    color: colors.textSecondary,
  },
  separator: {
    borderRightWidth: 1,
    borderRightColor: colors.borderGray,
    height: '100%',
    marginHorizontal: 12,
  },
  vectorView: {
    paddingHorizontal: 8,
  },
  vectorCell: {
    width: 60,
    textAlign: 'right',
    marginBottom: 4,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: 'JetBrainsMono', // --- CAMBIO ---
  },

  // --- Tabla de Iteraciones ---
  table: {
    // La tarjeta 'card' proporciona el borde y borderRadius
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary, // Fondo oscuro
    borderBottomWidth: 0,
    // --- CAMBIO ---
    // Evita que la cabecera se separe de la tabla
    wrap: false,
  },
  tableHeaderCell: {
    padding: 10,
    fontSize: 9,
    fontWeight: 700, // 'bold'
    fontFamily: 'Inter', // --- CAMBIO ---
    textTransform: 'uppercase',
    color: colors.white, // Texto blanco
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    backgroundColor: colors.white,
    // --- CAMBIO ---
    // ¡Esta es la corrección principal para que no se corten las filas!
    wrap: false,
  },
  tableRowAlt: {
    backgroundColor: colors.bgGray,
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    fontFamily: 'JetBrainsMono', // --- CAMBIO ---
    flex: 1,
    color: colors.textSecondary,
  },
  tableCellIndex: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontFamily: 'JetBrainsMono', // --- CAMBIO ---
  },
  // --- Footer ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.textSecondary,
    fontSize: 9,
  },
  footerLogo: {
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'Inter', // --- CAMBIO ---
  },
});

// --- Iconos SVG (Ejemplos) ---
// Puedes obtener los "path" de iconos de https://heroicons.com/ (selecciona uno y "Copy SVG")
// Asegúrate de que el <svg> tenga `viewBox="0 0 24 24"` y el <path> tenga `fill="currentColor"`

const IconResumen = () => (
  <Svg viewBox="0 0 20 20" style={{ width: 16, height: 16, color: colors.primary }}>
    <Path
      fillRule="evenodd"
      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
    />
    <Path d="M5 9h10v1H5V9zM5 7h10v1H5V7zM5 11h6v1H5v-1z" />
  </Svg>
);

const IconSolucion = () => (
  <Svg viewBox="0 0 20 20" style={{ width: 16, height: 16, color: colors.primary }}>
    <Path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
    />
  </Svg>
);

const IconDatos = () => (
  <Svg viewBox="0 0 20 20" style={{ width: 16, height: 16, color: colors.primary }}>
    <Path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5 11a1 1 0 100 2h4a1 1 0 100-2H5zM3 15a1 1 0 100 2h14a1 1 0 100-2H3z" />
  </Svg>
);

const IconTabla = () => (
  <Svg viewBox="0 0 20 20" style={{ width: 16, height: 16, color: colors.primary }}>
    <Path
      fillRule="evenodd"
      d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 3a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V7z"
    />
    <Path d="M5 8h10v1H5V8zm0 2h10v1H5v-1zm0 2h4v1H5v-1z" />
  </Svg>
);


// --- Componente del Documento ---
export const ReportePDF: React.FC<ReportePDFProps> = ({ solutionData }) => {
  const {
    method,
    status,
    iterations,
    finalError,
    solution,
    matrix,
    vector,
    iterationTable,
  } = solutionData;

  const date = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document title={`FluxSolver Reporte - ${date}`}>
      <Page size="A4" style={styles.page}>
        {/* Formas de fondo */}
        <View style={styles.bgShapeTop} fixed />
        <View style={styles.bgShapeBottom} fixed />

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Encabezado */}
          <View style={styles.header} fixed>
            <View style={styles.headerTitleBlock}>
              <Text style={styles.title}>Reporte de Solución</Text>
              <Text style={styles.subtitle}>
                Generado por FluxSolver el {date}
              </Text>
            </View>
            <View style={styles.headerColorBlock} />
          </View>

          {/* Resumen (Card 1) */}
          <View style={styles.card} wrap={false}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                {/* --- CAMBIO --- */}
                <IconResumen />
              </View>
              <Text style={styles.sectionTitle}>Resumen de la Resolución</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Estado</Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      status !== 'Convergió' ? styles.statusBadgeError : {},
                    ]}
                  >
                    {status}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Método</Text>
                  <Text style={styles.value}>{method}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Iteraciones</Text>
                  <Text style={styles.value}>{iterations}</Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.label}>Error Final</Text>
                  <Text style={styles.value}>
                    {finalError.toExponential(4)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Solución Final (Card 2 - Nueva) */}
          <View style={[styles.card, styles.solutionCard]} wrap={false}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                {/* --- CAMBIO --- */}
                <IconSolucion />
              </View>
              <Text style={styles.sectionTitle}>Solución Final (x)</Text>
            </View>
            <View style={[styles.cardContent, styles.solutionContent]}>
              {solution.map((val, i) => (
                <View key={i} style={styles.solutionItem}>
                  <Text style={styles.solutionLabel}>x{i + 1}</Text>
                  <Text style={styles.solutionValue}>{val.toFixed(6)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Datos de Entrada (Card 3) */}
          <View style={styles.card} wrap={false}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                {/* --- CAMBIO --- */}
                <IconDatos />
              </View>
              <Text style={styles.sectionTitle}>Datos de Entrada (A | b)</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.dataSection}>
                {/* --- CAMBIO --- Añadido corchete de apertura */}
                <Text style={styles.bracket}>[</Text>

                {/* Matriz A */}
                <View style={styles.matrixView}>
                  {matrix.map((row, rIdx) => (
                    <View key={rIdx} style={styles.matrixRow}>
                      {row.map((val, cIdx) => (
                        <Text key={cIdx} style={styles.matrixCell}>
                          {val.toFixed(4)}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
                
                {/* Separador */}
                <View style={styles.separator} />
                
                {/* Vector b */}
                <View style={styles.vectorView}>
                  {vector.map((val, rIdx) => (
                    <Text key={rIdx} style={styles.vectorCell}>
                      {val.toFixed(4)}
                    </Text>
                  ))}
                </View>

                {/* --- CAMBIO --- Añadido corchete de cierre */}
                <Text style={styles.bracket}>]</Text>
              </View>
            </View>
          </View>

          {/* Tabla de Iteraciones (Card 4) */}
          {/* --- CAMBIO --- 
            Añadimos `break` aquí si la tabla es MUY larga y quieres
            que intente empezar en una nueva página si no cabe mucho 
            en la página actual. `wrap={false}` en las filas
            suele ser suficiente.
          */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                 {/* --- CAMBIO --- */}
                <IconTabla />
              </View>
              <Text style={styles.sectionTitle}>Tabla de Iteraciones</Text>
            </View>
            <View style={styles.table}>
              {/* Encabezado de la tabla */}
              <View style={styles.tableHeader}>
                <Text style={{ ...styles.tableHeaderCell, flex: 0.5 }}>k</Text>
                {solution.map((_: number, i: number) => (
                  <Text key={i} style={styles.tableHeaderCell}>
                    x{i + 1}
                  </Text>
                ))}
                <Text style={styles.tableHeaderCell}>Error</Text>
              </View>
              {/* Filas de la tabla */}
              {iterationTable.map((row, index) => (
                <View
                  key={row.k}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                  // --- CAMBIO --- 
                  // `wrap={false}` ya está en `styles.tableRow`
                >
                  <Text
                    style={{
                      ...styles.tableCell,
                      ...styles.tableCellIndex,
                      flex: 0.5,
                    }}
                  >
                    {row.k}
                  </Text>
                  {row.x.map((val: number, i: number) => (
                    <Text key={i} style={styles.tableCell}>
                      {val.toFixed(8)}
                    </Text>
                  ))}
                  <Text style={styles.tableCell}>
                    {row.error.toExponential(4)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLogo}>FluxSolver</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};