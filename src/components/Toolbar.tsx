import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  Download,
  ScatterChart,
  CircleDot,
  BarChart3,
  Network,
  Share2,
  Waves,
  Palette,
  SlidersHorizontal,
  Hand,
  Pointer,
  Move,
  Spline,
  MessageSquarePlus,
  RotateCcw,
  Disc,
  Orbit,
  Sparkles,
  SunMedium,
  Copy,
  RefreshCw,
  Layers,
  Check,
} from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { colorService, EDITORIAL_PALETTES } from '../services/colorService';
import { textureService, STUDIO_FINISHES } from '../services/textureService';
import { datasetProfiler } from '../services/profiler';
import { exportService } from '../services/exportService';
import { ChartType, StudioFinish, GlyphShape } from '../engine/types';
import { GLYPH_OPTIONS } from '../engine/glyphMath';
import { openNativeFileDialog, processDataFile } from '../services/fileImportHelper';

interface ToolbarProps {
  onOpenProfiler: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenProfiler, svgRef }) => {
  const {
    chartType,
    setChartType,
    profiledColumns,
    rawRows,
    activeFilters,
    defaultGlyphShape,
    setDefaultGlyphShape,
    loadDataset,
    reconcileDataset,
    recalculateLayout,
  } = useDataStore();
  const { activeTool, setActiveTool, resetAllMutations, mutations, isGlowEnabled, toggleGlow } = useMutationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copyToast, setCopyToast] = useState(false);
  const [currentFinish, setCurrentFinish] = useState(textureService.getActiveFinish());

  useEffect(() => {
    return textureService.subscribe((finish) => {
      setCurrentFinish(finish);
    });
  }, []);

  const compatibilities = datasetProfiler.evaluateCompatibility(profiledColumns, rawRows.length);
  const currentPalette = colorService.getPalette();

  const handlePaletteChange = (paletteId: string) => {
    colorService.setPalette(paletteId);
    recalculateLayout();
  };

  const handleFinishChange = (finish: StudioFinish) => {
    textureService.setFinish(finish);
  };

  const handleNativeImport = async () => {
    await openNativeFileDialog(loadDataset, fileInputRef.current);
  };

  const handleNativeReconcile = async () => {
    await openNativeFileDialog((name, rows) => reconcileDataset(name, rows), fileInputRef.current);
  };

  const handleWebFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (rawRows.length > 0) {
      await processDataFile(file, (name, rows) => reconcileDataset(name, rows));
    } else {
      await processDataFile(file, loadDataset);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!svgRef.current) return;
    const cleanSvg = exportService.cleanAndPurgeSVG(svgRef.current);
    const result = await exportService.copyToClipboard(cleanSvg);
    if (result.success) {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 3200);
    } else {
      alert(result.message);
    }
  };

  // Global ⌘C / Ctrl+C shortcut to copy clean SVG to Figma/Illustrator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        handleCopyToClipboard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = async () => {
    if (!svgRef.current) return;
    const cleanSvg = exportService.cleanAndPurgeSVG(svgRef.current);
    const result = await exportService.exportSVG(cleanSvg, 'nectarine_ilustracion.svg');
    if (result.success) {
      alert(`¡Ilustración vectorial exportada con éxito!\nGuardada en: ${result.filePath}`);
    }
  };

  const chartButtons: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'scatter', label: 'Dispersión', icon: <ScatterChart className="w-4 h-4" /> },
    { type: 'bubble', label: 'Burbujas', icon: <CircleDot className="w-4 h-4" /> },
    { type: 'chord', label: 'Cuerdas', icon: <Disc className="w-4 h-4" /> },
    { type: 'spiral', label: 'Espiral', icon: <Orbit className="w-4 h-4" /> },
    { type: 'celestial', label: 'Celestial', icon: <Sparkles className="w-4 h-4" /> },
    { type: 'bar', label: 'Barras', icon: <BarChart3 className="w-4 h-4" /> },
    { type: 'voronoi', label: 'Mosaico', icon: <Share2 className="w-4 h-4" /> },
    { type: 'network', label: 'Red', icon: <Network className="w-4 h-4" /> },
    { type: 'stream', label: 'Ondas', icon: <Waves className="w-4 h-4" /> },
  ];

  return (
    <div className="h-12 bg-[#f8f5ee] border-b border-[#e6dcce] px-4 flex items-center justify-between text-xs select-none z-40 gap-3">
      {/* 1. File Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,.parquet"
          className="hidden"
          onChange={handleWebFileChange}
        />
        <button
          onClick={handleNativeImport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#faf7f2] active:bg-[#ede5db] text-[#2c1a0e] border border-[#e6dcce] transition-colors font-medium shadow-2xs"
          title="Importar un archivo CSV, JSON o Parquet desde tu equipo"
        >
          <Upload className="w-3.5 h-3.5 text-[#e11d48]" />
          <span>Subir Archivo</span>
        </button>

        {rawRows.length > 0 && (
          <button
            onClick={handleNativeReconcile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] active:bg-[#bfdbfe] text-[#0369a1] border border-[#bfdbfe] transition-colors font-medium shadow-2xs"
            title="Cargar dataset actualizado preservando todas tus mutaciones artísticas, notas y curvas por clave"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Hot-Reload</span>
          </button>
        )}

        <button
          onClick={onOpenProfiler}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors font-medium shadow-2xs ${
            activeFilters && activeFilters.length > 0
              ? 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c]'
              : 'bg-white hover:bg-[#faf7f2] text-[#2c1a0e] border-[#e6dcce]'
          }`}
          title="Ver columnas, valores y filtrar datos sin fórmulas"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#f97316]" />
          <span>Filtros</span>
          {activeFilters && activeFilters.length > 0 && (
            <span className="px-1.5 py-0.2 bg-[#ea580c] text-white text-[9px] rounded-full font-mono font-bold">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      <div className="h-5 w-px bg-[#e6dcce] shrink-0" />

      {/* 2. Chart Types Segmented Control (Airy & Spacious: active shows label, others icon-only) */}
      <div className="flex items-center bg-[#ede5db] p-1 rounded-xl border border-[#dfd2c4] gap-0.5 shrink-0">
        {chartButtons.map((btn) => {
          const compat = compatibilities.find((c) => c.type === btn.type);
          const isCompatible = compat ? compat.isCompatible : true;
          const isSelected = chartType === btn.type;

          return (
            <button
              key={btn.type}
              onClick={() => isCompatible && setChartType(btn.type)}
              disabled={!isCompatible}
              title={
                isCompatible
                  ? `${btn.label}: Gráfico compatible con los datos actuales`
                  : `${btn.label}: Incompatible (${compat?.reason})`
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                isSelected
                  ? 'bg-[#e11d48] text-white shadow-xs font-semibold'
                  : isCompatible
                  ? 'text-[#5e4634] hover:text-[#2c1a0e] hover:bg-white/80'
                  : 'text-[#8c7664] opacity-35 cursor-not-allowed'
              }`}
            >
              {btn.icon}
              {isSelected && <span className="text-[11px] whitespace-nowrap">{btn.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="h-5 w-px bg-[#e6dcce] shrink-0" />

      {/* 3. Canvas Tools (Mano, Selección, Mover, Curvar Bézier, Anotar) */}
      <div className="flex items-center bg-[#ede5db] p-1 rounded-xl border border-[#dfd2c4] gap-0.5 shrink-0">
        <button
          onClick={() => setActiveTool('pan')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'pan' ? 'bg-white text-[#e11d48] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Mano: Encuadrar y navegar por el lienzo sin modificar datos [Tecla H o Espacio]"
        >
          <Hand className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTool('select')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'select' ? 'bg-white text-[#e11d48] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Seleccionar: Elige elementos individuales o arrastra sobre el fondo para selección múltiple con caja [Tecla V]"
        >
          <Pointer className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTool('move')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'move' ? 'bg-white text-[#e11d48] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Mover y Reubicar: Haz clic y arrastra nodos por el lienzo con control 1:1 [Tecla M]"
        >
          <Move className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTool('bezier')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'bezier' ? 'bg-white text-[#e11d48] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Curvar Bézier: Clic en cualquier dato para desplegar manetas de deformación orgánica [Tecla B]"
        >
          <Spline className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTool('annotate')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'annotate' ? 'bg-white text-[#e11d48] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Anotar: Clic en cualquier dato para crear notas explicativas atadas al punto [Tecla A]"
        >
          <MessageSquarePlus className="w-4 h-4" />
        </button>
      </div>

      <div className="h-5 w-px bg-[#e6dcce] shrink-0" />

      {/* 4. Style, Glow & Clean Export */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={toggleGlow}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            isGlowEnabled
              ? 'bg-[#fff7ed] border-[#fed7aa] text-[#c2410c] font-medium shadow-xs'
              : 'bg-white border-[#e6dcce] text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Alternar resplandor estelar y halos de luz (Glow SVG)"
        >
          <SunMedium className={`w-3.5 h-3.5 ${isGlowEnabled ? 'text-[#ea580c]' : 'text-[#8c7664]'}`} />
          <span className="text-[11px] hidden 2xl:inline">Luz & Glow</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#e6dcce] text-[#2c1a0e] shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-[#e11d48]" />
          <select
            value={currentPalette.id}
            onChange={(e) => handlePaletteChange(e.target.value)}
            className="bg-transparent text-[#2c1a0e] text-xs focus:outline-none cursor-pointer font-medium"
          >
            {EDITORIAL_PALETTES.map((p) => (
              <option key={p.id} value={p.id} className="bg-white text-[#2c1a0e]">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Morphological Glyph Studio */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#e6dcce] text-[#2c1a0e] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#c2410c]" />
          <select
            value={defaultGlyphShape}
            onChange={(e) => setDefaultGlyphShape(e.target.value as GlyphShape)}
            className="bg-transparent text-[#2c1a0e] text-xs focus:outline-none cursor-pointer font-medium"
            title="Morfología artesanal de las marcas de datos (Glifos)"
          >
            {GLYPH_OPTIONS.map((g) => (
              <option key={g.id} value={g.id} className="bg-white text-[#2c1a0e]">
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Studio Finishes (Risograph, Halftone, Paper) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#e6dcce] text-[#2c1a0e] shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-[#7c3aed]" />
          <select
            value={currentFinish}
            onChange={(e) => handleFinishChange(e.target.value as StudioFinish)}
            className="bg-transparent text-[#2c1a0e] text-xs focus:outline-none cursor-pointer font-medium"
            title="Texturas de imprenta editorial y grano analógico"
          >
            {STUDIO_FINISHES.map((f) => (
              <option key={f.id} value={f.id} className="bg-white text-[#2c1a0e]">
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Copy for Figma & Illustrator */}
        <button
          onClick={handleCopyToClipboard}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-medium shadow-2xs cursor-pointer ${
            copyToast
              ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#047857]'
              : 'bg-white hover:bg-[#faf7f2] active:bg-[#ede5db] text-[#2c1a0e] border-[#e6dcce]'
          }`}
          title="Copiar ilustración vectorial limpia al portapapeles para pegar con ⌘V en Figma o Adobe Illustrator [Atajo ⌘C]"
        >
          {copyToast ? (
            <Check className="w-3.5 h-3.5 text-[#059669]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#0284c7]" />
          )}
          <span>{copyToast ? '¡Copiado!' : 'Copiar a Figma'}</span>
        </button>

        {Object.keys(mutations).length > 0 && (
          <button
            onClick={resetAllMutations}
            className="p-1.5 rounded-lg text-[#8c7664] hover:text-[#e11d48] hover:bg-white transition-colors border border-transparent hover:border-[#e6dcce]"
            title="Devolver todos los puntos modificados a su coordenada matemática exacta"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] active:translate-y-px text-white font-medium shadow-[0_1px_2px_rgba(225,29,72,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all"
          title="Descargar ilustración vectorial pura en formato SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar SVG</span>
        </button>
      </div>
    </div>
  );
};