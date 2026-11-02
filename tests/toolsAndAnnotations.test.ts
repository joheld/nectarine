import { describe, expect, it, beforeEach } from 'bun:test';
import { useMutationStore } from '../src/store/mutationStore';
import { useLayerStore } from '../src/store/layerStore';
import { useDataStore } from '../src/store/dataStore';

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
