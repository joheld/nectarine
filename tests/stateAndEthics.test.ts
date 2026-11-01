import { describe, expect, it, beforeEach } from 'bun:test';
import { useMutationStore } from '../src/store/mutationStore';
import { BaseNode } from '../src/engine/types';

describe('Mutation Store, Pinned Anchors & Distortion Monitor', () => {
  beforeEach(() => {
    useMutationStore.getState().resetAllMutations();
  });

  const testNode: BaseNode = {
    id: 'node-test',
    rawIndex: 0,
    mathX: 100,
    mathY: 100,
    mathR: 10,
    category: 'TestCat',
    label: 'Test Node',
    valueX: 50,
    valueY: 50,
    metadata: {},
  };

  it('reports 0% distortion for an untouched mathematical node', () => {
    const store = useMutationStore.getState();
    const distortion = store.calculateDistortion(testNode);
    expect(distortion.distortionPct).toBe(0);
    expect(distortion.isDistorted).toBe(false);
  });

  it('flags distortion and pins node when manually translated away from math coordinates', () => {
    const store = useMutationStore.getState();
    store.updatePosition('node-test', 200, 200, true);

    const mut = useMutationStore.getState().mutations['node-test'];
    expect(mut.isPinned).toBe(true);
    expect(mut.customX).toBe(200);
    expect(mut.customY).toBe(200);

    const distortion = store.calculateDistortion(testNode);
    expect(distortion.positionDeltaPx).toBeGreaterThan(100);
    expect(distortion.isDistorted).toBe(true);
  });

  it('calculates scale distortion when user scales vector', () => {
    const store = useMutationStore.getState();
    store.setManualScale('node-test', 1.6); // +60% scale

    const distortion = store.calculateDistortion(testNode);
    expect(distortion.distortionPct).toBeGreaterThanOrEqual(60);
    expect(distortion.isDistorted).toBe(true);
  });

  it('allows batch updating fills', () => {
    const store = useMutationStore.getState();
    store.batchUpdateFill(['node-test', 'node-other'], '#ff0055');

    const state = useMutationStore.getState();
    expect(state.mutations['node-test']?.customFill).toBe('#ff0055');
    expect(state.mutations['node-other']?.customFill).toBe('#ff0055');
  });
});
