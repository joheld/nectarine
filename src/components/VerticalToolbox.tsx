import React from 'react';
import {
  Pointer,
  Move,
  Spline,
  MessageSquarePlus,
  Hand,
  RotateCcw,
} from 'lucide-react';
import { useMutationStore } from '../store/mutationStore';

export const VerticalToolbox: React.FC = () => {
  const { activeTool, setActiveTool, mutations, resetAllMutations } = useMutationStore();
  const hasMutations = Object.keys(mutations).length > 0;

  const tools = [
    {
      id: 'select' as const,
      label: 'Seleccionar',
      shortcut: 'V',
      description: 'Seleccionar elemento o arrastrar en fondo para caja elástica (Marquee)',
      icon: <Pointer className="w-4 h-4" />,
    },
    {
      id: 'move' as const,
      label: 'Mover y Arrastrar',
      shortcut: 'M',
      description: 'Desplazar elementos por el lienzo con cálculo de escala 1:1',
      icon: <Move className="w-4 h-4" />,
    },
    {
      id: 'bezier' as const,
      label: 'Curvar Bézier',
      shortcut: 'B',
      description: 'Deformar vectores con manetas orgánicas de curvatura',
      icon: <Spline className="w-4 h-4" />,
    },
    {
      id: 'annotate' as const,
      label: 'Anotación Conectada',
      shortcut: 'A',
      description: 'Crear notas explicativas dinámicas atadas al dato',
      icon: <MessageSquarePlus className="w-4 h-4" />,
    },
    {
      id: 'pan' as const,
      label: 'Mano / Encuadre',
      shortcut: 'H',
      description: 'Mover el lienzo sin tocar los datos (o mantener Espacio)',
      icon: <Hand className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className="w-12 bg-[#f8f5ee] border-r border-[#e6dcce] flex flex-col items-center py-3 select-none z-30 shrink-0 gap-2 shadow-[1px_0_3px_rgba(44,26,14,0.02)]"
      aria-label="Paleta de Herramientas de Edición"
    >
      {/* Primary Interaction Tools (Classic Studio Strip) */}
      <div className="flex flex-col items-center gap-1.5">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#e11d48] text-white shadow-[0_1px_3px_rgba(225,29,72,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]'
                  : 'text-[#6b5340] hover:text-[#2c1a0e] hover:bg-[#ede5db] active:bg-[#dfd2c4]'
              }`}
              title={`${t.label} [Tecla ${t.shortcut}]\n${t.description}`}
            >
              {t.icon}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="h-px w-6 bg-[#e6dcce] my-1" />

      {/* Reset Artistic Modifications Button */}
      {hasMutations && (
        <button
          onClick={resetAllMutations}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8c7664] hover:text-[#e11d48] hover:bg-white border border-transparent hover:border-[#e6dcce] transition-all cursor-pointer shadow-2xs"
          title="Restablecer todas las mutaciones manuales a sus coordenadas matemáticas originales"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="sr-only">Resetear</span>
        </button>
      )}
    </aside>
  );
};
