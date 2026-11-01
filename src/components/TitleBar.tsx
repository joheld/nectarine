import React from 'react';
import { Database, ShieldCheck, Activity } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';

export const TitleBar: React.FC = () => {
  const { datasetName, baseNodes } = useDataStore();
  const { mutations } = useMutationStore();
  const pinnedCount = Object.values(mutations).filter((m) => m.isPinned).length;

  return (
    <header className="h-[38px] min-h-[38px] bg-mac-surface/90 border-b border-mac-border flex items-center justify-between px-3 mac-titlebar select-none z-50">
      {/* Left traffic lights placeholder spacing */}
      <div className="flex items-center gap-3 w-48 no-drag">
        <div className="w-14" /> {/* Space for macOS native stoplights */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>DuckDB WASM</span>
        </div>
      </div>

      {/* Center Document Title */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
        <span className="font-semibold text-white tracking-wide">Vectura Atelier</span>
        <span className="text-mac-textMuted">—</span>
        <span className="text-gray-400 font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
          {datasetName}
        </span>
      </div>

      {/* Right Telemetry & Status Badges */}
      <div className="flex items-center gap-2.5 no-drag text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300">
          <Activity className="w-3 h-3 text-mac-accent" />
          <span>{baseNodes.length} vectores</span>
        </div>

        {pinnedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldCheck className="w-3 h-3" />
            <span>{pinnedCount} anclados</span>
          </div>
        )}
      </div>
    </header>
  );
};
