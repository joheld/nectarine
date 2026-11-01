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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 backdrop-blur-sm select-none p-4 animate-in fade-in zoom-in-95 duration-150">
      <div className="w-full max-w-lg bg-white border border-amber-300 rounded-xl shadow-2xl overflow-hidden text-xs text-stone-800">
        {/* Header */}
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-950 text-sm">
              Aviso de Rendimiento de Gráficos
            </h3>
            <p className="text-[11px] text-amber-800">
              {guardrailCheck.nodeCount.toLocaleString()} puntos detectados (Límite recomendado: {guardrailCheck.threshold.toLocaleString()})
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="p-4 space-y-4">
          <p className="text-stone-600 leading-relaxed">
            {guardrailCheck.message}
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold text-stone-700 text-[11px] tracking-wide uppercase">
              Opciones Recomendadas:
            </h4>

            {/* Mitigation 1: Sample */}
            <div
              onClick={handleSample2000}
              className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 hover:border-cinnamon-600 cursor-pointer transition-all flex items-start gap-3"
            >
              <Filter className="w-4 h-4 text-cinnamon-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Mostrar los 2,000 puntos principales
                </span>
                <span className="text-stone-500 text-[11px]">
                  Conserva la forma del gráfico mostrando los registros más representativos sin lentitud.
                </span>
              </div>
            </div>

            {/* Mitigation 2: Continue */}
            <div
              onClick={dismissGuardrail}
              className="p-3 rounded-lg bg-stone-50 border border-stone-200 hover:border-emerald-600 cursor-pointer transition-all flex items-start gap-3"
            >
              <Zap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 block">
                  Continuar en modo rápido
                </span>
                <span className="text-stone-500 text-[11px]">
                  Dibuja los puntos con trazado ligero para mantener la fluidez.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            onClick={dismissGuardrail}
            className="px-3 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium transition-colors"
          >
            Dibujar Todo
          </button>
        </div>
      </div>
    </div>
  );
};
