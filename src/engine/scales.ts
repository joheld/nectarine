import * as d3 from 'd3';

/**
 * Pure mathematical scale generators. No DOM interaction.
 */
export function createLinearScale(domain: [number, number], range: [number, number]) {
  return d3.scaleLinear().domain(domain).range(range).nice();
}

export function createBandScale(domain: string[], range: [number, number], padding = 0.2) {
  return d3.scaleBand().domain(domain).range(range).padding(padding);
}

export function createSqrtScale(domain: [number, number], range: [number, number]) {
  return d3.scaleSqrt().domain(domain).range(range);
}

export function createOrdinalColorScale(domain: string[], rangeColors: string[]) {
  return d3.scaleOrdinal<string, string>().domain(domain).range(rangeColors);
}
