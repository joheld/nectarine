import { describe, expect, it, beforeEach } from 'bun:test';
import { datasetReconciler } from '../src/services/reconciler';
import { textureService } from '../src/services/textureService';
import { generateGlyphPath, GLYPH_OPTIONS } from '../src/engine/glyphMath';
import { exportService } from '../src/services/exportService';
import { BaseNode, NodeMutation, TetheredAnnotation } from '../src/engine/types';

describe('Studio Vanguard: Reconciler, Glyphs & Finishes Suite', () => {
  describe('Entity Diffing & Live Data Hot-Reload (datasetReconciler)', () => {
    const oldRows = [
      { id: 'esp', pais: 'España', pib: 1400, gdp: 30 },
      { id: 'fra', pais: 'Francia', pib: 2800, gdp: 40 },
      { id: 'ita', pais: 'Italia', pib: 2000, gdp: 35 },
    ];

    const newRows = [
      { id: 'esp', pais: 'España', pib: 1550, gdp: 32 }, // Updated
      { id: 'fra', pais: 'Francia', pib: 2900, gdp: 41 }, // Updated
      { id: 'ale', pais: 'Alemania', pib: 4200, gdp: 50 }, // New
    ];

    const oldNodes: BaseNode[] = [
      { id: 'node-0', rawIndex: 0, mathX: 100, mathY: 200, mathR: 12, category: 'Europa', label: 'España', metadata: {} },
      { id: 'node-1', rawIndex: 1, mathX: 300, mathY: 400, mathR: 18, category: 'Europa', label: 'Francia', metadata: {} },
      { id: 'node-2', rawIndex: 2, mathX: 200, mathY: 300, mathR: 15, category: 'Europa', label: 'Italia', metadata: {} },
    ];

    const newNodes: BaseNode[] = [
      { id: 'node-new-0', rawIndex: 0, mathX: 110, mathY: 210, mathR: 13, category: 'Europa', label: 'España', metadata: {} },
      { id: 'node-new-1', rawIndex: 1, mathX: 320, mathY: 410, mathR: 19, category: 'Europa', label: 'Francia', metadata: {} },
      { id: 'node-new-2', rawIndex: 2, mathX: 500, mathY: 600, mathR: 25, category: 'Europa', label: 'Alemania', metadata: {} },
    ];

    const currentMutations: Record<string, NodeMutation> = {
      'node-0': {
        id: 'node-0',
        customX: 150,
        customY: 250,
        cp1x: -15,
        cp1y: -30,
        cp2x: 15,
        cp2y: 30,
        customFill: '#e11d48',
        isPinned: true,
        manualScale: 1.2,
      },
    };

    const currentAnnotations: TetheredAnnotation[] = [
      {
        id: 'ann-1',
        targetNodeId: 'node-0',
        text: 'Nota crucial sobre España',
        dx: 40,
        dy: -50,
        curveType: 'bezier',
      },
    ];

    it('automatically identifies the common primary key', () => {
      const matchKey = datasetReconciler.findCandidateMatchKey(oldRows, newRows);
      expect(matchKey).toBe('id');
    });

    it('reconciles mutations and re-anchors them to the new node IDs without losing Bézier curves', () => {
      const result = datasetReconciler.reconcile({
        oldRows,
        newRows,
        oldBaseNodes: oldNodes,
        newBaseNodes: newNodes,
        currentMutations,
        currentAnnotations,
      });

      expect(result.report.matchedCount).toBe(1);
      expect(result.report.newCount).toBe(1); // Alemania
      expect(result.report.removedCount).toBe(1); // Italia

      // Mutations transferred from node-0 to node-new-0
      const reconciledEsp = result.reconciledMutations['node-new-0'];
      expect(reconciledEsp).toBeDefined();
      expect(reconciledEsp.customX).toBe(150);
      expect(reconciledEsp.customY).toBe(250);
      expect(reconciledEsp.cp1x).toBe(-15);
      expect(reconciledEsp.cp2x).toBe(15);
      expect(reconciledEsp.customFill).toBe('#e11d48');
      expect(reconciledEsp.isPinned).toBe(true);

      // Annotation re-anchored to node-new-0
      expect(result.reconciledAnnotations.length).toBe(1);
      expect(result.reconciledAnnotations[0].targetNodeId).toBe('node-new-0');
      expect(result.reconciledAnnotations[0].text).toBe('Nota crucial sobre España');
    });
  });

  describe('Artisanal Morphological Glyphs (glyphMath)', () => {
    it('generates valid non-empty SVG path strings for all 5 glyph shapes', () => {
      const shapes = GLYPH_OPTIONS.map((g) => g.id);
      expect(shapes).toContain('circle');
      expect(shapes).toContain('petal');
      expect(shapes).toContain('star');
      expect(shapes).toContain('diamond');
      expect(shapes).toContain('seed');

      for (const shape of shapes) {
        const path = generateGlyphPath(shape, 16);
        expect(path.length).toBeGreaterThan(10);
        expect(path.startsWith('M')).toBe(true);
        expect(path.endsWith('Z')).toBe(true);
        expect(path.includes('NaN')).toBe(false);
        expect(path.includes('undefined')).toBe(false);
      }
    });
  });

  describe('Studio Finishes & Textures (textureService)', () => {
    beforeEach(() => {
      textureService.setFinish('clean');
    });

    it('manages active finishes and notifies listeners', () => {
      expect(textureService.getActiveFinish()).toBe('clean');
      expect(textureService.getFilterId('clean')).toBeUndefined();

      let notifiedFinish = '';
      const unsubscribe = textureService.subscribe((f) => {
        notifiedFinish = f;
      });

      textureService.setFinish('risograph');
      expect(textureService.getActiveFinish()).toBe('risograph');
      expect(notifiedFinish).toBe('risograph');
      expect(textureService.getFilterId('risograph')).toBe('url(#studio-finish-risograph)');

      textureService.setFinish('paper');
      expect(textureService.getActiveFinish()).toBe('paper');
      expect(textureService.getFilterId('paper')).toBe('url(#studio-finish-paper)');

      unsubscribe();
    });
  });

  describe('Copy to Clipboard for Figma & Illustrator (exportService)', () => {
    it('provides copyToClipboard method returning execution status', async () => {
      expect(typeof exportService.copyToClipboard).toBe('function');
      const testSvg = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>';
      const res = await exportService.copyToClipboard(testSvg);
      // In bun test environment where navigator.clipboard might not have native OS window
      expect(res).toBeDefined();
      expect(typeof res.success).toBe('boolean');
    });
  });
});
