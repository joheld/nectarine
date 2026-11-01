import { describe, expect, it } from 'bun:test';
import { computeLayout } from '../src/engine/layoutEngine';
import { buildCubicBezierPath, buildArchedArrowPath, euclideanDistance } from '../src/engine/bezierMath';

describe('Decoupled Mathematical Engine (D3 without DOM)', () => {
  const bounds = {
    width: 800,
    height: 600,
    padding: { top: 20, right: 20, bottom: 40, left: 50 },
  };

  const rows = [
    { country: 'Alpha', xVal: 10, yVal: 20, group: 'G1' },
    { country: 'Beta', xVal: 40, yVal: 80, group: 'G1' },
    { country: 'Gamma', xVal: 70, yVal: 50, group: 'G2' },
  ];

  it('computes deterministic scatter plot coordinates', () => {
    const result = computeLayout('scatter', rows, { x: 'xVal', y: 'yVal', category: 'group' }, bounds);
    expect(result.nodes.length).toBe(3);

    // Alpha should have lower X than Gamma
    const alpha = result.nodes.find((n) => n.metadata.country === 'Alpha');
    const gamma = result.nodes.find((n) => n.metadata.country === 'Gamma');
    expect(alpha!.mathX).toBeLessThan(gamma!.mathX);

    // Beta should have higher Y value, meaning smaller mathY in SVG coordinate system (higher up)
    const beta = result.nodes.find((n) => n.metadata.country === 'Beta');
    expect(beta!.mathY).toBeLessThan(alpha!.mathY);
  });

  it('computes Voronoi tessellation paths without DOM nodes', () => {
    const result = computeLayout('voronoi', rows, { x: 'xVal', y: 'yVal', category: 'group' }, bounds);
    expect(result.voronoiPolygons).toBeDefined();
    expect(result.voronoiPolygons?.size).toBe(3);
    const firstCell = result.voronoiPolygons?.get('node-0');
    expect(firstCell).toContain('M');
  });

  it('computes pure Bézier path strings', () => {
    const path = buildCubicBezierPath({ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 30, y: 20 }, { x: 40, y: 0 });
    expect(path).toBe('M 0.00 0.00 C 10.00 20.00, 30.00 20.00, 40.00 0.00');
  });

  it('computes arched arrow path for tethered annotations', () => {
    const { path, midPoint } = buildArchedArrowPath({ x: 0, y: 0 }, { x: 100, y: 100 }, 0.2);
    expect(path).toContain('M 0.00 0.00 Q');
    expect(midPoint.x).toBeGreaterThan(0);
    expect(euclideanDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});
