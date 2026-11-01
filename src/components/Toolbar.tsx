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
  RefreshCw,
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
  const { activeTool, setActiveTool, resetAllMutations, mutations } = useMutationStore();
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
              name: 'Archivos Analíticos',
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
    // Web fallback
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
    const result = await exportService.exportSVG(cleanSvg, 'vectura_vector_artwork.svg');
    if (result.success) {
      alert(`Exportación vectorial purgada guardada exitosamente en:\n${result.filePath}`);
    }
  };

  const chartButtons: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'scatter', label: 'Dispersión', icon: <ScatterChart className="w-3.5 h-3.5" /> },
    { type: 'bubble', label: 'Burbujas', icon: <CircleDot className="w-3.5 h-3.5" /> },
    { type: 'bar', label: 'Barras', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { type: 'voronoi', label: 'Voronoi', icon: <Share2 className="w-3.5 h-3.5" /> },
    { type: 'network', label: 'Fuerzas', icon: <Network className="w-3.5 h-3.5" /> },
    { type: 'stream', label: 'Flujo', icon: <Waves className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-11 bg-mac-surface border-b border-mac-border px-3 flex items-center justify-between text-xs select-none z-40">
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 border border-mac-border mac-rim transition-colors text-gray-200"
          title="Importar CSV, JSON o Parquet local a DuckDB en memoria"
        >
          <Upload className="w-3.5 h-3.5 text-mac-accent" />
          <span className="font-medium">Ingestar Datos</span>
        </button>

        <button
          onClick={onOpenProfiler}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-mac-border mac-rim text-gray-200"
          title="Abrir Asistente de Estructura y Transformaciones visuales sin SQL"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Perfilador & Filtros</span>
        </button>
      </div>

      {/* Chart Types (Compatible Illuminated, Incompatible Dimmed) */}
      <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/5">
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
                  ? `${btn.label}: Compatible`
                  : `${btn.label}: Incompatible (${compat?.reason})`
              }
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                isSelected
                  ? 'bg-mac-accent text-white shadow-sm font-semibold'
                  : isCompatible
                  ? 'text-gray-300 hover:text-white hover:bg-white/5'
                  : 'text-gray-600 opacity-40 cursor-not-allowed'
              }`}
            >
              {btn.icon}
              <span className="text-[11px]">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Selector (Select, Move, Bézier, Annotate) */}
      <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/5">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'select' ? 'bg-mac-panel text-mac-accent border border-mac-border' : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Herramienta Selección [V]"
        >
          <Pointer className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('move')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'move' ? 'bg-mac-panel text-mac-accent border border-mac-border' : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Herramienta Posición Manual & Anclaje [M]"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('bezier')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'bezier' ? 'bg-mac-panel text-mac-accent border border-mac-border' : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Herramienta Manetas Bézier [B]"
        >
          <Spline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('annotate')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'annotate' ? 'bg-mac-panel text-mac-accent border border-mac-border' : 'text-gray-400 hover:text-gray-200'
          }`}
          title="Herramienta Anotación Atada [A]"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editorial Palette & Clean Export */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-mac-border text-gray-300">
          <Palette className="w-3.5 h-3.5 text-pink-400" />
          <select
            value={currentPalette.id}
            onChange={(e) => handlePaletteChange(e.target.value)}
            className="bg-transparent text-gray-200 text-xs focus:outline-none cursor-pointer"
          >
            {EDITORIAL_PALETTES.map((p) => (
              <option key={p.id} value={p.id} className="bg-mac-panel text-gray-200">
                {p.name} ({p.blendMode})
              </option>
            ))}
          </select>
        </div>

        {Object.keys(mutations).length > 0 && (
          <button
            onClick={resetAllMutations}
            className="p-1.5 rounded-md text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
            title="Restablecer todas las mutaciones manuales a coordenadas matemáticas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium mac-rim shadow-sm transition-colors"
          title="Clonar SVG, purgar gizmos/fantasmas y exportar a disco"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar SVG</span>
        </button>
      </div>
    </div>
  );
};
