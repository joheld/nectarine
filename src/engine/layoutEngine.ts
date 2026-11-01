import * as d3 from 'd3';
import { BaseNode, ChartType } from './types';
import { createLinearScale, createBandScale, createSqrtScale } from './scales';

export interface LayoutBounds {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
}

export interface ComputedLayoutResult {
  nodes: BaseNode[];
  voronoiPolygons?: Map<string, string>; // nodeId -> path d string
  streamPaths?: { category: string; d: string; color: string }[];
  axes: {
    xTicks: { value: string | number; x: number }[];
    yTicks: { value: string | number; y: number }[];
  };
}

/**
 * Computes deterministic mathematical coordinates for nodes using pure D3 math.
 * Strictly decoupled from DOM manipulation.
 */
export function computeLayout(
  chartType: ChartType,
  rows: Record<string, any>[],
  mappings: { x?: string; y?: string; category?: string; size?: string },
  bounds: LayoutBounds
): ComputedLayoutResult {
  const { width, height, padding } = bounds;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (rows.length === 0) {
    return { nodes: [], axes: { xTicks: [], yTicks: [] } };
  }

  const catKey = mappings.category || Object.keys(rows[0])[0];
  const xKey = mappings.x;
  const yKey = mappings.y;
  const sizeKey = mappings.size;

  let computedNodes: BaseNode[] = [];
  let xTicks: { value: string | number; x: number }[] = [];
  let yTicks: { value: string | number; y: number }[] = [];
  let voronoiMap: Map<string, string> | undefined;

  switch (chartType) {
    case 'bar': {
      // Group by category, average or sum Y
      const categories = Array.from(new Set(rows.map((r) => String(r[catKey] ?? 'Unknown'))));
      const xScale = createBandScale(categories, [padding.left, width - padding.right], 0.3);

      const yValues = rows.map((r) => (yKey ? Number(r[yKey]) || 0 : 1));
      const maxY = d3.max(yValues) || 10;
      const yScale = createLinearScale([0, maxY * 1.1], [height - padding.bottom, padding.top]);

      xTicks = categories.map((cat) => ({
        value: cat,
        x: (xScale(cat) || 0) + xScale.bandwidth() / 2,
      }));
      yTicks = yScale.ticks(5).map((t) => ({ value: t, y: yScale(t) }));

      computedNodes = rows.map((r, i) => {
        const cat = String(r[catKey] ?? 'Unknown');
        const yVal = yKey ? Number(r[yKey]) || 0 : 1;
        const xCenter = (xScale(cat) || padding.left) + xScale.bandwidth() / 2;
        const yPos = yScale(yVal);
        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX: xCenter,
          mathY: yPos,
          mathR: Math.max(4, Math.min(xScale.bandwidth() / 4, 12)),
          category: cat,
          label: r.label ? String(r.label) : `${cat} (#${i})`,
          valueX: i,
          valueY: yVal,
          metadata: r,
        };
      });
      break;
    }

    case 'bubble':
    case 'scatter': {
      const xNums = rows.map((r) => (xKey ? Number(r[xKey]) || 0 : 0));
      const yNums = rows.map((r) => (yKey ? Number(r[yKey]) || 0 : 0));

      const xMin = d3.min(xNums) ?? 0;
      const xMax = d3.max(xNums) ?? 100;
      const yMin = d3.min(yNums) ?? 0;
      const yMax = d3.max(yNums) ?? 100;

      const xScale = createLinearScale([xMin, xMax], [padding.left, width - padding.right]);
      const yScale = createLinearScale([yMin, yMax], [height - padding.bottom, padding.top]);

      let sizeScale = (_val: number) => 6;
      if (chartType === 'bubble' && sizeKey) {
        const sizes = rows.map((r) => Number(r[sizeKey]) || 1);
        const sMin = d3.min(sizes) ?? 1;
        const sMax = d3.max(sizes) ?? 50;
        sizeScale = createSqrtScale([sMin, sMax], [4, 28]);
      }

      xTicks = xScale.ticks(6).map((t) => ({ value: t, x: xScale(t) }));
      yTicks = yScale.ticks(6).map((t) => ({ value: t, y: yScale(t) }));

      computedNodes = rows.map((r, i) => {
        const xVal = xKey ? Number(r[xKey]) || 0 : i;
        const yVal = yKey ? Number(r[yKey]) || 0 : i;
        const sVal = sizeKey ? Number(r[sizeKey]) || 1 : 1;
        const cat = String(r[catKey] ?? 'General');

        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX: xScale(xVal),
          mathY: yScale(yVal),
          mathR: sizeScale(sVal),
          category: cat,
          label: r.label ? String(r.label) : `${cat} [${xVal.toFixed(1)}, ${yVal.toFixed(1)}]`,
          valueX: xVal,
          valueY: yVal,
          valueSize: sVal,
          metadata: r,
        };
      });
      break;
    }

    case 'voronoi': {
      // Scatter base + Voronoi tessellation computation
      const xNums = rows.map((r) => (xKey ? Number(r[xKey]) || 0 : 0));
      const yNums = rows.map((r) => (yKey ? Number(r[yKey]) || 0 : 0));

      const xMin = d3.min(xNums) ?? 0;
      const xMax = d3.max(xNums) ?? 100;
      const yMin = d3.min(yNums) ?? 0;
      const yMax = d3.max(yNums) ?? 100;

      const xScale = createLinearScale([xMin, xMax], [padding.left, width - padding.right]);
      const yScale = createLinearScale([yMin, yMax], [height - padding.bottom, padding.top]);

      computedNodes = rows.map((r, i) => {
        const xVal = xKey ? Number(r[xKey]) || 0 : i;
        const yVal = yKey ? Number(r[yKey]) || 0 : i;
        const cat = String(r[catKey] ?? 'General');
        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX: xScale(xVal),
          mathY: yScale(yVal),
          mathR: 5,
          category: cat,
          label: `${cat} (#${i})`,
          valueX: xVal,
          valueY: yVal,
          metadata: r,
        };
      });

      // Pure D3 Delaunay Voronoi calculation
      if (computedNodes.length >= 3) {
        const points = computedNodes.map((n) => [n.mathX, n.mathY] as [number, number]);
        const delaunay = d3.Delaunay.from(points);
        const voronoi = delaunay.voronoi([padding.left, padding.top, width - padding.right, height - padding.bottom]);

        voronoiMap = new Map();
        for (let i = 0; i < computedNodes.length; i++) {
          const pathString = voronoi.renderCell(i);
          if (pathString) {
            voronoiMap.set(computedNodes[i].id, pathString);
          }
        }
      }
      break;
    }

    case 'network': {
      // Simulation purely in memory
      const simulationNodes = rows.map((r, i) => ({
        id: `node-${i}`,
        rawIndex: i,
        category: String(r[catKey] ?? 'Cluster'),
        x: width / 2 + (Math.random() - 0.5) * (innerWidth * 0.6),
        y: height / 2 + (Math.random() - 0.5) * (innerHeight * 0.6),
        r: 8,
      }));

      // In-memory simulation with 120 ticks
      const simulation = d3
        .forceSimulation(simulationNodes)
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('charge', d3.forceManyBody().strength(-40))
        .force('collide', d3.forceCollide().radius(14))
        .stop();

      for (let i = 0; i < 120; i++) {
        simulation.tick();
      }

      computedNodes = simulationNodes.map((sn, idx) => ({
        id: sn.id,
        rawIndex: idx,
        mathX: Math.max(padding.left, Math.min(width - padding.right, sn.x ?? width / 2)),
        mathY: Math.max(padding.top, Math.min(height - padding.bottom, sn.y ?? height / 2)),
        mathR: 8,
        category: sn.category,
        label: `${sn.category} (#${idx})`,
        metadata: rows[idx],
      }));
      break;
    }

    case 'stream': {
      // Stacked stream layout math
      const categories = Array.from(new Set(rows.map((r) => String(r[catKey] ?? 'General'))));
      const stepX = innerWidth / Math.max(1, rows.length - 1);

      computedNodes = rows.map((r, i) => {
        const cat = String(r[catKey] ?? 'General');
        const catIdx = categories.indexOf(cat);
        const xPos = padding.left + i * stepX;
        const yVal = yKey ? Number(r[yKey]) || 10 : 10;
        const baseline = padding.top + (catIdx + 0.5) * (innerHeight / categories.length);
        const yPos = baseline + (Math.sin(i * 0.5) * 15);

        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX: xPos,
          mathY: yPos,
          mathR: 6,
          category: cat,
          label: `${cat} (${yVal})`,
          valueX: i,
          valueY: yVal,
          metadata: r,
        };
      });
      break;
    }
  }

  return {
    nodes: computedNodes,
    voronoiPolygons: voronoiMap,
    axes: { xTicks, yTicks },
  };
}
