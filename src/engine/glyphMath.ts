import { GlyphShape } from './types';

/**
 * Mathematical generators for artisanal editorial glyph marks.
 * Generates centered SVG path strings centered at (0, 0) with characteristic radius r.
 */

export function generateGlyphPath(shape: GlyphShape, r: number): string {
  switch (shape) {
    case 'circle': {
      // Smooth continuous circle using SVG arc commands
      return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`;
    }

    case 'petal': {
      // Botanical organic petal: pointed at top (0, -r * 1.3), rounded base (0, r * 0.7)
      const topY = -r * 1.35;
      const bottomY = r * 0.75;
      const flankX = r * 0.95;
      const midY = -r * 0.15;

      return `M 0 ${topY.toFixed(2)} C ${flankX.toFixed(2)} ${midY.toFixed(2)}, ${flankX.toFixed(2)} ${bottomY.toFixed(2)}, 0 ${bottomY.toFixed(2)} C ${(-flankX).toFixed(2)} ${bottomY.toFixed(2)}, ${(-flankX).toFixed(2)} ${midY.toFixed(2)}, 0 ${topY.toFixed(2)} Z`;
    }

    case 'star': {
      // 5-point harmonic star with golden-ratio inner radius
      const points = 5;
      const outerR = r * 1.25;
      const innerR = outerR * 0.42;
      const step = Math.PI / points;
      let path = '';

      for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerR : innerR;
        // Start from top (-PI/2)
        const angle = -Math.PI / 2 + i * step;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) {
          path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else {
          path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
        }
      }
      return `${path} Z`;
    }

    case 'diamond': {
      // Swiss editorial diamond (rhombus) with sharp vertical axis and broad horizontal axis
      const rx = r * 1.1;
      const ry = r * 1.35;
      return `M 0 ${(-ry).toFixed(2)} L ${rx.toFixed(2)} 0 L 0 ${ry.toFixed(2)} L ${(-rx).toFixed(2)} 0 Z`;
    }

    case 'seed': {
      // Organic seed / leaf: pointed bottom and top with graceful asymmetric curvature
      const topY = -r * 1.3;
      const bottomY = r * 1.3;
      const rightX = r * 0.9;
      const leftX = -r * 0.9;

      return `M 0 ${topY.toFixed(2)} C ${rightX.toFixed(2)} ${(-r * 0.5).toFixed(2)}, ${rightX.toFixed(2)} ${(r * 0.5).toFixed(2)}, 0 ${bottomY.toFixed(2)} C ${(leftX * 0.7).toFixed(2)} ${(r * 0.4).toFixed(2)}, ${(leftX * 0.7).toFixed(2)} ${(-r * 0.4).toFixed(2)}, 0 ${topY.toFixed(2)} Z`;
    }

    default:
      return `M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`;
  }
}

export const GLYPH_OPTIONS: { id: GlyphShape; label: string; description: string }[] = [
  { id: 'circle', label: 'Círculo Clásico', description: 'Forma geométrica pura y neutral' },
  { id: 'petal', label: 'Pétalo Botánico', description: 'Curvatura suave orgánica y natural' },
  { id: 'star', label: 'Estrella Áurea', description: '5 puntas de proporción armónica' },
  { id: 'diamond', label: 'Rombo Suizo', description: 'Silueta editorial angulada de precisión' },
  { id: 'seed', label: 'Semilla Bézier', description: 'Hoja estilizada de doble cúspide' },
];
