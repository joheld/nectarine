import { ProfiledColumn, ChartCompatibility, DataType } from '../engine/types';

export const PERFORMANCE_NODE_THRESHOLD = 10000;

export interface GuardrailCheck {
  isExceeded: boolean;
  nodeCount: number;
  threshold: number;
  message: string;
  mitigationOptions: {
    id: 'aggregate' | 'sample' | 'simplified';
    title: string;
    description: string;
  }[];
}

class DatasetProfiler {
  /**
   * Analyzes loaded columns: data types, cardinality, ranges, null counts
   */
  public profileColumns(rows: Record<string, any>[]): ProfiledColumn[] {
    if (!rows || rows.length === 0) return [];

    const keys = Object.keys(rows[0]);
    return keys.map((key) => {
      let nullCount = 0;
      const values: any[] = [];
      let isNumeric = true;
      let isDate = true;
      let isBoolean = true;

      for (let i = 0; i < rows.length; i++) {
        const val = rows[i][key];
        if (val === null || val === undefined || val === '') {
          nullCount++;
          continue;
        }

        values.push(val);

        if (typeof val !== 'number' && isNaN(Number(val))) {
          isNumeric = false;
        }
        if (typeof val !== 'boolean') {
          isBoolean = false;
        }
        if (isNaN(Date.parse(String(val)))) {
          isDate = false;
        }
      }

      let type: DataType = 'string';
      if (isBoolean && values.length > 0) {
        type = 'boolean';
      } else if (isNumeric && values.length > 0) {
        type = 'number';
      } else if (isDate && values.length > 0 && typeof values[0] === 'string' && values[0].length >= 8) {
        type = 'date';
      }

      const distinctSet = new Set(values);
      const numericValues = isNumeric ? values.map(Number).filter((n) => !isNaN(n)) : [];

      return {
        name: key,
        type,
        distinctCount: distinctSet.size,
        nullCount,
        min: numericValues.length > 0 ? Math.min(...numericValues) : undefined,
        max: numericValues.length > 0 ? Math.max(...numericValues) : undefined,
        sampleValues: values.slice(0, 5),
      };
    });
  }

  /**
   * Evaluates chart compatibility based on column types and requirements
   */
  public evaluateCompatibility(columns: ProfiledColumn[], rowCount: number): ChartCompatibility[] {
    const numericCols = columns.filter((c) => c.type === 'number');
    const categoricalCols = columns.filter((c) => c.type === 'string' || c.type === 'boolean');

    // Pick best grouping category column (prioritize low cardinality like 'region', 'categoria', 'cluster')
    const bestCategoryCol =
      categoricalCols
        .slice()
        .sort((a, b) => a.distinctCount - b.distinctCount)
        .find((c) => c.distinctCount >= 2 && c.distinctCount <= Math.max(2, rowCount * 0.7))?.name ||
      categoricalCols[1]?.name ||
      categoricalCols[0]?.name;

    const charts: ChartCompatibility[] = [
      {
        type: 'scatter',
        name: 'Dispersión Cartesiana',
        description: 'Correlación continua entre dos dimensiones cuantitativas.',
        isCompatible: numericCols.length >= 2,
        reason: numericCols.length < 2 ? 'Requiere al menos 2 columnas numéricas para los ejes X e Y.' : undefined,
        suggestedMappings: {
          x: numericCols[0]?.name,
          y: numericCols[1]?.name,
          category: bestCategoryCol,
        },
      },
      {
        type: 'bubble',
        name: 'Burbujas Paramétricas',
        description: 'Visualización tridimensional con escala métrica de radio.',
        isCompatible: numericCols.length >= 2,
        reason: numericCols.length < 2 ? 'Requiere al menos 2 columnas numéricas para posición y 1 para radio.' : undefined,
        suggestedMappings: {
          x: numericCols[0]?.name,
          y: numericCols[1]?.name,
          size: numericCols[2]?.name || numericCols[0]?.name,
          category: bestCategoryCol,
        },
      },
      {
        type: 'bar',
        name: 'Barras Categóricas',
        description: 'Agrupación ordinal o nominal por dimensiones discretas.',
        isCompatible: categoricalCols.length >= 1,
        reason: categoricalCols.length < 1 ? 'Requiere al menos una columna categórica para agrupar.' : undefined,
        suggestedMappings: {
          category: bestCategoryCol,
          y: numericCols[0]?.name,
        },
      },
      {
        type: 'voronoi',
        name: 'Telas de Voronoi',
        description: 'Partición espacial geométrica de Delaunay sobre puntos dispersos.',
        isCompatible: numericCols.length >= 2 && rowCount >= 3,
        reason: numericCols.length < 2 || rowCount < 3 ? 'Requiere mínimo 2 columnas numéricas y al menos 3 nodos.' : undefined,
        suggestedMappings: {
          x: numericCols[0]?.name,
          y: numericCols[1]?.name,
          category: bestCategoryCol,
        },
      },
      {
        type: 'network',
        name: 'Fuerzas & Clústeres',
        description: 'Simulación física de muchos cuerpos para análisis de comunidades.',
        isCompatible: rowCount >= 2,
        reason: rowCount < 2 ? 'Requiere al menos 2 registros.' : undefined,
        suggestedMappings: {
          category: bestCategoryCol,
        },
      },
      {
        type: 'stream',
        name: 'Flujo Continuo (Streamgraph)',
        description: 'Rutas vectoriales orgánicas apiladas por capas categóricas.',
        isCompatible: categoricalCols.length >= 1 && numericCols.length >= 1,
        reason: categoricalCols.length < 1 || numericCols.length < 1 ? 'Requiere dimensión categórica y métrica cuantitativa.' : undefined,
        suggestedMappings: {
          category: bestCategoryCol,
          y: numericCols[0]?.name,
        },
      },
      {
        type: 'chord',
        name: 'Cuerdas Radiales (Visual Cinnamon)',
        description: 'Relaciones circulares complejas unidas por cintas fluidas con texto en trayectoria.',
        isCompatible: rowCount >= 2,
        reason: rowCount < 2 ? 'Requiere al menos 2 registros.' : undefined,
        suggestedMappings: {
          category: bestCategoryCol,
          y: numericCols[0]?.name,
        },
      },
      {
        type: 'spiral',
        name: 'Espiral Áurea (Spiraling Time)',
        description: 'Evolución cíclica continua de Arquímedes con radio y ángulo métricos.',
        isCompatible: rowCount >= 3,
        reason: rowCount < 3 ? 'Requiere al menos 3 registros para trazar el espiral.' : undefined,
        suggestedMappings: {
          category: bestCategoryCol,
          y: numericCols[0]?.name,
        },
      },
      {
        type: 'celestial',
        name: 'Mapa Celestial & Constelaciones',
        description: 'Órbitas elípticas inclinadas con estrellas relucientes y enlaces constelares.',
        isCompatible: rowCount >= 2,
        reason: rowCount < 2 ? 'Requiere al menos 2 registros.' : undefined,
        suggestedMappings: {
          category: bestCategoryCol,
          y: numericCols[0]?.name,
        },
      },
    ];

    return charts;
  }

  /**
   * Performance Guardrail Interceptor: checks if node count exceeds 10,000 SVG elements
   */
  public checkPerformance(nodeCount: number): GuardrailCheck {
    const isExceeded = nodeCount > PERFORMANCE_NODE_THRESHOLD;
    return {
      isExceeded,
      nodeCount,
      threshold: PERFORMANCE_NODE_THRESHOLD,
      message: `La consulta actual proyecta ${nodeCount.toLocaleString()} nodos SVG. Renderizar más de 10,000 vectores simultáneos puede degradar los 60 FPS en el canvas interactivo.`,
      mitigationOptions: [
        {
          id: 'aggregate',
          title: 'Agregación Previa Semántica',
          description: 'Agrupa los datos por dimensión categórica calculando la media o suma para reducir a cientos de vectores.',
        },
        {
          id: 'sample',
          title: 'Muestreo Representativo (Top 2,000)',
          description: 'Conserva la distribución estadística cargando los registros más representativos.',
        },
        {
          id: 'simplified',
          title: 'Vista Vectorial Simplificada',
          description: 'Desactiva efectos visuales pesados (filtros de sombra y Voronoi en tiempo real) y renderiza nodos ligeros.',
        },
      ],
    };
  }

  /**
   * Non-SQL Visual Transformation: Group By and Aggregate
   */
  public transformGroupBy(
    rows: Record<string, any>[],
    groupCol: string,
    metricCol: string,
    operation: 'sum' | 'mean' | 'count' | 'max' | 'min'
  ): Record<string, any>[] {
    const groups = new Map<string, number[]>();

    for (const row of rows) {
      const key = String(row[groupCol] ?? 'Other');
      const val = Number(row[metricCol]) || 0;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(val);
    }

    const aggregated: Record<string, any>[] = [];
    groups.forEach((vals, group) => {
      let computed = 0;
      if (operation === 'count') computed = vals.length;
      else if (operation === 'sum') computed = vals.reduce((a, b) => a + b, 0);
      else if (operation === 'mean') computed = vals.reduce((a, b) => a + b, 0) / vals.length;
      else if (operation === 'max') computed = Math.max(...vals);
      else if (operation === 'min') computed = Math.min(...vals);

      aggregated.push({
        [groupCol]: group,
        [metricCol]: Number(computed.toFixed(2)),
        count: vals.length,
      });
    });

    return aggregated;
  }

  /**
   * Non-SQL Visual Transformation: Filter Range or Value
   */
  public transformFilter(
    rows: Record<string, any>[],
    column: string,
    operator: '>' | '<' | '=' | '!=' | 'contains',
    filterValue: any
  ): Record<string, any>[] {
    return rows.filter((row) => {
      const val = row[column];
      if (operator === '>') return Number(val) > Number(filterValue);
      if (operator === '<') return Number(val) < Number(filterValue);
      if (operator === '=') return String(val).toLowerCase() === String(filterValue).toLowerCase();
      if (operator === '!=') return String(val).toLowerCase() !== String(filterValue).toLowerCase();
      if (operator === 'contains') return String(val).toLowerCase().includes(String(filterValue).toLowerCase());
      return true;
    });
  }

  /**
   * Non-SQL Visual Transformation: Top N by Metric
   */
  public transformTopN(
    rows: Record<string, any>[],
    metricCol: string,
    n = 20,
    ascending = false
  ): Record<string, any>[] {
    const sorted = [...rows].sort((a, b) => {
      const valA = Number(a[metricCol]) || 0;
      const valB = Number(b[metricCol]) || 0;
      return ascending ? valA - valB : valB - valA;
    });
    return sorted.slice(0, n);
  }
}

export const datasetProfiler = new DatasetProfiler();
