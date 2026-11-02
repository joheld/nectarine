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

/**
 * Builds a smooth closed organic vector shape deformed by two control handles.
 * Top arc deforms toward cp1, bottom arc deforms toward cp2, closing seamlessly without cutting off.
 */
export function buildClosedOrganicBezierPath(
  radius: number,
  cp1: Point,
  cp2: Point
): string {
  const left = { x: -radius, y: 0 };
  const right = { x: radius, y: 0 };

  // Control tangents for upper curvature (cp1)
  const topCp1 = { x: -radius * 0.55 + cp1.x * 0.5, y: cp1.y };
  const topCp2 = { x: radius * 0.55 + cp1.x * 0.5, y: cp1.y };

  // Control tangents for lower curvature (cp2)
  const bottomCp1 = { x: radius * 0.55 + cp2.x * 0.5, y: cp2.y };
  const bottomCp2 = { x: -radius * 0.55 + cp2.x * 0.5, y: cp2.y };

  return `M ${left.x.toFixed(2)} ${left.y.toFixed(2)} C ${topCp1.x.toFixed(2)} ${topCp1.y.toFixed(2)}, ${topCp2.x.toFixed(2)} ${topCp2.y.toFixed(2)}, ${right.x.toFixed(2)} ${right.y.toFixed(2)} C ${bottomCp1.x.toFixed(2)} ${bottomCp1.y.toFixed(2)}, ${bottomCp2.x.toFixed(2)} ${bottomCp2.y.toFixed(2)}, ${left.x.toFixed(2)} ${left.y.toFixed(2)} Z`;
}

/**
 * Generates standard organic Bézier handles for a circular node:
 * cp1 at top apex (0, -radius * 1.33) and cp2 at bottom apex (0, radius * 1.33)
 */
export function generateOrganicBezierHandles(radius: number) {
  return {
    cp1x: 0,
    cp1y: -radius * 1.33,
    cp2x: 0,
    cp2y: radius * 1.33,
  };
}
