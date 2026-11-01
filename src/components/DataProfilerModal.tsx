import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { X, Sliders, Filter, BarChart, ArrowDownNarrowWide, RotateCcw } from 'lucide-react';

interface DataProfilerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataProfilerModal: React.FC<DataProfilerModalProps> = ({ isOpen, onClose }) => {
  const {
    profiledColumns,
    activeRows,
    rawRows,
    applyFilter,
    applyGroupBy,
    applyTopN,
    resetTransforms,
  } = useDataStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'filter' | 'groupby' | 'topn'>('profile');

  // Filter state
  const [filterCol, setFilterCol] = useState(profiledColumns[0]?.name || '');
  const [filterOp, setFilterOp] = useState<'>' | '<' | '=' | '!='>('>');
  const [filterVal, setFilterVal] = useState('');

  // GroupBy state
  const [groupCol, setGroupCol] = useState(profiledColumns.find((c) => c.type === 'string')?.name || '');
  const [metricCol, setMetricCol] = useState(profiledColumns.find((c) => c.type === 'number')?.name || '');
  const [aggOp, setAggOp] = useState<'mean' | 'sum' | 'count' | 'max' | 'min'>('mean');

  // Top N state
  const [topCol, setTopCol] = useState(profiledColumns.find((c) => c.type === 'number')?.name || '');
  const [topCount, setTopCount] = useState(15);

  if (!isOpen) return null;

  const handleApplyFilter = () => {
    if (!filterCol || filterVal === '') return;
    applyFilter(filterCol, filterOp, filterVal);
    onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm select-none p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-xs text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="h-11 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-mac-accent" />
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Filtros y Resumen de Columnas</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-mac-accent text-mac-accent font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Columnas ({profiledColumns.length})
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'filter'
                ? 'border-mac-accent text-mac-accent font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filtrar Datos
          </button>
          <button
            onClick={() => setActiveTab('groupby')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'groupby'
                ? 'border-mac-accent text-mac-accent font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            Agrupar por Categoría
          </button>
          <button
            onClick={() => setActiveTab('topn')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'topn'
                ? 'border-mac-accent text-mac-accent font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowDownNarrowWide className="w-3.5 h-3.5" />
            Top Registros
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[420px] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                <span>COLUMNA / TIPO</span>
                <span>ÚNICOS / NULOS</span>
                <span>RANGO O MUESTRA</span>
              </div>
              {profiledColumns.map((col) => (
                <div
                  key={col.name}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{col.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        col.type === 'number'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : col.type === 'string'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-purple-50 border-purple-200 text-purple-700'
                      }`}
                    >
                      {col.type === 'number' ? 'número' : col.type === 'string' ? 'texto' : col.type}
                    </span>
                  </div>

                  <div className="font-mono text-slate-500 text-[11px]">
                    {col.distinctCount} únicos | {col.nullCount} vacíos
                  </div>

                  <div className="font-mono text-slate-600 dark:text-slate-300 text-[11px] max-w-[220px] truncate text-right">
                    {col.type === 'number' && col.min !== undefined && col.max !== undefined
                      ? `[${col.min.toLocaleString()} ... ${col.max.toLocaleString()}]`
                      : col.sampleValues.slice(0, 3).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'filter' && (
            <div className="space-y-4 py-2">
              <p className="text-slate-600 dark:text-slate-300">
                Filtra los datos para ver solo los que cumplan una condición:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Columna</label>
                  <select
                    value={filterCol}
                    onChange={(e) => setFilterCol(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
                  >
                    {profiledColumns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Condición</label>
                  <select
                    value={filterOp}
                    onChange={(e) => setFilterOp(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
                  >
                    <option value=">">Mayor que (&gt;)</option>
                    <option value="<">Menor que (&lt;)</option>
                    <option value="=">Igual a (=)</option>
                    <option value="!=">Diferente de (!=)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Valor</label>
                  <input
                    type="text"
                    value={filterVal}
                    onChange={(e) => setFilterVal(e.target.value)}
                    placeholder="Ej. 40000"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-mac-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleApplyFilter}
                  className="px-4 py-2 bg-mac-accent hover:bg-mac-accentHover text-white rounded-md font-medium"
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          )}

          {activeTab === 'groupby' && (
            <div className="space-y-4 py-2">
              <p className="text-slate-600 dark:text-slate-300">
                Calcula totales o promedios agrupando por una categoría:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Agrupar por</label>
                  <select
                    value={groupCol}
                    onChange={(e) => setGroupCol(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
                  >
                    {profiledColumns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Métrica</label>
                  <select
                    value={metricCol}
                    onChange={(e) => setMetricCol(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
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
                  <label className="block text-slate-500 mb-1 font-medium">Cálculo</label>
                  <select
                    value={aggOp}
                    onChange={(e) => setAggOp(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
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
                  className="px-4 py-2 bg-mac-accent hover:bg-mac-accentHover text-white rounded-md font-medium"
                >
                  Agrupar y Graficar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'topn' && (
            <div className="space-y-4 py-2">
              <p className="text-slate-600 dark:text-slate-300">
                Muestra únicamente los elementos con mayor valor:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Columna a ordenar</label>
                  <select
                    value={topCol}
                    onChange={(e) => setTopCol(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
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
                  <label className="block text-slate-500 mb-1 font-medium">¿Cuántos mostrar?</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={topCount}
                    onChange={(e) => setTopCount(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleApplyTopN}
                  className="px-4 py-2 bg-mac-accent hover:bg-mac-accentHover text-white rounded-md font-medium"
                >
                  Mostrar Top {topCount}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 px-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer ({activeRows.length} de {rawRows.length} filas activas)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
