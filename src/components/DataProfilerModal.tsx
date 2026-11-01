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
            Filtrar Datos
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
        <div className="p-5 max-h-[420px] overflow-y-auto">
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
            <div className="space-y-4 py-2">
              <p className="text-[#5e4634]">
                Filtra los datos para ver solo los que cumplan una condición:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Columna</label>
                  <select
                    value={filterCol}
                    onChange={(e) => setFilterCol(e.target.value)}
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
                  <label className="block text-[#5e4634] mb-1 font-medium">Condición</label>
                  <select
                    value={filterOp}
                    onChange={(e) => setFilterOp(e.target.value as any)}
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:border-[#e11d48] focus:outline-none"
                  >
                    <option value=">">Mayor que (&gt;)</option>
                    <option value="<">Menor que (&lt;)</option>
                    <option value="=">Igual a (=)</option>
                    <option value="!=">Diferente de (!=)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Valor</label>
                  <input
                    type="text"
                    value={filterVal}
                    onChange={(e) => setFilterVal(e.target.value)}
                    placeholder="Ej. 40000"
                    className="w-full bg-white border border-[#dfd2c4] rounded-lg p-2 text-[#2c1a0e] shadow-2xs focus:outline-none focus:border-[#e11d48]"
                  >
                  </input>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleApplyFilter}
                  className="px-4 py-2 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl font-medium shadow-xs cursor-pointer"
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          )}

          {activeTab === 'groupby' && (
            <div className="space-y-4 py-2">
              <p className="text-[#5e4634]">
                Calcula totales o promedios agrupando por una categoría:
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#5e4634] mb-1 font-medium">Agrupar por</label>
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
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
