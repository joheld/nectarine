import { create } from 'zustand';
import {
  BaseNode,
  ChartType,
  ProfiledColumn,
  ChordRibbon,
  SpiralTrack,
  CelestialOrbit,
  ConstellationLink,
  CurvedTextPath,
  GlyphShape,
  ReconciliationReport,
} from '../engine/types';
import { computeLayout, LayoutBounds } from '../engine/layoutEngine';
import { datasetProfiler, GuardrailCheck, FilterCondition } from '../services/profiler';
import { datasetReconciler } from '../services/reconciler';
import { useMutationStore } from './mutationStore';
import { useLayerStore } from './layerStore';

interface DataState {
  datasetName: string;
  rawRows: Record<string, any>[];
  activeRows: Record<string, any>[];
  profiledColumns: ProfiledColumn[];
  chartType: ChartType;
  defaultGlyphShape: GlyphShape;
  subGroupCol: string;
  mappings: {
    x?: string;
    y?: string;
    category?: string;
    subCategory?: string;
    size?: string;
  };
  baseNodes: BaseNode[];
  voronoiCells: Map<string, string>;
  chordRibbons: ChordRibbon[];
  spiralTrack: SpiralTrack | null;
  celestialOrbits: CelestialOrbit[];
  constellationLinks: ConstellationLink[];
  curvedTextPaths: CurvedTextPath[];
  axes: {
    xTicks: { value: string | number; x: number }[];
    yTicks: { value: string | number; y: number }[];
  };
  layoutBounds: LayoutBounds;
  guardrailCheck: GuardrailCheck | null;
  isGuardrailModalOpen: boolean;
  activeFilters: FilterCondition[];
  filterConjunction: 'AND' | 'OR';
  lastReconciliation: ReconciliationReport | null;

  // Actions
  loadDataset: (name: string, rows: Record<string, any>[]) => void;
  reconcileDataset: (name: string, rows: Record<string, any>[], matchKey?: string) => ReconciliationReport;
  clearReconciliationReport: () => void;
  setDefaultGlyphShape: (shape: GlyphShape) => void;
  setSubGroupCol: (col: string) => void;
  setChartType: (type: ChartType) => void;
  setMappings: (mappings: Partial<DataState['mappings']>) => void;
  setLayoutBounds: (bounds: LayoutBounds) => void;
  recalculateLayout: () => void;
  applyFilter: (column: string, operator: '>' | '<' | '>=' | '<=' | '=' | '!=' | 'contains', value: any) => void;
  applyMultiFilter: (conditions: FilterCondition[], conjunction?: 'AND' | 'OR') => void;
  applyGroupBy: (groupCol: string, metricCol: string, op: 'sum' | 'mean' | 'count' | 'max' | 'min') => void;
  applyTopN: (metricCol: string, n?: number) => void;
  resetTransforms: () => void;
  dismissGuardrail: () => void;
}

const DEFAULT_BOUNDS: LayoutBounds = {
  width: 960,
  height: 640,
  padding: { top: 40, right: 40, bottom: 60, left: 70 },
};

export const useDataStore = create<DataState>((set, get) => ({
  datasetName: '',
  rawRows: [],
  activeRows: [],
  profiledColumns: [],
  chartType: 'scatter',
  defaultGlyphShape: 'circle',
  subGroupCol: '',
  mappings: {},
  baseNodes: [],
  voronoiCells: new Map(),
  chordRibbons: [],
  spiralTrack: null,
  celestialOrbits: [],
  constellationLinks: [],
  curvedTextPaths: [],
  axes: { xTicks: [], yTicks: [] },
  layoutBounds: DEFAULT_BOUNDS,
  guardrailCheck: null,
  isGuardrailModalOpen: false,
  activeFilters: [],
  filterConjunction: 'AND',
  lastReconciliation: null,

  clearReconciliationReport: () => {
    set({ lastReconciliation: null });
  },

  setDefaultGlyphShape: (shape: GlyphShape) => {
    set({ defaultGlyphShape: shape });
    get().recalculateLayout();
  },

  loadDataset: (name, rows) => {
    const profiled = datasetProfiler.profileColumns(rows);
    const compatibilities = datasetProfiler.evaluateCompatibility(profiled, rows.length);
    const firstCompatible = compatibilities.find((c) => c.isCompatible)?.type || 'scatter';
    const suggested = compatibilities.find((c) => c.type === firstCompatible)?.suggestedMappings || {};

    const guardrail = datasetProfiler.checkPerformance(rows.length);

    // Limpiar mutaciones previas, historial y anotaciones al cargar un nuevo dataset
    useMutationStore.getState().resetAllMutations();
    useMutationStore.getState().clearHistory();
    useLayerStore.getState().clearAnnotations();

    set({
      datasetName: name,
      rawRows: rows,
      activeRows: rows,
      activeFilters: [],
      filterConjunction: 'AND',
      profiledColumns: profiled,
      chartType: firstCompatible,
      subGroupCol: '',
      mappings: {
        x: suggested.x || profiled.find((c) => c.type === 'number')?.name,
        y: suggested.y || profiled.filter((c) => c.type === 'number')[1]?.name,
        category: suggested.category || profiled.find((c) => c.type === 'string')?.name,
        size: suggested.size,
      },
      guardrailCheck: guardrail.isExceeded ? guardrail : null,
      isGuardrailModalOpen: guardrail.isExceeded,
      lastReconciliation: null,
    });

    get().recalculateLayout();
  },

  reconcileDataset: (name, rows, matchKey) => {
    const { rawRows: oldRows, baseNodes: oldBaseNodes, chartType, mappings, layoutBounds, defaultGlyphShape } = get();
    const currentMutations = useMutationStore.getState().mutations;
    const currentAnnotations = useLayerStore.getState().annotations;

    const profiled = datasetProfiler.profileColumns(rows);
    const guardrail = datasetProfiler.checkPerformance(rows.length);

    // Compute raw new base nodes with current chart type & mappings
    const layoutResult = computeLayout(chartType, rows, mappings, layoutBounds);
    const newBaseNodes = layoutResult.nodes.map((n) => ({
      ...n,
      glyphShape: defaultGlyphShape,
    }));

    // Run reconciliation diffing
    const reconcileResult = datasetReconciler.reconcile({
      oldRows,
      newRows: rows,
      oldBaseNodes,
      newBaseNodes,
      currentMutations,
      currentAnnotations,
      specifiedKey: matchKey,
    });

    // Update mutations with reconciled set
    useMutationStore.setState({
      mutations: reconcileResult.reconciledMutations,
      selectedNodeIds: [],
    });

    // Update layer annotations with re-anchored set
    useLayerStore.setState({
      annotations: reconcileResult.reconciledAnnotations,
    });

    set({
      datasetName: name,
      rawRows: rows,
      activeRows: rows,
      activeFilters: [],
      filterConjunction: 'AND',
      profiledColumns: profiled,
      baseNodes: newBaseNodes,
      voronoiCells: layoutResult.voronoiPolygons || new Map(),
      chordRibbons: layoutResult.chordRibbons || [],
      spiralTrack: layoutResult.spiralTrack || null,
      celestialOrbits: layoutResult.celestialOrbits || [],
      constellationLinks: layoutResult.constellationLinks || [],
      curvedTextPaths: layoutResult.curvedTextPaths || [],
      axes: layoutResult.axes,
      guardrailCheck: guardrail.isExceeded ? guardrail : null,
      isGuardrailModalOpen: guardrail.isExceeded,
      lastReconciliation: reconcileResult.report,
    });

    return reconcileResult.report;
  },

  setChartType: (type) => {
    const { profiledColumns } = get();
    const compat = datasetProfiler.evaluateCompatibility(profiledColumns, get().activeRows.length);
    const chartInfo = compat.find((c) => c.type === type);
    if (chartInfo?.suggestedMappings) {
      set((state) => ({
        chartType: type,
        mappings: {
          ...state.mappings,
          ...chartInfo.suggestedMappings,
        },
      }));
    } else {
      set({ chartType: type });
    }
    get().recalculateLayout();
  },

  setMappings: (newMappings) => {
    set((state) => ({
      mappings: { ...state.mappings, ...newMappings },
    }));
    get().recalculateLayout();
  },

  setSubGroupCol: (col) => {
    set((state) => ({
      subGroupCol: col,
      mappings: {
        ...state.mappings,
        subCategory: col || undefined,
      },
    }));
    get().recalculateLayout();
  },

  setLayoutBounds: (bounds) => {
    set({ layoutBounds: bounds });
    get().recalculateLayout();
  },

  recalculateLayout: () => {
    const { chartType, activeRows, mappings, layoutBounds, defaultGlyphShape, subGroupCol } = get();
    if (activeRows.length === 0) return;

    const effectiveMappings = {
      ...mappings,
      subCategory: subGroupCol || mappings.subCategory || undefined,
    };

    const result = computeLayout(chartType, activeRows, effectiveMappings, layoutBounds);
    const nodesWithGlyph = result.nodes.map((node) => ({
      ...node,
      glyphShape: node.glyphShape || defaultGlyphShape,
    }));
    set({
      baseNodes: nodesWithGlyph,
      voronoiCells: result.voronoiPolygons || new Map(),
      chordRibbons: result.chordRibbons || [],
      spiralTrack: result.spiralTrack || null,
      celestialOrbits: result.celestialOrbits || [],
      constellationLinks: result.constellationLinks || [],
      curvedTextPaths: result.curvedTextPaths || [],
      axes: result.axes,
    });
  },

  applyMultiFilter: (conditions, conjunction = 'AND') => {
    const { rawRows } = get();
    const filtered = datasetProfiler.transformMultiFilter(rawRows, conditions, conjunction);
    set({
      activeRows: filtered,
      activeFilters: conditions,
      filterConjunction: conjunction,
    });
    get().recalculateLayout();
  },

  applyFilter: (column, operator, value) => {
    get().applyMultiFilter([{ id: `f-${Date.now()}`, column, operator, value }], 'AND');
  },

  applyGroupBy: (groupCol, metricCol, op) => {
    const { rawRows } = get();
    const aggregated = datasetProfiler.transformGroupBy(rawRows, groupCol, metricCol, op);
    set({
      activeRows: aggregated,
      chartType: 'bar',
      mappings: {
        category: groupCol,
        y: metricCol,
      },
    });
    get().recalculateLayout();
  },

  applyTopN: (metricCol, n = 15) => {
    const { rawRows } = get();
    const top = datasetProfiler.transformTopN(rawRows, metricCol, n, false);
    set({ activeRows: top });
    get().recalculateLayout();
  },

  resetTransforms: () => {
    const { rawRows } = get();
    set({
      activeRows: rawRows,
      activeFilters: [],
    });
    get().recalculateLayout();
  },

  dismissGuardrail: () => {
    set({ isGuardrailModalOpen: false });
  },
}));
