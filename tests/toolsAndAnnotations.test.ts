import { describe, expect, it, beforeEach } from 'bun:test';
import { useMutationStore } from '../src/store/mutationStore';
import { useLayerStore } from '../src/store/layerStore';
import { useDataStore } from '../src/store/dataStore';
import { buildClosedOrganicBezierPath, generateOrganicBezierHandles } from '../src/engine/bezierMath';

describe('Canvas Tools, Hand/Pan & Dynamic Annotations Suite', () => {
  beforeEach(() => {
    useMutationStore.getState().resetAllMutations();
    useLayerStore.getState().clearAnnotations();
  });

  it('initializes annotations as an empty list (no hardcoded sample comments)', () => {
    const annotations = useLayerStore.getState().annotations;
    expect(annotations).toEqual([]);
    expect(annotations.length).toBe(0);
  });

  it('supports activating all 5 tools: pan, select, move, bezier, annotate', () => {
    const store = useMutationStore.getState();

    store.setActiveTool('pan');
    expect(useMutationStore.getState().activeTool).toBe('pan');

    store.setActiveTool('select');
    expect(useMutationStore.getState().activeTool).toBe('select');

    store.setActiveTool('move');
    expect(useMutationStore.getState().activeTool).toBe('move');

    store.setActiveTool('bezier');
    expect(useMutationStore.getState().activeTool).toBe('bezier');

    store.setActiveTool('annotate');
    expect(useMutationStore.getState().activeTool).toBe('annotate');
  });

  it('builds closed organic Bézier shapes that form complete loops without slicing', () => {
    const radius = 16;
    const handles = generateOrganicBezierHandles(radius);

    expect(handles.cp1x).toBe(0);
    expect(handles.cp1y).toBeCloseTo(-radius * 1.33, 1);
    expect(handles.cp2x).toBe(0);
    expect(handles.cp2y).toBeCloseTo(radius * 1.33, 1);

    const pathD = buildClosedOrganicBezierPath(
      radius,
      { x: handles.cp1x, y: handles.cp1y },
      { x: handles.cp2x, y: handles.cp2y }
    );

    // Verify it is a closed SVG path with start M, two C curves, and closes with Z
    expect(pathD.startsWith('M -16.00 0.00')).toBe(true);
    expect(pathD.includes('C ')).toBe(true);
    expect(pathD.endsWith('Z')).toBe(true);
    expect(pathD.includes('NaN')).toBe(false);
    expect(pathD.includes('undefined')).toBe(false);
  });

  it('supports mutating and resetting Bézier handles in mutationStore', () => {
    const store = useMutationStore.getState();

    store.updateBezierHandles('node-test-1', -10, -25, 12, 30);
    expect(useMutationStore.getState().mutations['node-test-1'].cp1x).toBe(-10);
    expect(useMutationStore.getState().mutations['node-test-1'].cp1y).toBe(-25);
    expect(useMutationStore.getState().mutations['node-test-1'].cp2x).toBe(12);
    expect(useMutationStore.getState().mutations['node-test-1'].cp2y).toBe(30);

    store.resetBezierHandles('node-test-1');
    expect(useMutationStore.getState().mutations['node-test-1'].cp1x).toBeUndefined();
    expect(useMutationStore.getState().mutations['node-test-1'].cp2x).toBeUndefined();
  });

  it('separates node selection from node movement and supports marquee selectAll', () => {
    const store = useMutationStore.getState();

    // Select single node
    store.selectNode('node-1', false);
    expect(useMutationStore.getState().selectedNodeIds).toEqual(['node-1']);

    // Shift-select another node
    store.selectNode('node-2', true);
    expect(useMutationStore.getState().selectedNodeIds).toEqual(['node-1', 'node-2']);

    // Marquee select multiple nodes
    store.selectAll(['node-1', 'node-2', 'node-3', 'node-4']);
    expect(useMutationStore.getState().selectedNodeIds.length).toBe(4);

    // Clear selection
    store.clearSelection();
    expect(useMutationStore.getState().selectedNodeIds.length).toBe(0);
  });

  it('adds and updates annotations dynamically attached to a specific node', () => {
    const layerStore = useLayerStore.getState();
    layerStore.addAnnotation('node-test-1', 'Nota importante de analítica', 50, -60, 'bezier');

    const list = useLayerStore.getState().annotations;
    expect(list.length).toBe(1);
    expect(list[0].targetNodeId).toBe('node-test-1');
    expect(list[0].text).toBe('Nota importante de analítica');
    expect(list[0].dx).toBe(50);
    expect(list[0].dy).toBe(-60);

    // Update annotation text and offset
    layerStore.updateAnnotation(list[0].id, { text: 'Nota modificada', dx: 70 });
    const updated = useLayerStore.getState().annotations[0];
    expect(updated.text).toBe('Nota modificada');
    expect(updated.dx).toBe(70);

    // Remove annotation
    layerStore.removeAnnotation(list[0].id);
    expect(useLayerStore.getState().annotations.length).toBe(0);
  });

  it('purges existing annotations and mutations when loading a fresh dataset', () => {
    // Populate an annotation and a mutation
    useLayerStore.getState().addAnnotation('node-dummy', 'Comentario viejo', 20, 20);
    useMutationStore.getState().updatePosition('node-dummy', 350, 450);

    expect(useLayerStore.getState().annotations.length).toBe(1);
    expect(Object.keys(useMutationStore.getState().mutations).length).toBe(1);

    // Load new dataset
    useDataStore.getState().loadDataset('nuevo_dataset.csv', [
      { id: 1, valor: 100, grupo: 'A' },
      { id: 2, valor: 200, grupo: 'B' },
    ]);

    // Verify completely purged state
    expect(useLayerStore.getState().annotations.length).toBe(0);
    expect(Object.keys(useMutationStore.getState().mutations).length).toBe(0);
    expect(useDataStore.getState().datasetName).toBe('nuevo_dataset.csv');
  });
});
