import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { NectarineLogo } from './NectarineLogo';

export const TitleBar: React.FC = () => {
  const { datasetName, baseNodes } = useDataStore();
  const { mutations } = useMutationStore();
  const pinnedCount = Object.values(mutations).filter((m) => m.isPinned).length;

  return (
    <header className="h-10 min-h-[40px] bg-[#f8f5ee] border-b border-[#e6dcce] flex items-center justify-between px-4 mac-titlebar select-none z-50">
      {/* Left traffic lights placeholder spacing */}
      <div className="flex items-center gap-3 w-48 no-drag">
        <div className="w-16" /> {/* Reserved space for macOS native stoplights */}
      </div>

      {/* Center Clean App & Dataset Title with Nectarine Logo */}
      <div className="flex items-center gap-2.5 text-xs font-medium">
        <NectarineLogo size={22} className="w-[22px] h-[22px] shrink-0" />
        <span className="font-bold text-[#2c1a0e] tracking-tight text-sm">Nectarine</span>
        <span className="text-[#c4b5a5]">/</span>
        <span className="text-[#5e4634] font-medium text-[11px] bg-[#f0e7dc] px-2.5 py-0.5 rounded-md border border-[#e2d5c5]">
          {datasetName}
        </span>
      </div>

      {/* Right Telemetry */}
      <div className="flex items-center gap-2.5 no-drag text-[11px]">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f0e7dc] border border-[#e2d5c5] text-[#5e4634] font-mono">
          <Activity className="w-3.5 h-3.5 text-[#e11d48]" />
          <span>{baseNodes.length} nodos</span>
        </div>

        {pinnedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#fff7ed] border border-[#fed7aa] text-[#9a3412] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>{pinnedCount} fijos</span>
          </div>
        )}
      </div>
    </header>
  );
};