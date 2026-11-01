export type DataType = 'number' | 'string' | 'date' | 'boolean';

export interface ProfiledColumn {
  name: string;
  type: DataType;
  distinctCount: number;
  nullCount: number;
  min?: number;
  max?: number;
  sampleValues: (string | number | boolean)[];
}

export type ChartType = 'scatter' | 'bubble' | 'bar' | 'network' | 'voronoi' | 'stream';

export interface ChartCompatibility {
  type: ChartType;
  name: string;
  description: string;
  isCompatible: boolean;
  reason?: string;
  suggestedMappings: {
    x?: string;
    y?: string;
    category?: string;
    size?: string;
  };
}

export interface BaseNode {
  id: string;
  rawIndex: number;
  mathX: number;
  mathY: number;
  mathR: number;
  category: string;
  label: string;
  valueX?: number;
  valueY?: number;
  valueSize?: number;
  metadata: Record<string, any>;
}

export interface NodeMutation {
  id: string;
  customX?: number;
  customY?: number;
  customR?: number;
  customFill?: string;
  customStroke?: string;
  customOpacity?: number;
  // Cubic Bézier control points relative to node center
  cp1x?: number;
  cp1y?: number;
  cp2x?: number;
  cp2y?: number;
  isPinned: boolean;
  manualScale: number; // 1.0 = normal
}

export interface SemanticLayer {
  category: string;
  nodeIds: string[];
  color: string;
  isVisible: boolean;
  isLocked: boolean;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'color-dodge';
}

export interface TetheredAnnotation {
  id: string;
  targetNodeId: string;
  text: string;
  dx: number;
  dy: number;
  curveType: 'straight' | 'bezier' | 'arc';
  customCpX?: number;
  customCpY?: number;
}

export interface VisualTransformation {
  type: 'filter' | 'groupby' | 'binning' | 'top_n';
  column: string;
  params: Record<string, any>;
}

export interface DistortionMetric {
  nodeId: string;
  positionDeltaPx: number;
  distortionPct: number;
  isDistorted: boolean;
}
