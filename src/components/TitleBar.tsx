import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, Activity, Sun, Moon } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';

export const TitleBar: React.FC = () => {
  const { datasetName, baseNodes } = useDataStore();
  const { mutations } = useMutationStore();
  const pinnedCount = Object.values(mutations).filter((m) => m.isPinned).length;

  // Theme state: defaults to light!
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously had dark mode, otherwise default to light
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="h-[38px] min-h-[38px] bg-mac-surface border-b border-mac-border flex items-center justify-between px-3 mac-titlebar select-none z-50 transition-colors">
      {/* Left traffic lights placeholder spacing */}
      <div className="flex items-center gap-3 w-52 no-drag">
        <div className="w-14" /> {/* Space for macOS native stoplights */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
          <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>DuckDB Local</span>
        </div>
      </div>

      {/* Center Document Title */}
      <div className="flex items-center gap-2 text-xs font-medium text-mac-text">
        <span className="font-bold text-mac-text tracking-tight text-sm">Lienzo</span>
        <span className="text-mac-textMuted">—</span>
        <span className="text-mac-textSecondary text-[11px]">Taller de Datos & Arte</span>
        <span className="text-mac-textMuted hidden sm:inline">|</span>
        <span className="text-mac-textSecondary font-mono text-[11px] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-mac-border">
          {datasetName}
        </span>
      </div>

      {/* Right Telemetry & Theme Switcher */}
      <div className="flex items-center gap-2 no-drag text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-mac-border text-mac-textSecondary">
          <Activity className="w-3 h-3 text-mac-accent" />
          <span>{baseNodes.length} puntos</span>
        </div>

        {pinnedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
            <ShieldCheck className="w-3 h-3" />
            <span>{pinnedCount} fijos</span>
          </div>
        )}

        {/* 1-Click Theme Switcher (Sol / Luna) */}
        <button
          onClick={toggleTheme}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-mac-textSecondary transition-colors"
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
