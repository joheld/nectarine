import React, { useRef } from 'react';
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
  Pointer,
  Move,
  Spline,
  MessageSquarePlus,
  RotateCcw,
  Disc,
  Orbit,
  Sparkles,
  SunMedium,
} from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { colorService, EDITORIAL_PALETTES } from '../services/colorService';
import { datasetProfiler } from '../services/profiler';
import { duckdbService } from '../services/duckdb';
import { exportService } from '../services/exportService';
import { ChartType } from '../engine/types';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, readFile } from '@tauri-apps/plugin-fs';

interface ToolbarProps {
  onOpenProfiler: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenProfiler, svgRef }) => {
  const { chartType, setChartType, profiledColumns, rawRows, loadDataset, recalculateLayout } = useDataStore();
  const { activeTool, setActiveTool, resetAllMutations, mutations, isGlowEnabled, toggleGlow } = useMutationStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compatibilities = datasetProfiler.evaluateCompatibility(profiledColumns, rawRows.length);
  const currentPalette = colorService.getPalette();

  const handlePaletteChange = (paletteId: string) => {
    colorService.setPalette(paletteId);
    recalculateLayout();
  };

  const handleNativeImport = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
        const selected = await open({
          multiple: false,
          filters: [
            {
              name: 'Archivos de Datos (CSV, JSON, Parquet)',
              extensions: ['csv', 'json', 'parquet'],
            },
          ],
        });

        if (selected && typeof selected === 'string') {
          const filename = selected.split('/').pop() || 'data';
          if (filename.endsWith('.parquet')) {
            const buffer = await readFile(selected);
            const rows = await duckdbService.ingestParquet(filename, buffer);
            loadDataset(filename, rows);
          } else if (filename.endsWith('.json')) {
            const text = await readTextFile(selected);
            const rows = await duckdbService.ingestJSON(filename, text);
            loadDataset(filename, rows);
          } else {
            const text = await readTextFile(selected);
            const rows = await duckdbService.ingestCSV(filename, text);
            loadDataset(filename, rows);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Tauri native dialog not available, using web fallback:', err);
    }
    fileInputRef.current?.click();
  };

  const handleWebFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.parquet')) {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const rows = await duckdbService.ingestParquet(file.name, buffer);
      loadDataset(file.name, rows);
    } else if (file.name.endsWith('.json')) {
      const text = await file.text();
      const rows = await duckdbService.ingestJSON(file.name, text);
      loadDataset(file.name, rows);
    } else {
      const text = await file.text();
      const rows = await duckdbService.ingestCSV(file.name, text);
      loadDataset(file.name, rows);
    }
  };

  const handleExport = async () => {
    if (!svgRef.current) return;
    const cleanSvg = exportService.cleanAndPurgeSVG(svgRef.current);
    const result = await exportService.exportSVG(cleanSvg, 'cinnamon_ilustracion.svg');
    if (result.success) {
      alert(`¡Ilustración vectorial exportada con éxito!\nGuardada en: ${result.filePath}`);
    }
  };

  const chartButtons: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'scatter', label: 'Dispersión', icon: <ScatterChart className="w-3.5 h-3.5" /> },
    { type: 'bubble', label: 'Burbujas', icon: <CircleDot className="w-3.5 h-3.5" /> },
    { type: 'chord', label: 'Cuerdas', icon: <Disc className="w-3.5 h-3.5" /> },
    { type: 'spiral', label: 'Espiral', icon: <Orbit className="w-3.5 h-3.5" /> },
    { type: 'celestial', label: 'Celestial', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { type: 'bar', label: 'Barras', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { type: 'voronoi', label: 'Mosaico', icon: <Share2 className="w-3.5 h-3.5" /> },
    { type: 'network', label: 'Red', icon: <Network className="w-3.5 h-3.5" /> },
    { type: 'stream', label: 'Ondas', icon: <Waves className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-11 bg-[#f8f5ee] border-b border-[#e6dcce] px-3 flex items-center justify-between text-xs select-none z-40">
      {/* File & Profiling Actions */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,.parquet"
          className="hidden"
          onChange={handleWebFileChange}
        />
        <button
          onClick={handleNativeImport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white hover:bg-[#faf7f2] active:bg-[#ede5db] text-[#2c1a0e] border border-[#e6dcce] transition-colors font-medium shadow-xs"
          title="Importar un archivo CSV, JSON o Parquet desde tu equipo"
        >
          <Upload className="w-3.5 h-3.5 text-[#b44b10]" />
          <span>Subir Archivo</span>
        </button>

        <button
          onClick={onOpenProfiler}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white hover:bg-[#faf7f2] text-[#2c1a0e] border border-[#e6dcce] transition-colors font-medium shadow-xs"
          title="Ver columnas, valores y filtrar datos sin fórmulas"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#d97706]" />
          <span>Filtros y Columnas</span>
        </button>
      </div>

      {/* Chart Types Segmented Control */}
      <div className="flex items-center bg-[#ede5db] p-0.5 rounded-lg border border-[#dfd2c4]">
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                isSelected
                  ? 'bg-[#b44b10] text-white shadow-xs font-semibold'
                  : isCompatible
                  ? 'text-[#5e4634] hover:text-[#2c1a0e] hover:bg-white/70'
                  : 'text-[#8c7664] opacity-40 cursor-not-allowed'
              }`}
            >
              {btn.icon}
              <span className="text-[11px]">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Selector (Select, Move, Curvar, Anotar) */}
      <div className="flex items-center bg-[#ede5db] p-0.5 rounded-lg border border-[#dfd2c4]">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'select' ? 'bg-white text-[#b44b10] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Seleccionar elemento [Tecla V]"
        >
          <Pointer className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('move')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'move' ? 'bg-white text-[#b44b10] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Arrastrar y mover libremente [Tecla M]"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('bezier')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'bezier' ? 'bg-white text-[#b44b10] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Deformar y curvar con manetas artísticas [Tecla B]"
        >
          <Spline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('annotate')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'annotate' ? 'bg-white text-[#b44b10] shadow-xs' : 'text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Crear notas explicativas atadas al punto [Tecla A]"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cinnamon Editorial Palette, Glow & Clean Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleGlow}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
            isGlowEnabled
              ? 'bg-[#fffbeb] border-[#fde68a] text-[#b45309] font-medium shadow-xs'
              : 'bg-white border-[#e6dcce] text-[#8c7664] hover:text-[#2c1a0e]'
          }`}
          title="Alternar resplandor estelar y halos de luz (Glow SVG)"
        >
          <SunMedium className={`w-3.5 h-3.5 ${isGlowEnabled ? 'text-[#d97706]' : 'text-[#8c7664]'}`} />
          <span className="text-[11px] hidden xl:inline">Luz & Glow</span>
        </button>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-[#e6dcce] text-[#2c1a0e] shadow-xs">
          <Palette className="w-3.5 h-3.5 text-[#b44b10]" />
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

        {Object.keys(mutations).length > 0 && (
          <button
            onClick={resetAllMutations}
            className="p-1.5 rounded-md text-[#8c7664] hover:text-[#b44b10] hover:bg-white transition-colors"
            title="Devolver todos los puntos modificados a su coordenada matemática exacta"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#b44b10] hover:bg-[#9a3412] active:bg-[#7c2d12] text-white font-medium shadow-xs transition-colors"
          title="Descargar ilustración vectorial pura en formato SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar SVG</span>
        </button>
      </div>
    </div>
  );
};
