import React from 'react';
import { AlertTriangle, Filter, Zap } from 'lucide-react';
import { useDataStore } from '../store/dataStore';

export const GuardrailWarning: React.FC = () => {
  const {
    guardrailCheck,
    isGuardrailModalOpen,
    dismissGuardrail,
    applyTopN,
    profiledColumns,
  } = useDataStore();

  if (!isGuardrailModalOpen || !guardrailCheck) return null;

  const handleSample2000 = () => {
    const numericCol = profiledColumns.find((c) => c.type === 'number')?.name || '';
    if (numericCol) {
      applyTopN(numericCol, 2000);
    }
    dismissGuardrail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md select-none p-4 animate-in fade-in zoom-in-95 duration-150">
      <div className="w-full max-w-lg bg-mac-surface border border-amber-500/40 rounded-xl shadow-macos overflow-hidden text-xs">
        {/* Header */}
        <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-200 text-sm">
              Guardarraíl de Rendimiento Vectorial
            </h3>
            <p className="text-[11px] text-amber-300/80">
              {guardrailCheck.nodeCount.toLocaleString()} nodos detectados (Umbral: {guardrailCheck.threshold.toLocaleString()})
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="p-4 space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {guardrailCheck.message}
          </p>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-200 text-[11px] tracking-wide uppercase">
              Opciones de Mitigación Recomendadas:
            </h4>

            {/* Mitigation 1: Sample */}
            <div
              onClick={handleSample2000}
              className="p-2.5 rounded-lg bg-mac-panel border border-mac-border/60 hover:border-mac-accent cursor-pointer transition-all flex items-start gap-3"
            >
              <Filter className="w-4 h-4 text-mac-accent mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-gray-200 block">
                  Muestreo Estadístico Inteligente (Top 2,000)
                </span>
                <span className="text-gray-400 text-[11px]">
                  Filtra los registros líderes conservando la dispersión visual sin saturar el motor DOM.
                </span>
              </div>
            </div>

            {/* Mitigation 2: Simplified View */}
            <div
              onClick={dismissGuardrail}
              className="p-2.5 rounded-lg bg-mac-panel border border-mac-border/60 hover:border-emerald-500 cursor-pointer transition-all flex items-start gap-3"
            >
              <Zap className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-gray-200 block">
                  Continuar en Modo Rendimiento
                </span>
                <span className="text-gray-400 text-[11px]">
                  Desactiva la teselación de Voronoi y los filtros de sombra complejos para acelerar el renderizado.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-mac-panel/40 border-t border-mac-border flex items-center justify-end gap-2">
          <button
            onClick={dismissGuardrail}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-gray-300 font-medium transition-colors"
          >
            Ignorar Riesgo y Renderizar Todo
          </button>
        </div>
      </div>
    </div>
  );
};
