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
    const result = await exportService.exportSVG(cleanSvg, 'lienzo_ilustracion.svg');
    if (result.success) {
      alert(`¡Archivo SVG vectorial exportado con éxito!\nGuardado en: ${result.filePath}`);
    }
  };

  const chartButtons: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'scatter', label: 'Dispersión', icon: <ScatterChart className="w-3.5 h-3.5" /> },
    { type: 'bubble', label: 'Burbujas', icon: <CircleDot className="w-3.5 h-3.5" /> },
    { type: 'bar', label: 'Barras', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { type: 'voronoi', label: 'Mosaico', icon: <Share2 className="w-3.5 h-3.5" /> },
    { type: 'network', label: 'Red', icon: <Network className="w-3.5 h-3.5" /> },
    { type: 'stream', label: 'Ondas', icon: <Waves className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-11 bg-mac-surface border-b border-mac-border px-3 flex items-center justify-between text-xs select-none z-40 transition-colors">
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/15 text-mac-text border border-mac-border transition-colors font-medium"
          title="Importar un archivo CSV, JSON o Parquet desde tu equipo"
        >
          <Upload className="w-3.5 h-3.5 text-mac-accent" />
          <span>Subir Archivo</span>
        </button>

        <button
          onClick={onOpenProfiler}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-mac-text border border-mac-border transition-colors font-medium"
          title="Ver columnas, valores y filtrar datos sin fórmulas"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
          <span>Filtros y Columnas</span>
        </button>
      </div>

      {/* Chart Types (Compatible Illuminated, Incompatible Dimmed) */}
      <div className="flex items-center bg-black/5 dark:bg-black/30 p-0.5 rounded-lg border border-mac-border">
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
                  ? 'bg-mac-accent text-white shadow-sm font-semibold'
                  : isCompatible
                  ? 'text-mac-textSecondary hover:text-mac-text hover:bg-black/5 dark:hover:bg-white/5'
                  : 'text-mac-textMuted opacity-40 cursor-not-allowed'
              }`}
            >
              {btn.icon}
              <span className="text-[11px]">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Selector (Select, Move, Curvar, Anotar) */}
      <div className="flex items-center bg-black/5 dark:bg-black/30 p-0.5 rounded-lg border border-mac-border">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'select' ? 'bg-mac-surface text-mac-accent shadow-sm border border-mac-border' : 'text-mac-textMuted hover:text-mac-text'
          }`}
          title="Seleccionar elemento [Tecla V]"
        >
          <Pointer className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('move')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'move' ? 'bg-mac-surface text-mac-accent shadow-sm border border-mac-border' : 'text-mac-textMuted hover:text-mac-text'
          }`}
          title="Arrastrar y mover libremente [Tecla M]"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('bezier')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'bezier' ? 'bg-mac-surface text-mac-accent shadow-sm border border-mac-border' : 'text-mac-textMuted hover:text-mac-text'
          }`}
          title="Deformar y curvar con manetas artísticas [Tecla B]"
        >
          <Spline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setActiveTool('annotate')}
          className={`p-1.5 rounded-md transition-colors ${
            activeTool === 'annotate' ? 'bg-mac-surface text-mac-accent shadow-sm border border-mac-border' : 'text-mac-textMuted hover:text-mac-text'
          }`}
          title="Crear notas explicativas atadas al punto [Tecla A]"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editorial Palette & Clean Export */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 border border-mac-border text-mac-text">
          <Palette className="w-3.5 h-3.5 text-pink-500" />
          <select
            value={currentPalette.id}
            onChange={(e) => handlePaletteChange(e.target.value)}
            className="bg-transparent text-mac-text text-xs focus:outline-none cursor-pointer font-medium"
          >
            {EDITORIAL_PALETTES.map((p) => (
              <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {Object.keys(mutations).length > 0 && (
          <button
            onClick={resetAllMutations}
            className="p-1.5 rounded-md text-mac-textMuted hover:text-amber-600 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Devolver todos los puntos modificados a su coordenada matemática exacta"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium shadow-sm transition-colors"
          title="Descargar ilustración vectorial pura en formato SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar SVG</span>
        </button>
      </div>
    </div>
  );
};
