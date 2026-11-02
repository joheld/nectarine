import * as d3 from 'd3';
import {
  BaseNode,
  ChartType,
  ChordRibbon,
  SpiralTrack,
  CelestialOrbit,
  ConstellationLink,
  CurvedTextPath,
  GlyphShape,
} from './types';
import { createLinearScale, createBandScale, createSqrtScale } from './scales';
import { colorService } from '../services/colorService';

export interface LayoutBounds {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
}

export interface ComputedLayoutResult {
  nodes: BaseNode[];
  voronoiPolygons?: Map<string, string>; // nodeId -> path d string
  streamPaths?: { category: string; d: string; color: string }[];
  chordRibbons?: ChordRibbon[];
  spiralTrack?: SpiralTrack;
  celestialOrbits?: CelestialOrbit[];
  constellationLinks?: ConstellationLink[];
  curvedTextPaths?: CurvedTextPath[];
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
  mappings: { x?: string; y?: string; category?: string; size?: string; subCategory?: string },
  bounds: LayoutBounds
): ComputedLayoutResult {
  const { width, height, padding } = bounds;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (rows.length === 0) {
    return { nodes: [], axes: { xTicks: [], yTicks: [] } };
  }

  const catKey = mappings.category || Object.keys(rows[0])[0];
  const subCatKey = mappings.subCategory;
  const xKey = mappings.x;
  const yKey = mappings.y;
  const sizeKey = mappings.size;

  const GLYPH_CYCLE: GlyphShape[] = ['circle', 'petal', 'star', 'diamond', 'seed'];
  const subCatToGlyph = new Map<string, GlyphShape>();
  if (subCatKey) {
    const distinctSubCats = Array.from(new Set(rows.map((r) => String(r[subCatKey] ?? '')))).filter(Boolean);
    distinctSubCats.forEach((sc, idx) => {
      subCatToGlyph.set(sc, GLYPH_CYCLE[idx % GLYPH_CYCLE.length]);
    });
  }

  const getSubCatInfo = (r: Record<string, any>) => {
    if (!subCatKey || r[subCatKey] === undefined) return {};
    const subCategory = String(r[subCatKey]);
    const glyphShape = subCatToGlyph.get(subCategory);
    return { subCategory, ...(glyphShape ? { glyphShape } : {}) };
  };

  let computedNodes: BaseNode[] = [];
  let xTicks: { value: string | number; x: number }[] = [];
  let yTicks: { value: string | number; y: number }[] = [];
  let voronoiMap: Map<string, string> | undefined;
  let chordRibbons: ChordRibbon[] | undefined;
  let spiralTrack: SpiralTrack[] | SpiralTrack | undefined;
  let celestialOrbits: CelestialOrbit[] | undefined;
  let constellationLinks: ConstellationLink[] | undefined;
  let curvedTextPaths: CurvedTextPath[] | undefined;

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
        const cleanLabel = r.pais || r.producto || r.name || r.title || r.label || `${cat} (#${i})`;
        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX: xCenter,
          mathY: yPos,
          mathR: Math.max(4, Math.min(xScale.bandwidth() / 4, 12)),
          category: cat,
          label: String(cleanLabel),
          valueX: i,
          valueY: yVal,
          metadata: r,
          ...getSubCatInfo(r),
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
        const cleanLabel = r.pais || r.producto || r.name || r.title || r.label || `${cat} (#${i})`;

        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX: xScale(xVal),
          mathY: yScale(yVal),
          mathR: sizeScale(sVal),
          category: cat,
          label: String(cleanLabel),
          valueX: xVal,
          valueY: yVal,
          valueSize: sVal,
          metadata: r,
          ...getSubCatInfo(r),
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
        ...getSubCatInfo(rows[idx]),
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
          ...getSubCatInfo(r),
        };
      });
      break;
    }

    case 'chord': {
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(innerWidth, innerHeight) * 0.38;
      const N = rows.length;

      // Group and sort rows by category so categories form cohesive sectors
      const sortedIndexedRows = rows
        .map((r, originalIdx) => ({ r, originalIdx, cat: String(r[catKey] ?? 'General') }))
        .sort((a, b) => a.cat.localeCompare(b.cat));

      computedNodes = sortedIndexedRows.map((item, sortedIdx) => {
        const { r, originalIdx, cat } = item;
        const angle = (sortedIdx / Math.max(1, N)) * 2 * Math.PI - Math.PI / 2;
        const mathX = cx + radius * Math.cos(angle);
        const mathY = cy + radius * Math.sin(angle);
        const yVal = yKey ? Number(r[yKey]) || 1 : 1;
        const cleanLabel = r.pais || r.producto || r.name || r.title || r.label || `${cat} (#${sortedIdx})`;

        return {
          id: `node-${originalIdx}`,
          rawIndex: originalIdx,
          mathX,
          mathY,
          mathR: 6.5,
          category: cat,
          label: String(cleanLabel),
          valueX: sortedIdx,
          valueY: yVal,
          metadata: r,
          ...getSubCatInfo(r),
        };
      });

      // Compute inner fluid Bézier chord ribbons connecting nodes in the same category
      chordRibbons = [];
      const catGroups = new Map<string, typeof computedNodes>();
      computedNodes.forEach((n) => {
        if (!catGroups.has(n.category)) catGroups.set(n.category, []);
        catGroups.get(n.category)!.push(n);
      });

      let ribbonIdx = 0;
      catGroups.forEach((groupNodes, category) => {
        const catColor = colorService.getColorForCategory(category);
        for (let i = 0; i < groupNodes.length; i++) {
          const nextNode = groupNodes[(i + 1) % groupNodes.length];
          if (groupNodes.length > 1 && nextNode.id !== groupNodes[i].id) {
            const nA = groupNodes[i];
            const nB = nextNode;
            const pullFactor = 0.35;
            const cpx = cx * (1 - pullFactor) + ((nA.mathX + nB.mathX) / 2) * pullFactor;
            const cpy = cy * (1 - pullFactor) + ((nA.mathY + nB.mathY) / 2) * pullFactor;
            const ribbonD = `M ${nA.mathX.toFixed(2)} ${nA.mathY.toFixed(2)} Q ${cpx.toFixed(2)} ${cpy.toFixed(2)} ${nB.mathX.toFixed(2)} ${nB.mathY.toFixed(2)}`;

            chordRibbons!.push({
              id: `ribbon-${ribbonIdx++}`,
              sourceId: nA.id,
              targetId: nB.id,
              d: ribbonD,
              color: catColor,
              opacity: 0.45,
            });
          }
        }
      });

      // Compute curved text paths (<textPath>) along outer arc for each category
      curvedTextPaths = [];
      let textPathIdx = 0;
      catGroups.forEach((groupNodes, category) => {
        if (groupNodes.length === 0) return;
        const firstNode = groupNodes[0];
        const lastNode = groupNodes[groupNodes.length - 1];
        const a1 = Math.atan2(firstNode.mathY - cy, firstNode.mathX - cx);
        const a2 = Math.atan2(lastNode.mathY - cy, lastNode.mathX - cx);
        const textRadius = radius + 22;

        const sx = cx + textRadius * Math.cos(a1);
        const sy = cy + textRadius * Math.sin(a1);
        const ex = cx + textRadius * Math.cos(a2);
        const ey = cy + textRadius * Math.sin(a2);

        const arcD = `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${textRadius.toFixed(2)} ${textRadius.toFixed(2)} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
        curvedTextPaths!.push({
          id: `textpath-${textPathIdx++}`,
          pathD: arcD,
          text: category.toUpperCase(),
          offset: '50%',
          fontSize: 10,
          fill: colorService.getColorForCategory(category),
        });
      });

      break;
    }

    case 'spiral': {
      const cx = width / 2;
      const cy = height / 2;
      const totalTurns = 2.8;
      const totalAngle = totalTurns * 2 * Math.PI;
      const minR = 28;
      const maxR = Math.min(innerWidth, innerHeight) * 0.42;
      const N = rows.length;

      const sortedRows = rows.slice().sort((a, b) => {
        const valA = yKey ? Number(a[yKey]) || 0 : 0;
        const valB = yKey ? Number(b[yKey]) || 0 : 0;
        return valA - valB;
      });

      const yVals = sortedRows.map((r) => (yKey ? Number(r[yKey]) || 0 : 1));
      const maxY = d3.max(yVals) || 10;

      computedNodes = sortedRows.map((r, i) => {
        const t = N > 1 ? i / (N - 1) : 0.5;
        const theta = t * totalAngle;
        const rPos = minR + t * (maxR - minR);
        const mathX = cx + rPos * Math.cos(theta - Math.PI / 2);
        const mathY = cy + rPos * Math.sin(theta - Math.PI / 2);
        const yVal = yKey ? Number(r[yKey]) || 0 : 1;
        const cat = String(r[catKey] ?? 'General');
        const cleanLabel = r.pais || r.producto || r.name || r.title || r.label || `${cat} (#${i})`;
        const mathR = 4.5 + (yVal / Math.max(1, maxY)) * 9;

        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX,
          mathY,
          mathR,
          category: cat,
          label: String(cleanLabel),
          valueX: i,
          valueY: yVal,
          metadata: r,
          ...getSubCatInfo(r),
        };
      });

      // Sample golden spiral track path
      let spiralD = '';
      const step = 0.05;
      for (let a = 0; a <= totalAngle; a += step) {
        const curT = a / totalAngle;
        const curR = minR + curT * (maxR - minR);
        const curX = cx + curR * Math.cos(a - Math.PI / 2);
        const curY = cy + curR * Math.sin(a - Math.PI / 2);
        if (a === 0) {
          spiralD = `M ${curX.toFixed(2)} ${curY.toFixed(2)}`;
        } else {
          spiralD += ` L ${curX.toFixed(2)} ${curY.toFixed(2)}`;
        }
      }

      spiralTrack = {
        d: spiralD,
        rings: [
          { radius: minR + (maxR - minR) * 0.33, label: '33% Ciclo' },
          { radius: minR + (maxR - minR) * 0.66, label: '66% Ciclo' },
          { radius: maxR, label: '100% Cúspide' },
        ],
      };

      break;
    }

    case 'celestial': {
      const cx = width / 2;
      const cy = height / 2;
      const N = rows.length;

      celestialOrbits = [
        {
          cx,
          cy,
          rx: innerWidth * 0.22,
          ry: innerHeight * 0.15,
          rotation: -18,
          stroke: '#b44b10',
          label: 'Órbita Primaria',
        },
        {
          cx,
          cy,
          rx: innerWidth * 0.34,
          ry: innerHeight * 0.24,
          rotation: 14,
          stroke: '#d97706',
          label: 'Órbita Media',
        },
        {
          cx,
          cy,
          rx: innerWidth * 0.44,
          ry: innerHeight * 0.33,
          rotation: -6,
          stroke: '#9a3412',
          label: 'Órbita Exterior',
        },
      ];

      const yVals = rows.map((r) => (yKey ? Number(r[yKey]) || 0 : 1));
      const maxY = d3.max(yVals) || 10;

      computedNodes = rows.map((r, i) => {
        const orbitIdx = i % celestialOrbits!.length;
        const orbit = celestialOrbits![orbitIdx];
        const itemsInOrbit = Math.ceil(N / celestialOrbits!.length);
        const itemPos = Math.floor(i / celestialOrbits!.length);
        const theta = (itemPos / Math.max(1, itemsInOrbit)) * 2 * Math.PI;

        const bx = orbit.rx * Math.cos(theta);
        const by = orbit.ry * Math.sin(theta);
        const rotRad = (orbit.rotation * Math.PI) / 180;
        const mathX = cx + bx * Math.cos(rotRad) - by * Math.sin(rotRad);
        const mathY = cy + bx * Math.sin(rotRad) + by * Math.cos(rotRad);

        const yVal = yKey ? Number(r[yKey]) || 0 : 1;
        const cat = String(r[catKey] ?? 'General');
        const cleanLabel = r.pais || r.producto || r.name || r.title || r.label || `${cat} (#${i})`;
        const mathR = 5 + (yVal / Math.max(1, maxY)) * 7;

        return {
          id: `node-${i}`,
          rawIndex: i,
          mathX,
          mathY,
          mathR,
          category: cat,
          label: String(cleanLabel),
          valueX: i,
          valueY: yVal,
          metadata: r,
          ...getSubCatInfo(r),
        };
      });

      constellationLinks = [];
      const catStars = new Map<string, typeof computedNodes>();
      computedNodes.forEach((n) => {
        if (!catStars.has(n.category)) catStars.set(n.category, []);
        catStars.get(n.category)!.push(n);
      });

      let linkIdx = 0;
      catStars.forEach((stars, cat) => {
        const catColor = colorService.getColorForCategory(cat);
        for (let j = 0; j < stars.length - 1; j++) {
          const s1 = stars[j];
          const s2 = stars[j + 1];
          constellationLinks!.push({
            id: `constellation-${linkIdx++}`,
            sourceId: s1.id,
            targetId: s2.id,
            x1: s1.mathX,
            y1: s1.mathY,
            x2: s2.mathX,
            y2: s2.mathY,
            stroke: catColor,
            dashArray: '3,3',
          });
        }
      });

      break;
    }
  }

  return {
    nodes: computedNodes,
    voronoiPolygons: voronoiMap,
    chordRibbons,
    spiralTrack: Array.isArray(spiralTrack) ? spiralTrack[0] : spiralTrack,
    celestialOrbits,
    constellationLinks,
    curvedTextPaths,
    axes: { xTicks, yTicks },
  };
}
