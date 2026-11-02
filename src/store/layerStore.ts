import { create } from 'zustand';
import { TetheredAnnotation, SemanticLayer } from '../engine/types';

interface LayerState {
  layerOverrides: Record<string, Partial<SemanticLayer>>;
  annotations: TetheredAnnotation[];

  // Actions
  toggleLayerVisibility: (category: string) => void;
  toggleLayerLock: (category: string) => void;
  setLayerColor: (category: string, color: string) => void;
  setLayerBlendMode: (category: string, blendMode: SemanticLayer['blendMode']) => void;

  addAnnotation: (
    targetNodeId: string,
    text: string,
    dx?: number,
    dy?: number,
    curveType?: 'straight' | 'bezier' | 'arc'
  ) => void;
  updateAnnotation: (id: string, updates: Partial<TetheredAnnotation>) => void;
  removeAnnotation: (id: string) => void;
  clearAnnotations: () => void;
}

export const useLayerStore = create<LayerState>((set) => ({
  layerOverrides: {},
  annotations: [],

  toggleLayerVisibility: (category) => {
    set((state) => {
      const existing = state.layerOverrides[category] || { isVisible: true, isLocked: false };
      return {
        layerOverrides: {
          ...state.layerOverrides,
          [category]: {
            ...existing,
            isVisible: existing.isVisible !== false ? false : true,
          },
        },
      };
    });
  },

  toggleLayerLock: (category) => {
    set((state) => {
      const existing = state.layerOverrides[category] || { isVisible: true, isLocked: false };
      return {
        layerOverrides: {
          ...state.layerOverrides,
          [category]: {
            ...existing,
            isLocked: !existing.isLocked,
          },
        },
      };
    });
  },

  setLayerColor: (category, color) => {
    set((state) => {
      const existing = state.layerOverrides[category] || { isVisible: true, isLocked: false };
      return {
        layerOverrides: {
          ...state.layerOverrides,
          [category]: {
            ...existing,
            color,
          },
        },
      };
    });
  },

  setLayerBlendMode: (category, blendMode) => {
    set((state) => {
      const existing = state.layerOverrides[category] || { isVisible: true, isLocked: false };
      return {
        layerOverrides: {
          ...state.layerOverrides,
          [category]: {
            ...existing,
            blendMode,
          },
        },
      };
    });
  },

  addAnnotation: (targetNodeId, text, dx = 35, dy = -40, curveType = 'bezier') => {
    set((state) => ({
      annotations: [
        ...state.annotations,
        {
          id: `ann-${Date.now()}`,
          targetNodeId,
          text,
          dx,
          dy,
          curveType,
        },
      ],
    }));
  },

  updateAnnotation: (id, updates) => {
    set((state) => ({
      annotations: state.annotations.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  removeAnnotation: (id) => {
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
    }));
  },

  clearAnnotations: () => {
    set({ annotations: [] });
  },
}));
