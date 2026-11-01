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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-mac-surface border border-mac-border rounded-xl shadow-macos flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="h-11 px-4 border-b border-mac-border flex items-center justify-between bg-mac-panel/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-mac-accent" />
            <span className="font-semibold text-gray-100 text-sm">Asistente Estructural & Transformaciones</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-mac-border/60 bg-mac-bg/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-mac-accent text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Perfil de Columnas ({profiledColumns.length})
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'filter'
                ? 'border-mac-accent text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filtro sin SQL
          </button>
          <button
            onClick={() => setActiveTab('groupby')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'groupby'
                ? 'border-mac-accent text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart className="w-3.5 h-3.5" />
            Agrupación Categórica
          </button>
          <button
            onClick={() => setActiveTab('topn')}
            className={`px-3 py-1.5 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'topn'
                ? 'border-mac-accent text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ArrowDownNarrowWide className="w-3.5 h-3.5" />
            Top N Registros
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-[420px] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400 pb-1 border-b border-mac-border font-mono text-[11px]">
                <span>COLUMNA / TIPO</span>
                <span>DISTINTOS / NULOS</span>
                <span>RANGO / MUESTRA</span>
              </div>
              {profiledColumns.map((col) => (
                <div
                  key={col.name}
                  className="p-2 rounded bg-mac-panel/60 border border-mac-border/50 flex items-center justify-between hover:border-mac-border"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-200">{col.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        col.type === 'number'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : col.type === 'string'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                      }`}
                    >
                      {col.type}
                    </span>
                  </div>

                  <div className="font-mono text-gray-400 text-[11px]">
                    {col.distinctCount} únicos | {col.nullCount} nulos
                  </div>

                  <div className="font-mono text-gray-300 text-[11px] max-w-[220px] truncate text-right">
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
              <p className="text-gray-300">
                Aplica un filtro visual directo sobre los datos sin escribir sentencias SQL:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Columna</label>
                  <select
                    value={filterCol}
                    onChange={(e) => setFilterCol(e.target.value)}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
                  >
                    {profiledColumns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Operador</label>
                  <select
                    value={filterOp}
                    onChange={(e) => setFilterOp(e.target.value as any)}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
                  >
                    <option value=">">Mayor que (&gt;)</option>
                    <option value="<">Menor que (&lt;)</option>
                    <option value="=">Igual a (=)</option>
                    <option value="!=">Diferente de (!=)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Valor Umbral</label>
                  <input
                    type="text"
                    value={filterVal}
                    onChange={(e) => setFilterVal(e.target.value)}
                    placeholder="Ej. 40000"
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200 focus:outline-none focus:border-mac-accent"
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
              <p className="text-gray-300">
                Agrupa las observaciones por una categoría ordinal/nominal calculando su métrica:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Dimensión Categórica</label>
                  <select
                    value={groupCol}
                    onChange={(e) => setGroupCol(e.target.value)}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
                  >
                    {profiledColumns.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Métrica Cuantitativa</label>
                  <select
                    value={metricCol}
                    onChange={(e) => setMetricCol(e.target.value)}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
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
                  <label className="block text-gray-400 mb-1">Operación</label>
                  <select
                    value={aggOp}
                    onChange={(e) => setAggOp(e.target.value as any)}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
                  >
                    <option value="mean">Media Aritmética (AVG)</option>
                    <option value="sum">Suma Total (SUM)</option>
                    <option value="count">Recuento de Filas (COUNT)</option>
                    <option value="max">Valor Máximo (MAX)</option>
                    <option value="min">Valor Mínimo (MIN)</option>
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
              <p className="text-gray-300">
                Selecciona los registros líderes ordenados por la dimensión cuantitativa seleccionada:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Métrica de Ordenamiento</label>
                  <select
                    value={topCol}
                    onChange={(e) => setTopCol(e.target.value)}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
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
                  <label className="block text-gray-400 mb-1">Cantidad (N)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={topCount}
                    onChange={(e) => setTopCount(Number(e.target.value))}
                    className="w-full bg-mac-panel border border-mac-border rounded p-2 text-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleApplyTopN}
                  className="px-4 py-2 bg-mac-accent hover:bg-mac-accentHover text-white rounded-md font-medium"
                >
                  Extraer Top N
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 px-4 border-t border-mac-border flex items-center justify-between bg-mac-panel/40">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Transformaciones ({activeRows.length} de {rawRows.length} filas activas)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/15 text-white font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
