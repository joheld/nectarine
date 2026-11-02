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
  SlidersHorizontal,
  Disc,
  Orbit,
  Sparkles,
  Copy,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { datasetProfiler } from '../services/profiler';
import { exportService } from '../services/exportService';
import { ChartType } from '../engine/types';
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
    loadDataset,
    reconcileDataset,
  } = useDataStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copyToast, setCopyToast] = useState(false);

  const compatibilities = datasetProfiler.evaluateCompatibility(profiledColumns, rawRows.length);

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
    <div className="h-12 bg-[#f8f5ee] border-b border-[#e6dcce] px-4 flex items-center justify-between text-xs select-none z-40 gap-4">
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#faf7f2] active:bg-[#ede5db] text-[#2c1a0e] border border-[#e6dcce] transition-colors font-medium shadow-2xs cursor-pointer"
          title="Importar un archivo CSV, JSON o Parquet desde tu equipo"
        >
          <Upload className="w-3.5 h-3.5 text-[#e11d48]" />
          <span>Subir Archivo</span>
        </button>

        {rawRows.length > 0 && (
          <button
            onClick={handleNativeReconcile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] active:bg-[#bfdbfe] text-[#0369a1] border border-[#bfdbfe] transition-colors font-medium shadow-2xs cursor-pointer"
            title="Cargar dataset actualizado preservando todas tus mutaciones artísticas, notas y curvas por clave"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Hot-Reload</span>
          </button>
        )}

        <button
          onClick={onOpenProfiler}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors font-medium shadow-2xs cursor-pointer ${
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

      {/* 2. Chart Types Segmented Control (High Density, Crystal Clear & Balanced) */}
      <div className="flex items-center bg-[#ede5db] p-1 rounded-xl border border-[#dfd2c4] gap-0.5">
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#e11d48] text-white shadow-xs font-semibold'
                  : isCompatible
                  ? 'text-[#5e4634] hover:text-[#2c1a0e] hover:bg-white/80'
                  : 'text-[#8c7664] opacity-40 cursor-not-allowed'
              }`}
            >
              {btn.icon}
              <span className={`text-[11px] whitespace-nowrap ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Figma Copy & Clean SVG Export */}
      <div className="flex items-center gap-2 shrink-0">
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
          <kbd className="hidden xl:inline text-[9px] font-mono text-[#8c7664] bg-[#f0e7dc] px-1 py-0.2 rounded border border-[#dfd2c4]">
            ⌘C
          </kbd>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#e11d48] hover:bg-[#be123c] active:translate-y-px text-white font-medium shadow-[0_1px_2px_rgba(225,29,72,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
          title="Descargar ilustración vectorial pura en formato SVG"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar SVG</span>
        </button>
      </div>
    </div>
  );
};
