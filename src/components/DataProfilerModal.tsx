import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { FilterCondition, datasetProfiler } from '../services/profiler';
import {
  X,
  Sliders,
  Filter,
  BarChart,
  ArrowDownNarrowWide,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DataProfilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataProfilerModal: React.FC<DataProfilerModalProps> = ({ isOpen, onClose }) => {
  const {
    profiledColumns,
    activeRows,
    rawRows,
    activeFilters,
    filterConjunction,
    applyMultiFilter,
    applyGroupBy,
    applyTopN,
    resetTransforms,
  } = useDataStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'filter' | 'groupby' | 'topn'>('profile');

  // Multi-column filter state
  const [conditions, setConditions] = useState<FilterCondition[]>(() => {
    if (activeFilters && activeFilters.length > 0) {
      return activeFilters;
    }
    const defaultCol = profiledColumns[0]?.name || '';
    const defaultType = profiledColumns[0]?.type || 'string';
    return [
      {
        id: `cond-${Date.now()}`,
        column: defaultCol,
        operator: defaultType === 'number' ? '>' : '=',
        value: '',
      },
    ];
  });

  const [conjunction, setConjunction] = useState<'AND' | 'OR'>(filterConjunction || 'AND');

  // GroupBy state
  const [groupCol, setGroupCol] = useState(profiledColumns.find((c) => c.type === 'string')?.name || '');
  const [metricCol, setMetricCol] = useState(profiledColumns.find((c) => c.type === 'number')?.name || '');
  const [aggOp, setAggOp] = useState<'mean' | 'sum' | 'count' | 'max' | 'min'>('mean');

  // Top N state
  const [topCol, setTopCol] = useState(profiledColumns.find((c) => c.type === 'number')?.name || '');
  const [topCount, setTopCount] = useState(15);

  if (!isOpen) return null;

  // Real-time preview of rows matching current filter conditions
  const previewRows = datasetProfiler.transformMultiFilter(rawRows, conditions, conjunction);
  const matchCount = previewRows.length;
  const matchPct = rawRows.length > 0 ? Math.round((matchCount / rawRows.length) * 100) : 0;

  const handleAddCondition = () => {
    // Pick first column not yet in conditions if possible, otherwise first column
    const usedCols = conditions.map((c) => c.column);
    const nextColMeta = profiledColumns.find((c) => !usedCols.includes(c.name)) || profiledColumns[0];
    const colName = nextColMeta?.name || '';
    const colType = nextColMeta?.type || 'string';

    setConditions((prev) => [
      ...prev,
      {
        id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        column: colName,
        operator: colType === 'number' ? '>' : '=',
        value: '',
      },
    ]);
  };

  const handleRemoveCondition = (id: string) => {
    setConditions((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length === 0) {
        const defaultColMeta = profiledColumns[0];
        return [
          {
            id: `cond-${Date.now()}`,
            column: defaultColMeta?.name || '',
            operator: defaultColMeta?.type === 'number' ? '>' : '=',
            value: '',
          },
        ];
      }
      return remaining;
    });
  };

  const handleUpdateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };

        // If the user changed the column, adapt the operator to match the column type
        if (updates.column && updates.column !== c.column) {
          const colMeta = profiledColumns.find((p) => p.name === updates.column);
          if (colMeta?.type === 'number' && (c.operator === 'contains' || c.operator === '=')) {
            updated.operator = '>';
          } else if (
            colMeta?.type !== 'number' &&
            (c.operator === '>' || c.operator === '<' || c.operator === '>=' || c.operator === '<=')
          ) {
            updated.operator = '=';
          }
        }
        return updated;
      })
    );
  };

  const handleApplyFilter = () => {
    applyMultiFilter(conditions, conjunction);
    onClose();
  };

  const handleClearFilters = () => {
    const defaultColMeta = profiledColumns[0];
    const fresh = [
      {
        id: `cond-${Date.now()}`,
        column: defaultColMeta?.name || '',
        operator: (defaultColMeta?.type === 'number' ? '>' : '=') as any,
        value: '',
      },
    ];
    setConditions(fresh);
    setConjunction('AND');
    applyMultiFilter([], 'AND');
  };

  const handleApplyGroupBy = () => {
    if (!groupCol || !metricCol) return;
    applyGroupBy(groupCol, metricCol, aggOp);
    onClose();
  };

  const handleApplyTopN = () => {
    if (!topCol) return;
    applyTopN(topCol, Number(topCount));
    onClose();
  };

  const handleReset = () => {
    resetTransforms();
    onClose();
  };

  const hasActiveFiltersApplied = activeFilters && activeFilters.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs select-none p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#fffdfa] border border-[#e6dcce] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-xs text-[#2c1a0e]">
        {/* Header */}
        <div className="h-12 px-5 border-b border-[#e6dcce] flex items-center justify-between bg-[#f8f5ee]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#e11d48]" />
            <span className="font-semibold text-[#2c1a0e] text-sm">Filtros y Resumen de Columnas</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#ede5db] text-[#8c7664] hover:text-[#2c1a0e] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-2 border-b border-[#e6dcce] bg-[#f8f5ee]/60">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#e11d48] text-[#e11d48] font-semibold'
                : 'border-transparent text-[#8c7664] hover:text-[#2c1a0e]'
            }`}
          >
            Columnas ({profiledColumns.length})
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'filter'
                ? 'border-[#e11d48] text-[#e11d48] font-semibold'
                : 'border-transparent text-[#8c7664] hover:text-[#2c1a0e]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar Datos</span>
            {hasActiveFiltersApplied && (
              <span className="px-1.5 py-0.2 bg-[#e11d48] text-white text-[9.5px] rounded-full font-mono font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('groupby')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'groupby'
                ? 'border-[#e11d48] text-[#e11d48] font-semibold'
                : 'border-transparent text-[#8c7664] hover:text-[#2c1a0e]'
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            Agrupar por Categoría
          </button>
          <button
            onClick={() => setActiveTab('topn')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'topn'
                ? 'border-[#e11d48] text-[#e11d48] font-semibold'
                : 'border-transparent text-[#8c7664] hover:text-[#2c1a0e]'
            }`}
          >
            <ArrowDownNarrowWide className="w-3.5 h-3.5" />
            Top Registros
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[440px] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-2">
              <div className="flex justify-between text-[#8c7664] pb-1 border-b border-[#ebd9c8] font-mono text-[11px]">
                <span>COLUMNA / TIPO</span>
                <span>ÚNICOS / NULOS</span>
                <span>RANGO O MUESTRA</span>
              </div>
              {profiledColumns.map((col) => (
                <div
                  key={col.name}
                  className="p-2.5 rounded-xl bg-[#faf7f2] border border-[#ebd9c8] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2c1a0e]">{col.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                        col.type === 'number'
                          ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]'
                          : col.type === 'string'
                          ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#047857]'
                          : 'bg-[#faf5ff] border-[#e9d5ff] text-[#7e22ce]'
                      }`}
                    >
                      {col.type === 'number' ? 'número' : col.type === 'string' ? 'texto' : col.type}
                    </span>
                  </div>

                  <div className="font-mono text-[#8c7664] text-[11px]">
                    {col.distinctCount} únicos | {col.nullCount} vacíos
                  </div>

                  <div className="font-mono text-[#5e4634] text-[11px] max-w-[220px] truncate text-right">
                    {col.type === 'number' && col.min !== undefined && col.max !== undefined
                      ? `[${col.min.toLocaleString()} ... ${col.max.toLocaleString()}]`
                      : col.sampleValues.slice(0, 3).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'filter' && (
            <div className="space-y-4 py-1">
              {/* Header bar: Conjunction Switcher & Real-time Counter */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#f8f5ee] border border-[#e6dcce] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[#5e4634] font-medium text-[11.5px]">Coincidir con:</span>
                  <div className="flex items-center bg-[#ede5db] p-0.5 rounded-lg border border-[#dfd2c4]">
                    <button
                      type="button"
                      onClick={() => setConjunction('AND')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        conjunction === 'AND'
                          ? 'bg-white text-[#e11d48] shadow-2xs'
                          : 'text-[#8c7664] hover:text-[#2c1a0e]'
                      }`}
                      title="Deben cumplirse todas las condiciones al mismo tiempo"
                    >
                      Todas (Y / AND)
                    </button>
                    <button
                      type="button"
                      onClick={() => setConjunction('OR')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        conjunction === 'OR'
                          ? 'bg-white text-[#e11d48] shadow-2xs'
                          : 'text-[#8c7664] hover:text-[#2c1a0e]'
                      }`}
                      title="Basta con que se cumpla cualquiera de las condiciones"
                    >
                      Cualquiera (O / OR)
                    </button>
                  </div>
                </div>

                {/* Telemetry Badge */}
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {matchCount > 0 ? (
                    <span className="flex items-center gap-1 text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                      <strong>{matchCount}</strong> de {rawRows.length} filas ({matchPct}%)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#b45309] bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded-lg">
                      <AlertCircle className="w-3 h-3 text-[#d97706]" />
                      0 filas coincidentes
                    </span>
                  )}
                </div>
              </div>

              {/* Conditions List */}
              <div className="space-y-2.5">
                {conditions.map((cond, index) => {
                  const colMeta = profiledColumns.find((p) => p.name === cond.column);
                  const isNumberCol = colMeta?.type === 'number';

                  // Dynamic placeholder showing sample values
                  const placeholder = isNumberCol
                    ? colMeta?.min !== undefined && colMeta?.max !== undefined
                      ? `Ej: ${(colMeta.min + (colMeta.max - colMeta.min) * 0.5).toFixed(0)}`
                      : 'Ej: 100'
                    : colMeta?.sampleValues?.[0]
                    ? `Ej: "${colMeta.sampleValues[0]}"`
                    : 'Texto a buscar...';

                  return (
                    <div
                      key={cond.id}
                      className="flex items-center gap-2 p-2.5 bg-[#faf7f2] border border-[#ebd9c8] rounded-xl group hover:border-[#dfd2c4] transition-colors"
                    >
                      {/* Condition Index Tag */}
                      <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#ede5db] text-[#5e4634] font-mono text-[10px] font-bold shrink-0">
                        #{index + 1}
                      </span>

                      {/* Column Selector */}
                      <div className="flex-1 min-w-[130px]">
                        <select
                          value={cond.column}
                          onChange={(e) => handleUpdateCondition(cond.id, { column: e.target.value })}
                          className="w-full bg-white border border-[#dfd2c4] rounded-lg p-1.5 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none font-medium cursor-pointer"
                        >
                          {profiledColumns.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name} ({c.type === 'number' ? 'núm' : 'texto'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Operator Selector */}
                      <div className="w-[125px] shrink-0">
                        <select
                          value={cond.operator}
                          onChange={(e) => handleUpdateCondition(cond.id, { operator: e.target.value as any })}
                          className="w-full bg-white border border-[#dfd2c4] rounded-lg p-1.5 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none font-medium cursor-pointer text-[11.5px]"
                        >
                          {isNumberCol ? (
                            <>
                              <option value=">">Mayor que (&gt;)</option>
                              <option value=">=">Mayor o igual (&ge;)</option>
                              <option value="<">Menor que (&lt;)</option>
                              <option value="<=">Menor o igual (&le;)</option>
                              <option value="=">Igual a (=)</option>
                              <option value="!=">Distinto de (!=)</option>
                            </>
                          ) : (
                            <>
                              <option value="=">Es exactamente (=)</option>
                              <option value="contains">Contiene texto</option>
                              <option value="!=">No es igual (!=)</option>
                            </>
                          )}
                        </select>
                      </div>

                      {/* Value Input */}
                      <div className="flex-1 min-w-[120px]">
                        <input
                          type={isNumberCol && cond.operator !== '=' && cond.operator !== '!=' ? 'number' : 'text'}
                          value={cond.value}
                          placeholder={placeholder}
                          onChange={(e) => handleUpdateCondition(cond.id, { value: e.target.value })}
                          className="w-full bg-white border border-[#dfd2c4] rounded-lg p-1.5 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none placeholder:text-[#a89582]"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(cond.id)}
                        disabled={conditions.length === 1 && !cond.value}
                        className="p-1.5 text-[#8c7664] hover:text-[#b91c1c] hover:bg-[#fee2e2] rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        title="Eliminar esta condición"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions of Filter Tab */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ebd9c8]">
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#faf7f2] border border-[#dfd2c4] text-[#2c1a0e] font-medium shadow-2xs hover:border-[#e11d48] transition-colors cursor-pointer text-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#e11d48]" />
                  <span>Añadir otra condición</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3 py-1.5 rounded-xl text-[#8c7664] hover:text-[#2c1a0e] hover:bg-[#ede5db] transition-colors font-medium cursor-pointer"
                  >
                    Limpiar Filtros
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilter}
                    className="px-4 py-1.5 bg-[#e11d48] hover:bg-[#be123c] active:translate-y-px text-white rounded-xl font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Aplicar Filtros ({matchCount})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groupby' && (
            <div className="space-y-4 py-2">
              <p className="text-[#5e4634]">
                Agrupa y resume los datos para generar un gráfico de barras comparativo:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Categoría (Eje)</label>
                  <select
                    value={groupCol}
                    onChange={(e) => setGroupCol(e.target.value)}
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none"
                  >
                    {profiledColumns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Métrica</label>
                  <select
                    value={metricCol}
                    onChange={(e) => setMetricCol(e.target.value)}
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none"
                  >
                    {profiledColumns
                      .filter((c) => c.type === 'number')
                      .map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Cálculo</label>
                  <select
                    value={aggOp}
                    onChange={(e) => setAggOp(e.target.value as any)}
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none"
                  >
                    <option value="mean">Promedio</option>
                    <option value="sum">Suma Total</option>
                    <option value="count">Cantidad de Elementos</option>
                    <option value="max">Valor Máximo</option>
                    <option value="min">Valor Mínimo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleApplyGroupBy}
                  className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl font-medium shadow-xs cursor-pointer"
                >
                  Agrupar y Graficar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'topn' && (
            <div className="space-y-4 py-2">
              <p className="text-[#5e4634]">
                Muestra únicamente los elementos con mayor valor:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Columna a ordenar</label>
                  <select
                    value={topCol}
                    onChange={(e) => setTopCol(e.target.value)}
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none"
                  >
                    {profiledColumns
                      .filter((c) => c.type === 'number')
                      .map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">¿Cuántos mostrar?</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={topCount}
                    onChange={(e) => setTopCount(Number(e.target.value))}
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleApplyTopN}
                  className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl font-medium shadow-xs cursor-pointer"
                >
                  Mostrar Top {topCount}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 px-5 border-t border-[#e6dcce] flex items-center justify-between bg-[#f8f5ee]">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#8c7664] hover:text-[#b44b10] hover:bg-[#ede5db] transition-colors font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer ({activeRows.length} de {rawRows.length} filas activas)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#ede5db] hover:bg-[#dfd2c4] text-[#2c1a0e] font-medium cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
