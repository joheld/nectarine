import React, { useState } from 'react';
import { Globe2, ShoppingBag, X } from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { duckdbService } from '../services/duckdb';

interface QuickStartBarProps {
  onOpenDocs?: () => void;
}

export const QuickStartBar: React.FC<QuickStartBarProps> = ({ onOpenDocs }) => {
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
    <div className="bg-[#f6f2ea] border-b border-[#e6dcce] px-4 py-2 flex items-center justify-between text-xs select-none z-30 transition-all">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8c7664] font-medium">
          Muestras:
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadCountries}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-[#faf7f2] text-[#2c1a0e] border border-[#e6dcce] font-medium shadow-2xs transition-all active:translate-y-px text-[11px]"
            title="Cargar dataset de 30 países con PIB, esperanza de vida y región"
          >
            <Globe2 className="w-3.5 h-3.5 text-[#e11d48]" />
            <span>Países & Economía</span>
          </button>

          <button
            onClick={handleLoadSales}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-[#faf7f2] text-[#2c1a0e] border border-[#e6dcce] font-medium shadow-2xs transition-all active:translate-y-px text-[11px]"
            title="Cargar dataset de ventas de hardware y tecnología por trimestre"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Ventas de Tecnología</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[#8c7664] text-[11px]">
        <div className="hidden lg:flex items-center gap-2">
          <span className="font-mono text-[10.5px]">Arrastra cualquier punto en el lienzo para retocarlo artísticamente</span>
        </div>

        {onOpenDocs && (
          <button
            onClick={onOpenDocs}
            className="text-[#e11d48] hover:text-[#be123c] underline font-medium text-[11px] cursor-pointer"
          >
            Ver guía paso a paso
          </button>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded hover:bg-[#ede5db] text-[#8c7664] hover:text-[#2c1a0e] transition-colors"
          title="Ocultar barra de muestras"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};