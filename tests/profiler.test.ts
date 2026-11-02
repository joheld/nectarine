import { describe, expect, it } from 'bun:test';
import { datasetProfiler, PERFORMANCE_NODE_THRESHOLD } from '../src/services/profiler';

describe('DatasetProfiler & Performance Guardrail', () => {
  const sampleData = [
    { country: 'A', gdp: 50000, life: 82.5, region: 'Europe' },
    { country: 'B', gdp: 25000, life: 75.0, region: 'Asia' },
    { country: 'C', gdp: 12000, life: 68.2, region: 'Americas' },
    { country: 'D', gdp: null, life: 62.0, region: 'Africa' },
  ];

  it('correctly profiles column types, null counts, and cardinality', () => {
    const profiled = datasetProfiler.profileColumns(sampleData);
    expect(profiled.length).toBe(4);

    const gdpCol = profiled.find((c) => c.name === 'gdp');
    expect(gdpCol?.type).toBe('number');
    expect(gdpCol?.nullCount).toBe(1);
    expect(gdpCol?.distinctCount).toBe(3);
    expect(gdpCol?.min).toBe(12000);
    expect(gdpCol?.max).toBe(50000);

    const regionCol = profiled.find((c) => c.name === 'region');
    expect(regionCol?.type).toBe('string');
    expect(regionCol?.nullCount).toBe(0);
    expect(regionCol?.distinctCount).toBe(4);
  });

  it('illuminates compatible charts and disables incompatible ones', () => {
    const profiled = datasetProfiler.profileColumns(sampleData);
    const compat = datasetProfiler.evaluateCompatibility(profiled, sampleData.length);

    const scatter = compat.find((c) => c.type === 'scatter');
    expect(scatter?.isCompatible).toBe(true);

    const bar = compat.find((c) => c.type === 'bar');
    expect(bar?.isCompatible).toBe(true);

    const chord = compat.find((c) => c.type === 'chord');
    expect(chord?.isCompatible).toBe(true);

    const spiral = compat.find((c) => c.type === 'spiral');
    expect(spiral?.isCompatible).toBe(true);

    const celestial = compat.find((c) => c.type === 'celestial');
    expect(celestial?.isCompatible).toBe(true);
  });

  it('triggers performance guardrail when exceeding 10,000 nodes', () => {
    const normalCheck = datasetProfiler.checkPerformance(500);
    expect(normalCheck.isExceeded).toBe(false);

    const exceededCheck = datasetProfiler.checkPerformance(12500);
    expect(exceededCheck.isExceeded).toBe(true);
    expect(exceededCheck.threshold).toBe(PERFORMANCE_NODE_THRESHOLD);
    expect(exceededCheck.mitigationOptions.length).toBeGreaterThanOrEqual(3);
  });

  it('applies non-SQL visual filter without SQL', () => {
    const filtered = datasetProfiler.transformFilter(sampleData, 'gdp', '>', 20000);
    expect(filtered.length).toBe(2);
    expect(filtered.map((r) => r.country)).toEqual(['A', 'B']);
  });

  it('applies multi-column filtering with AND conjunction', () => {
    const filtered = datasetProfiler.transformMultiFilter(
      sampleData,
      [
        { id: '1', column: 'gdp', operator: '>', value: 20000 },
        { id: '2', column: 'region', operator: '=', value: 'Europe' },
      ],
      'AND'
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].country).toBe('A');
  });

  it('applies multi-column filtering with OR conjunction', () => {
    const filtered = datasetProfiler.transformMultiFilter(
      sampleData,
      [
        { id: '1', column: 'region', operator: '=', value: 'Europe' },
        { id: '2', column: 'region', operator: '=', value: 'Africa' },
      ],
      'OR'
    );
    expect(filtered.length).toBe(2);
    expect(filtered.map((r) => r.country)).toEqual(['A', 'D']);
  });

  it('filters text columns with contains operator', () => {
    const filtered = datasetProfiler.transformMultiFilter(
      sampleData,
      [{ id: '1', column: 'region', operator: 'contains', value: 'eri' }],
      'AND'
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].country).toBe('C');
  });

  it('applies non-SQL group by aggregation', () => {
    const dataWithDuplicates = [
      { cat: 'Tech', val: 100 },
      { cat: 'Tech', val: 200 },
      { cat: 'Bio', val: 50 },
    ];
    const grouped = datasetProfiler.transformGroupBy(dataWithDuplicates, 'cat', 'val', 'mean');
    expect(grouped.length).toBe(2);
    const tech = grouped.find((g) => g.cat === 'Tech');
    expect(tech?.val).toBe(150);
  });

  it('applies non-SQL top N sorting', () => {
    const top = datasetProfiler.transformTopN(sampleData, 'life', 2, false);
    expect(top.length).toBe(2);
    expect(top[0].country).toBe('A');
    expect(top[1].country).toBe('B');
  });
});
