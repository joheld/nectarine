import React from 'react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { useLayerStore } from '../store/layerStore';
import {
  RotateCcw,
  Pin,
  MessageSquarePlus,
  X,
  Sliders,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

export const NodeInspector: React.FC = () => {
  const { baseNodes } = useDataStore();
  const {
    selectedNodeIds,
    clearSelection,
    mutations,
    updateFill,
    setManualScale,
    togglePin,
    resetMutation,
    calculateDistortion,
  } = useMutationStore();
  const { addAnnotation } = useLayerStore();

  const selectedId = selectedNodeIds[selectedNodeIds.length - 1];
  if (!selectedId) return null;

  const node = baseNodes.find((n) => n.id === selectedId);
  if (!node) return null;

  const mut = mutations[node.id];
  const distortion = calculateDistortion(node);
  const isPinned = mut?.isPinned || false;
  const currentScale = mut?.manualScale ?? 1.0;

  const colorPresets = [
    '#c2410c', // Cinnamon amber
    '#9a3412', // Dark cinnamon
    '#e63946', // Vermilion
    '#1d3557', // Prussian Blue
    '#2a9d8f', // Pine
    '#f59e0b', // Amber
    '#ff2a85', // Fluro Pink
    '#7c3aed', // Purple
  ];

  const handleResetPosition = () => {
    resetMutation(node.id);
  };

  const handleAddCallout = () => {
    const text = prompt('Escribe una nota para este punto:', `Dato: ${node.label}`);
    if (text) {
      addAnnotation(node.id, text, 40, -45, 'bezier');
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-mac-border flex flex-col h-full select-none text-xs shadow-macos z-30 animate-in slide-in-from-right-4 duration-150">
      {/* Header */}
      <div className="p-3 border-b border-mac-border flex items-center justify-between bg-stone-50/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cinnamon-700" />
          <span className="font-semibold text-stone-800">Detalles del Punto</span>
        </div>
        <button
          onClick={clearSelection}
          className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700"
          title="Cerrar panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Title & Category Badge */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-cinnamon-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200">
            {node.category}
          </span>
          <h3 className="text-base font-bold text-stone-900 mt-1.5 leading-snug">
            {node.label}
          </h3>
        </div>

        {/* Data Truth / Distortion Status Badge */}
        <div
          className={`p-3 rounded-lg border flex items-start gap-2.5 ${
            distortion.isDistorted
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {distortion.isDistorted ? (
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold block text-[11px]">
              {distortion.isDistorted ? 'Punto desplazado artísticamente' : 'Fiel al dato matemático (0% desviación)'}
            </span>
            <p className="text-[10px] opacity-90 mt-0.5">
              {distortion.isDistorted
                ? `Se movió un ${distortion.distortionPct}% de su coordenada real. Se proyecta un rastro guía azul hacia su origen.`
                : 'La posición visual coincide exactamente con el valor del dataset.'}
            </p>
          </div>
        </div>

        {/* Quick Reset to Math Truth */}
        {distortion.isDistorted && (
          <button
            onClick={handleResetPosition}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 font-medium transition-colors border border-amber-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regresar a su posición exacta</span>
          </button>
        )}

        {/* Node Values Card */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
            Valores del Registro
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {node.valueX !== undefined && (
              <div>
                <span className="text-stone-500 block text-[10px]">Eje X:</span>
                <span className="font-mono font-medium text-stone-800">{node.valueX.toLocaleString()}</span>
              </div>
            )}
            {node.valueY !== undefined && (
              <div>
                <span className="text-stone-500 block text-[10px]">Eje Y:</span>
                <span className="font-mono font-medium text-stone-800">{node.valueY.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Color Palette Buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-stone-700 block">
            Color del Punto
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {colorPresets.map((hex) => (
              <button
                key={hex}
                onClick={() => updateFill(node.id, hex)}
                className="w-6 h-6 rounded-full border border-stone-300 transition-transform hover:scale-110 active:scale-95 shadow-sm"
                style={{ backgroundColor: hex }}
                title={`Aplicar color ${hex}`}
              />
            ))}
          </div>
        </div>

        {/* Scale Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="font-medium text-stone-700">Tamaño Visual</span>
            <span className="font-mono text-stone-500">{Math.round(currentScale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={currentScale}
            onChange={(e) => setManualScale(node.id, parseFloat(e.target.value))}
            className="w-full accent-cinnamon-700 cursor-pointer"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <button
            onClick={() => togglePin(node.id)}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors border ${
              isPinned
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-amber-600" />
            <span>{isPinned ? 'Punto Anclado (Fijo)' : 'Fijar en esta posición'}</span>
          </button>

          <button
            onClick={handleAddCallout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cinnamon-700 hover:bg-cinnamon-600 active:bg-cinnamon-800 text-white font-medium shadow-sm transition-colors"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Añadir Rótulo con Flecha</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
