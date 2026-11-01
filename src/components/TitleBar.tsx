import React from 'react';
import { Database, ShieldCheck, Activity } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { CinnamonLogo } from './CinnamonLogo';

export const TitleBar: React.FC = () => {
  const { datasetName, baseNodes } = useDataStore();
  const { mutations } = useMutationStore();
  const pinnedCount = Object.values(mutations).filter((m) => m.isPinned).length;

  return (
    <header className="h-[38px] min-h-[38px] bg-[#f8f5ee] border-b border-[#e6dcce] flex items-center justify-between px-3 mac-titlebar select-none z-50">
      {/* Left traffic lights placeholder spacing */}
      <div className="flex items-center gap-2.5 w-52 no-drag">
        <div className="w-14" /> {/* Space for macOS native stoplights */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[11px] font-mono text-[#065f46]">
          <Database className="w-3 h-3 text-[#059669]" />
          <span>DuckDB Local</span>
        </div>
      </div>

      {/* Center Document Title with Cinnamon Branch Logo */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <CinnamonLogo size={20} className="w-5 h-5 shrink-0" />
        <span className="font-bold text-[#2c1a0e] tracking-tight text-sm">Cinnamon</span>
        <span className="text-[#a89988]">—</span>
        <span className="text-[#b44b10] font-medium text-[11px]">Atelier Gráfico & Analítico</span>
        <span className="text-[#a89988] hidden sm:inline">|</span>
        <span className="text-[#5e4634] font-mono text-[11px] bg-[#ede5db] px-2 py-0.5 rounded border border-[#dfd2c4]">
          {datasetName}
        </span>
      </div>

      {/* Right Telemetry */}
      <div className="flex items-center gap-2 no-drag text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ede5db] border border-[#dfd2c4] text-[#5e4634]">
          <Activity className="w-3 h-3 text-[#b44b10]" />
          <span>{baseNodes.length} puntos</span>
        </div>

        {pinnedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#fffbeb] border border-[#fde68a] text-[#92400e]">
            <ShieldCheck className="w-3 h-3 text-[#d97706]" />
            <span>{pinnedCount} fijos</span>
          </div>
        )}
      </div>
    </header>
  );
};
