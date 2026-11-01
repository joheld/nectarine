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
    <div className="bg-gradient-to-r from-rose-50/85 via-orange-50/75 to-amber-50/85 border-b border-[#ebd9c8] px-5 py-2.5 flex items-center justify-between text-xs select-none backdrop-blur-sm z-30 transition-all">
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-900 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#e11d48]" />
          <span>Inicio Rápido</span>
        </div>

        <span className="text-stone-600 text-[11px] hidden md:inline">
          Prueba con datos listos para usar en un clic:
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadCountries}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-rose-50/70 text-[#2c1a0e] border border-[#ebd9c8] font-medium shadow-2xs transition-colors text-[11px]"
          >
            <Globe2 className="w-3.5 h-3.5 text-[#e11d48]" />
            <span>Países y Economía</span>
          </button>

          <button
            onClick={handleLoadSales}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-orange-50/70 text-[#2c1a0e] border border-[#ebd9c8] font-medium shadow-2xs transition-colors text-[11px]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Ventas de Tecnología</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-stone-500 text-[11px]">
        <div className="hidden lg:flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#e11d48]" />
          <span>
            <strong>Pista:</strong> Arrastra cualquier punto en el lienzo para retocarlo artísticamente.
          </span>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-md hover:bg-rose-100/60 text-stone-400 hover:text-stone-700"
          title="Ocultar barra de inicio rápido"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
