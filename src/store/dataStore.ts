import { create } from 'zustand';
import { BaseNode, ChartType, ProfiledColumn } from '../engine/types';
import { computeLayout, LayoutBounds } from '../engine/layoutEngine';
import { datasetProfiler, GuardrailCheck } from '../services/profiler';

interface DataState {
  datasetName: string;
  rawRows: Record<string, any>[];
  activeRows: Record<string, any>[];
  profiledColumns: ProfiledColumn[];
  chartType: ChartType;
  mappings: {
    x?: string;
    y?: string;
    category?: string;
    size?: string;
  };
  baseNodes: BaseNode[];
  voronoiCells: Map<string, string>;
  axes: {
    xTicks: { value: string | number; x: number }[];
    yTicks: { value: string | number; y: number }[];
  };
  layoutBounds: LayoutBounds;
  guardrailCheck: GuardrailCheck | null;
  isGuardrailModalOpen: boolean;

  // Actions
  loadDataset: (name: string, rows: Record<string, any>[]) => void;
  setChartType: (type: ChartType) => void;
  setMappings: (mappings: Partial<DataState['mappings']>) => void;
  setLayoutBounds: (bounds: LayoutBounds) => void;
  recalculateLayout: () => void;
  applyFilter: (column: string, operator: '>' | '<' | '=' | '!=', value: any) => void;
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
  datasetName: 'world_development.csv',
  rawRows: [],
  activeRows: [],
  profiledColumns: [],
  chartType: 'scatter',
  mappings: {
    x: 'gdp_per_capita',
    y: 'life_expectancy',
    size: 'population_millions',
    category: 'region',
  },
  baseNodes: [],
  voronoiCells: new Map(),
  axes: { xTicks: [], yTicks: [] },
  layoutBounds: DEFAULT_BOUNDS,
  guardrailCheck: null,
  isGuardrailModalOpen: false,

  loadDataset: (name, rows) => {
    const profiled = datasetProfiler.profileColumns(rows);
    const compatibilities = datasetProfiler.evaluateCompatibility(profiled, rows.length);
    const firstCompatible = compatibilities.find((c) => c.isCompatible)?.type || 'scatter';
    const suggested = compatibilities.find((c) => c.type === firstCompatible)?.suggestedMappings || {};

    const guardrail = datasetProfiler.checkPerformance(rows.length);

    set({
      datasetName: name,
      rawRows: rows,
      activeRows: rows,
      profiledColumns: profiled,
      chartType: firstCompatible,
      mappings: {
        x: suggested.x || profiled.find((c) => c.type === 'number')?.name,
        y: suggested.y || profiled.filter((c) => c.type === 'number')[1]?.name,
        category: suggested.category || profiled.find((c) => c.type === 'string')?.name,
        size: suggested.size,
      },
      guardrailCheck: guardrail.isExceeded ? guardrail : null,
      isGuardrailModalOpen: guardrail.isExceeded,
    });

    get().recalculateLayout();
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

  setLayoutBounds: (bounds) => {
    set({ layoutBounds: bounds });
    get().recalculateLayout();
  },

  recalculateLayout: () => {
    const { chartType, activeRows, mappings, layoutBounds } = get();
    if (activeRows.length === 0) return;

    const result = computeLayout(chartType, activeRows, mappings, layoutBounds);
    set({
      baseNodes: result.nodes,
      voronoiCells: result.voronoiPolygons || new Map(),
      axes: result.axes,
    });
  },

  applyFilter: (column, operator, value) => {
    const { rawRows } = get();
    const filtered = datasetProfiler.transformFilter(rawRows, column, operator, value);
    set({ activeRows: filtered });
    get().recalculateLayout();
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
    set({ activeRows: rawRows });
    get().recalculateLayout();
  },

  dismissGuardrail: () => {
    set({ isGuardrailModalOpen: false });
  },
}));
