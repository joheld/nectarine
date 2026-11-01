import React, { useState } from 'react';
import { Sparkles, Globe2, ShoppingBag, Info, X } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { duckdbService } from '../services/duckdb';

export const QuickStartBar: React.FC = () => {
  const { loadDataset } = useDataStore();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleLoadCountries = async () => {
    const rows = await duckdbService.loadDefaultDataset();
    loadDataset('paises_y_desarrollo.csv', rows);
  };

  const handleLoadSales = async () => {
    const rows = await duckdbService.loadSalesDataset();
    loadDataset('ventas_tecnologia.csv', rows);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-slate-900/90 dark:via-indigo-950/80 dark:to-slate-900/90 border-b border-blue-200/50 dark:border-blue-900/40 px-4 py-2 flex items-center justify-between text-xs select-none backdrop-blur-sm z-30 transition-all">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inicio Rápido</span>
        </div>

        <span className="text-mac-textSecondary text-[11px] hidden md:inline">
          Prueba con datos listos para usar en un clic:
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLoadCountries}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-white/10 hover:bg-blue-50 text-blue-800 dark:text-blue-200 border border-blue-200/80 dark:border-white/10 font-medium shadow-sm transition-colors text-[11px]"
          >
            <Globe2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Países y Economía</span>
          </button>

          <button
            onClick={handleLoadSales}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-white/10 hover:bg-purple-50 text-purple-800 dark:text-purple-200 border border-purple-200/80 dark:border-white/10 font-medium shadow-sm transition-colors text-[11px]"
          >
            <ShoppingBag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>Ventas de Tecnología</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-mac-textMuted text-[11px]">
        <div className="hidden lg:flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-mac-accent" />
          <span>
            <strong>Pista:</strong> Arrastra cualquier punto en el lienzo para retocarlo artísticamente.
          </span>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-mac-textMuted hover:text-mac-text"
          title="Ocultar barra de inicio rápido"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
