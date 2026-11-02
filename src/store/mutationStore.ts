import { create } from 'zustand';
import { NodeMutation, DistortionMetric, BaseNode, GlyphShape } from '../engine/types';

interface MutationState {
  mutations: Record<string, NodeMutation>;
  selectedNodeIds: string[];
  activeTool: 'pan' | 'select' | 'move' | 'bezier' | 'annotate';
  hoveredNodeId: string | null;

  // History Stacks for ⌘Z / ⌘⇧Z
  undoStack: Record<string, NodeMutation>[];
  redoStack: Record<string, NodeMutation>[];
  recordSnapshot: () => void;
  undo: () => boolean;
  redo: () => boolean;
  clearHistory: () => void;

  // Actions
  selectNode: (id: string, multiSelect?: boolean) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setHoveredNode: (id: string | null) => void;
  setActiveTool: (tool: MutationState['activeTool']) => void;

  updatePosition: (id: string, x: number, y: number, pinNode?: boolean) => void;
  updateBezierHandles: (id: string, cp1x: number, cp1y: number, cp2x: number, cp2y: number) => void;
  resetBezierHandles: (id: string) => void;
  updateFill: (id: string, fill: string) => void;
  batchUpdateFill: (ids: string[], fill: string) => void;
  updateGlyphShape: (id: string, shape: GlyphShape) => void;
  batchUpdateGlyphShape: (ids: string[], shape: GlyphShape) => void;
  updateRadius: (id: string, r: number) => void;
  setManualScale: (id: string, scale: number) => void;
  togglePin: (id: string) => void;
  resetMutation: (id: string) => void;
  resetAllMutations: () => void;

  isGlowEnabled: boolean;
  toggleGlow: () => void;

  // Distortion evaluation helper
  calculateDistortion: (baseNode: BaseNode) => DistortionMetric;
}

export const useMutationStore = create<MutationState>((set, get) => ({
  mutations: {},
  selectedNodeIds: [],
  activeTool: 'select',
  hoveredNodeId: null,
  isGlowEnabled: true,

  undoStack: [],
  redoStack: [],

  recordSnapshot: () => {
    const current = get().mutations;
    set((state) => ({
      undoStack: [...state.undoStack.slice(-39), JSON.parse(JSON.stringify(current))],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack, mutations } = get();
    if (undoStack.length === 0) return false;
    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    set((state) => ({
      undoStack: newUndoStack,
      redoStack: [JSON.parse(JSON.stringify(mutations)), ...state.redoStack.slice(0, 39)],
      mutations: previous,
    }));
    return true;
  },

  redo: () => {
    const { redoStack, mutations } = get();
    if (redoStack.length === 0) return false;
    const next = redoStack[0];
    const newRedoStack = redoStack.slice(1);
    set((state) => ({
      undoStack: [...state.undoStack.slice(-39), JSON.parse(JSON.stringify(mutations))],
      redoStack: newRedoStack,
      mutations: next,
    }));
    return true;
  },

  clearHistory: () => {
    set({ undoStack: [], redoStack: [] });
  },

  toggleGlow: () => {
    set((state) => ({ isGlowEnabled: !state.isGlowEnabled }));
  },

  selectNode: (id, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        const exists = state.selectedNodeIds.includes(id);
        return {
          selectedNodeIds: exists
            ? state.selectedNodeIds.filter((nodeId) => nodeId !== id)
            : [...state.selectedNodeIds, id],
        };
      }
      return { selectedNodeIds: [id] };
    });
  },

  selectAll: (ids) => {
    set({ selectedNodeIds: ids });
  },

  clearSelection: () => {
    set({ selectedNodeIds: [] });
  },

  setHoveredNode: (id) => {
    set({ hoveredNodeId: id });
  },

  setActiveTool: (tool) => {
    set({ activeTool: tool });
  },

  updatePosition: (id, x, y, pinNode = true) => {
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: pinNode, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            customX: x,
            customY: y,
            isPinned: pinNode ? true : existing.isPinned,
          },
        },
      };
    });
  },

  updateBezierHandles: (id, cp1x, cp1y, cp2x, cp2y) => {
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: false, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            cp1x,
            cp1y,
            cp2x,
            cp2y,
          },
        },
      };
    });
  },

  resetBezierHandles: (id) => {
    get().recordSnapshot();
    set((state) => {
      const existing = state.mutations[id];
      if (!existing) return state;
      const { cp1x: _1, cp1y: _2, cp2x: _3, cp2y: _4, ...rest } = existing;
      return {
        mutations: {
          ...state.mutations,
          [id]: rest,
        },
      };
    });
  },

  updateFill: (id, fill) => {
    get().recordSnapshot();
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: false, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            customFill: fill,
          },
        },
      };
    });
  },

  batchUpdateFill: (ids, fill) => {
    get().recordSnapshot();
    set((state) => {
      const nextMutations = { ...state.mutations };
      ids.forEach((id) => {
        const existing = nextMutations[id] || { id, isPinned: false, manualScale: 1.0 };
        nextMutations[id] = {
          ...existing,
          customFill: fill,
        };
      });
      return { mutations: nextMutations };
    });
  },

  updateGlyphShape: (id, shape) => {
    get().recordSnapshot();
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: false, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            glyphShape: shape,
          },
        },
      };
    });
  },

  batchUpdateGlyphShape: (ids, shape) => {
    get().recordSnapshot();
    set((state) => {
      const nextMutations = { ...state.mutations };
      ids.forEach((id) => {
        const existing = nextMutations[id] || { id, isPinned: false, manualScale: 1.0 };
        nextMutations[id] = {
          ...existing,
          glyphShape: shape,
        };
      });
      return { mutations: nextMutations };
    });
  },

  updateRadius: (id, r) => {
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: false, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            customR: r,
          },
        },
      };
    });
  },

  setManualScale: (id, scale) => {
    get().recordSnapshot();
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: false, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            manualScale: scale,
          },
        },
      };
    });
  },

  togglePin: (id) => {
    get().recordSnapshot();
    set((state) => {
      const existing = state.mutations[id] || { id, isPinned: false, manualScale: 1.0 };
      return {
        mutations: {
          ...state.mutations,
          [id]: {
            ...existing,
            isPinned: !existing.isPinned,
          },
        },
      };
    });
  },

  resetMutation: (id) => {
    get().recordSnapshot();
    set((state) => {
      const copy = { ...state.mutations };
      delete copy[id];
      return { mutations: copy };
    });
  },

  resetAllMutations: () => {
    if (Object.keys(get().mutations).length > 0) {
      get().recordSnapshot();
    }
    set({ mutations: {}, selectedNodeIds: [] });
  },

  calculateDistortion: (baseNode: BaseNode): DistortionMetric => {
    const mut = get().mutations[baseNode.id];
    if (!mut) {
      return {
        nodeId: baseNode.id,
        positionDeltaPx: 0,
        distortionPct: 0,
        isDistorted: false,
      };
    }

    const currentX = mut.customX ?? baseNode.mathX;
    const currentY = mut.customY ?? baseNode.mathY;
    const deltaX = currentX - baseNode.mathX;
    const deltaY = currentY - baseNode.mathY;
    const distancePx = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calculate percentage deviation based on scale and Euclidean displacement relative to radius
    const scaleDeviation = Math.abs((mut.manualScale ?? 1.0) - 1.0) * 100;
    const displacementDeviation = (distancePx / Math.max(10, baseNode.mathR * 2)) * 10;
    const totalDistortionPct = Number((scaleDeviation + displacementDeviation).toFixed(1));

    return {
      nodeId: baseNode.id,
      positionDeltaPx: Number(distancePx.toFixed(1)),
      distortionPct: totalDistortionPct,
      isDistorted: totalDistortionPct > 15 || distancePx > 20,
    };
  },
}));
