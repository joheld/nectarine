/**
 * Pure Bézier and geometric path utilities without DOM dependencies.
 */

export interface Point {
  x: number;
  y: number;
}

export function euclideanDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates cubic Bézier curve path string: M start C cp1, cp2, end
 */
export function buildCubicBezierPath(
  start: Point,
  cp1: Point,
  cp2: Point,
  end: Point
): string {
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} C ${cp1.x.toFixed(2)} ${cp1.y.toFixed(2)}, ${cp2.x.toFixed(2)} ${cp2.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Calculates quadratic curve with a single control point
 */
export function buildQuadraticBezierPath(
  start: Point,
  control: Point,
  end: Point
): string {
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${control.x.toFixed(2)} ${control.y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Generates an organic arched arrow path from source to target
 */
export function buildArchedArrowPath(
  source: Point,
  target: Point,
  curvature = 0.25
): { path: string; midPoint: Point } {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Normal vector perpendicular to chord
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);

  const midX = (source.x + target.x) / 2 + nx * dist * curvature;
  const midY = (source.y + target.y) / 2 + ny * dist * curvature;

  const control: Point = { x: midX, y: midY };
  return {
    path: buildQuadraticBezierPath(source, control, target),
    midPoint: control,
  };
}

/**
 * Generates standard Bézier anchor handles around a node center (dx, dy)
 */
export function generateDefaultBezierHandles(radius: number) {
  const offset = radius * 1.6;
  return {
    cp1x: -offset,
    cp1y: -offset * 0.5,
    cp2x: offset,
    cp2y: offset * 0.5,
  };
}
