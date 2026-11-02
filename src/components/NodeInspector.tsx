import React, { useState, useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { useLayerStore } from '../store/layerStore';
import { colorService, EDITORIAL_PALETTES } from '../services/colorService';
import { textureService, STUDIO_FINISHES } from '../services/textureService';
import { GLYPH_OPTIONS } from '../engine/glyphMath';
import { GlyphShape, StudioFinish } from '../engine/types';
import {
  RotateCcw,
  Pin,
  MessageSquarePlus,
  X,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Palette,
  Sparkles,
  Layers,
  SunMedium,
  Check,
  Database,
} from 'lucide-react';

export const NodeInspector: React.FC = () => {
  const {
    baseNodes,
    rawRows,
    datasetName,
    activeFilters,
    defaultGlyphShape,
    setDefaultGlyphShape,
    recalculateLayout,
  } = useDataStore();
  const {
    selectedNodeIds,
    clearSelection,
    mutations,
    updateFill,
    updateGlyphShape,
    setManualScale,
    togglePin,
    resetMutation,
    calculateDistortion,
    isGlowEnabled,
    toggleGlow,
  } = useMutationStore();
  const { addAnnotation } = useLayerStore();

  const [currentFinish, setCurrentFinish] = useState<StudioFinish>(textureService.getActiveFinish());
  const currentPalette = colorService.getPalette();

  useEffect(() => {
    return textureService.subscribe((finish) => {
      setCurrentFinish(finish);
    });
  }, []);

  const handlePaletteChange = (paletteId: string) => {
    colorService.setPalette(paletteId);
    recalculateLayout();
  };

  const handleFinishChange = (finish: StudioFinish) => {
    textureService.setFinish(finish);
  };

  const selectedId = selectedNodeIds[selectedNodeIds.length - 1];

  // -------------------------------------------------------------
  // STATE A: Document & Studio Global Inspector (Nothing selected)
  // -------------------------------------------------------------
  if (!selectedId) {
    return (
      <aside className="w-72 bg-[#f8f5ee] border-l border-[#e6dcce] flex flex-col h-full select-none text-xs z-30 shrink-0">
        {/* Header */}
        <div className="h-11 px-4 border-b border-[#e6dcce] flex items-center justify-between bg-[#f3ece0]">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#e11d48]" />
            <span className="font-semibold text-[#2c1a0e] text-[11px] uppercase tracking-wider">
              Estudio & Estilo
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#8c7664] bg-[#ebd9c8] px-2 py-0.5 rounded-md">
            Global
          </span>
        </div>

        <div className="p-3 flex-1 overflow-y-auto space-y-3">
          {/* 1. Color Palette Selector with Live Swatches */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#2c1a0e] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#e11d48]" />
                <span>Paleta Cromática</span>
              </label>
              <span className="text-[10px] text-[#8c7664] font-medium">{currentPalette.name}</span>
            </div>

            <div className="space-y-1">
              {EDITORIAL_PALETTES.map((p) => {
                const isSelected = p.id === currentPalette.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePaletteChange(p.id)}
                    className={`w-full text-left p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-white border-[#e11d48] shadow-2xs ring-1 ring-[#e11d48]/20'
                        : 'bg-[#faf7f2] border-[#dfd2c4] hover:bg-white hover:border-[#c4b5a5]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10.5px] font-medium text-[#2c1a0e]">
                      <span>{p.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#e11d48]" />}
                    </div>
                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1">
                      {p.colors.map((c, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 rounded-xs border border-black/10"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Master Glyph Morphology */}
          <div className="space-y-1.5 pt-2 border-t border-[#e6dcce]">
            <label className="text-[11px] font-semibold text-[#2c1a0e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Morfología de Glifos</span>
            </label>
            <div className="grid grid-cols-2 gap-1">
              {GLYPH_OPTIONS.map((g) => {
                const isSelected = defaultGlyphShape === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setDefaultGlyphShape(g.id)}
                    className={`px-2 py-1 rounded-md border text-[10.5px] font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-xs'
                        : 'bg-white text-[#5e4634] border-[#dfd2c4] hover:border-[#c4b5a5] hover:text-[#2c1a0e]'
                    }`}
                  >
                    <span>{g.label}</span>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Studio Finishes / Textures */}
          <div className="space-y-1.5 pt-2 border-t border-[#e6dcce]">
            <label className="text-[11px] font-semibold text-[#2c1a0e] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>Textura & Acabado Editorial</span>
            </label>
            <div className="space-y-1">
              {STUDIO_FINISHES.map((f) => {
                const isSelected = currentFinish === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFinishChange(f.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg border text-[10.5px] transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#7c3aed] text-[#2c1a0e] shadow-xs ring-1 ring-[#7c3aed]/20 font-medium'
                        : 'bg-[#faf7f2] border-[#dfd2c4] text-[#5e4634] hover:bg-white hover:text-[#2c1a0e]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#2c1a0e]">{f.label}</div>
                      <div className="text-[9.5px] text-[#8c7664]">{f.description}</div>
                    </div>
                    {isSelected && <Check className="w-3 h-3 text-[#7c3aed] shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Atmosphere & Glow */}
          <div className="pt-1.5 border-t border-[#e6dcce]">
            <button
              onClick={toggleGlow}
              className={`w-full p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                isGlowEnabled
                  ? 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c] shadow-xs'
                  : 'bg-white border-[#dfd2c4] text-[#5e4634] hover:bg-[#faf7f2]'
              }`}
            >
              <div className="flex items-center gap-2">
                <SunMedium className={`w-3.5 h-3.5 ${isGlowEnabled ? 'text-[#ea580c]' : 'text-[#8c7664]'}`} />
                <div className="text-left">
                  <div className="font-semibold text-[11px] text-[#2c1a0e]">Resplandor Estelar (Glow)</div>
                  <div className="text-[9.5px] text-[#8c7664]">Halos de difusión de luz SVG</div>
                </div>
              </div>
              <div
                className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${
                  isGlowEnabled ? 'bg-[#ea580c]' : 'bg-[#dfd2c4]'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    isGlowEnabled ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* 5. Dataset Summary Metrics */}
          <div className="pt-2 border-t border-[#e6dcce] space-y-1.5 text-[11px] text-[#8c7664]">
            <div className="flex items-center gap-1.5 text-[#2c1a0e] font-semibold text-xs">
              <Database className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Resumen del Dataset</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-[#dfd2c4] space-y-1 font-mono text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-[#8c7664]">Archivo:</span>
                <span className="text-[#2c1a0e] font-bold truncate max-w-[140px]">{datasetName || 'Ninguno'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c7664]">Filas totales:</span>
                <span className="text-[#2c1a0e] tabular-nums">{rawRows.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8c7664]">Vectores en lienzo:</span>
                <span className="text-[#2c1a0e] tabular-nums font-bold">{baseNodes.length}</span>
              </div>
              {activeFilters && activeFilters.length > 0 && (
                <div className="flex justify-between text-[#ea580c]">
                  <span>Filtros activos:</span>
                  <span className="tabular-nums font-bold">{activeFilters.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // STATE B: Single Node Inspector (Specific vector selected)
  // -------------------------------------------------------------
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
    <aside className="w-72 bg-[#f8f5ee] border-l border-[#e6dcce] flex flex-col h-full select-none text-xs z-30 shrink-0">
      {/* Header */}
      <div className="h-11 px-4 border-b border-[#e6dcce] flex items-center justify-between bg-[#f3ece0]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#e11d48]" />
          <span className="font-semibold text-[#2c1a0e] text-[11px] uppercase tracking-wider">
            Inspector de Vector
          </span>
        </div>
        <button
          onClick={clearSelection}
          className="p-1 rounded-md hover:bg-[#ede5db] text-[#8c7664] hover:text-[#2c1a0e] cursor-pointer"
          title="Deseleccionar vector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 flex-1 overflow-y-auto space-y-4">
        {/* Title & Category Badge */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#c2410c] bg-[#fff7ed] px-2 py-0.5 rounded border border-[#fed7aa]">
            {node.category}
          </span>
          <h3 className="text-sm font-bold text-[#2c1a0e] mt-1.5 leading-snug">
            {node.label}
          </h3>
        </div>

        {/* Data Truth / Distortion Status Badge */}
        <div
          className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
            distortion.isDistorted
              ? 'bg-[#fff7ed] border-[#fed7aa] text-[#9a3412]'
              : 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
          }`}
        >
          {distortion.isDistorted ? (
            <ShieldAlert className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <div className="font-semibold text-[11px]">
              {distortion.isDistorted ? 'Desviación Detectada' : 'Fidelidad Matemática 100%'}
            </div>
            <div className="text-[10px] leading-tight opacity-90">
              {distortion.isDistorted
                ? `Desplazado ${distortion.positionDeltaPx}px (Desviación ética: ${distortion.distortionPct}%)`
                : 'Coordenadas fieles al dato empírico original'}
            </div>
          </div>
        </div>

        {/* Individual Glyph Morphology */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#2c1a0e] flex items-center justify-between">
            <span>Morfología de este Vector</span>
            {mut?.glyphShape && (
              <button
                onClick={() => updateGlyphShape(node.id, undefined as unknown as GlyphShape)}
                className="text-[10px] text-[#e11d48] hover:underline"
              >
                Heredar global
              </button>
            )}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {GLYPH_OPTIONS.map((g) => {
              const isSelected = (mut?.glyphShape || defaultGlyphShape) === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => updateGlyphShape(node.id, g.id)}
                  className={`px-1.5 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                    isSelected
                      ? 'bg-[#e11d48] text-white border-[#e11d48]'
                      : 'bg-white text-[#5e4634] border-[#dfd2c4] hover:bg-[#faf7f2]'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#2c1a0e]">Color del Vector</label>
          <div className="flex flex-wrap gap-1.5">
            {colorPresets.map((c) => {
              const currentColor = mut?.customFill || colorService.getColorForCategory(node.category);
              return (
                <button
                  key={c}
                  onClick={() => updateFill(node.id, c)}
                  className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                    currentColor === c
                      ? 'ring-2 ring-[#e11d48] ring-offset-1 scale-105'
                      : 'border-black/10'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Aplicar color ${c}`}
                />
              );
            })}
          </div>
        </div>

        {/* Manual Scale Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-semibold text-[#2c1a0e]">Escala Visual</span>
            <span className="font-mono text-[10px] text-[#8c7664] tabular-nums">
              {currentScale.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.05"
            value={currentScale}
            onChange={(e) => setManualScale(node.id, parseFloat(e.target.value))}
            className="w-full accent-[#e11d48] cursor-pointer"
          />
        </div>

        {/* Actions (Pin, Reset, Callout) */}
        <div className="pt-2 border-t border-[#e6dcce] space-y-2">
          <button
            onClick={() => togglePin(node.id)}
            className={`w-full py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isPinned
                ? 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]'
                : 'bg-white border-[#dfd2c4] text-[#5e4634] hover:bg-[#faf7f2]'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
            <span>{isPinned ? 'Posición Anclada' : 'Anclar Coordenada'}</span>
          </button>

          <button
            onClick={handleAddCallout}
            className="w-full py-2 px-3 rounded-lg bg-white border border-[#dfd2c4] text-[#5e4634] hover:bg-[#faf7f2] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Añadir Anotación Atada</span>
          </button>

          {mut && (
            <button
              onClick={handleResetPosition}
              className="w-full py-2 px-3 rounded-lg bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] hover:bg-[#ffe4e6] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer a Matemática</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
