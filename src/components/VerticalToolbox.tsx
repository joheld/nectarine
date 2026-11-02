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
      description: 'Seleccionar nodo o arrastrar en fondo para caja elástica',
      icon: <Pointer className="w-4 h-4" />,
    },
    {
      id: 'move' as const,
      label: 'Mover y Arrastrar',
      shortcut: 'M',
      description: 'Mover nodos o grupos con cálculo de escala 1:1',
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
      description: 'Crear notas explicativas atadas al punto de datos',
      icon: <MessageSquarePlus className="w-4 h-4" />,
    },
    {
      id: 'pan' as const,
      label: 'Mano / Encuadre',
      shortcut: 'H',
      description: 'Mover y encuadrar el lienzo sin tocar los datos',
      icon: <Hand className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className="w-12 bg-[#f8f5ee] border-r border-[#e6dcce] flex flex-col items-center py-3 select-none z-30 shrink-0 gap-1.5 shadow-[1px_0_3px_rgba(44,26,14,0.03)]"
      aria-label="Paleta de Herramientas de Edición"
    >
      {/* Primary Interaction Tools (Illustrator / Photoshop Classic Strip) */}
      <div className="flex flex-col items-center gap-1.5">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-[#e11d48] text-white shadow-xs font-semibold scale-105'
                  : 'text-[#5e4634] hover:text-[#2c1a0e] hover:bg-[#ede5db]'
              }`}
              title={`${t.label} [Tecla ${t.shortcut}]\n${t.description}`}
            >
              {t.icon}

              {/* Small discrete shortcut indicator */}
              <span
                className={`absolute bottom-0.5 right-1 text-[8px] font-mono leading-none ${
                  isActive ? 'text-white/80' : 'text-[#8c7664] opacity-60 group-hover:opacity-100'
                }`}
              >
                {t.shortcut}
              </span>
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
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8c7664] hover:text-[#e11d48] hover:bg-white border border-transparent hover:border-[#e6dcce] transition-all cursor-pointer shadow-2xs group relative"
          title="Restablecer todas las mutaciones manuales a sus coordenadas matemáticas originales"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="sr-only">Resetear</span>
        </button>
      )}
    </aside>
  );
};
