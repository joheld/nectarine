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
    <header className="h-[38px] min-h-[38px] bg-mac-surface border-b border-mac-border flex items-center justify-between px-3 mac-titlebar select-none z-50">
      {/* Left traffic lights placeholder spacing */}
      <div className="flex items-center gap-2.5 w-52 no-drag">
        <div className="w-14" /> {/* Space for macOS native stoplights */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800">
          <Database className="w-3 h-3 text-emerald-600" />
          <span>DuckDB Local</span>
        </div>
      </div>

      {/* Center Document Title with Cinnamon Branch Logo */}
      <div className="flex items-center gap-2 text-xs font-medium text-mac-text">
        <CinnamonLogo size={20} className="w-5 h-5 shrink-0" />
        <span className="font-bold text-stone-900 tracking-tight text-sm">Cinnamon</span>
        <span className="text-mac-textMuted">—</span>
        <span className="text-cinnamon-800 font-medium text-[11px]">Atelier de Datos & Arte</span>
        <span className="text-mac-textMuted hidden sm:inline">|</span>
        <span className="text-stone-600 font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded border border-mac-border">
          {datasetName}
        </span>
      </div>

      {/* Right Telemetry */}
      <div className="flex items-center gap-2 no-drag text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-100 border border-mac-border text-stone-700">
          <Activity className="w-3 h-3 text-cinnamon-700" />
          <span>{baseNodes.length} puntos</span>
        </div>

        {pinnedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            <span>{pinnedCount} fijos</span>
          </div>
        )}
      </div>
    </header>
  );
};
