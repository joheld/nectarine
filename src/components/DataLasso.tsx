import React from 'react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { useLayerStore } from '../store/layerStore';
import { CheckSquare, Pin, MessageSquarePlus, RotateCcw, Palette } from 'lucide-react';

interface DataLassoContextMenuProps {
  x: number;
  y: number;
  targetNodeId: string | null;
  onClose: () => void;
}

export const DataLassoContextMenu: React.FC<DataLassoContextMenuProps> = ({
  x,
  y,
  targetNodeId,
  onClose,
}) => {
  const { baseNodes } = useDataStore();
  const { selectAll, togglePin, selectedNodeIds, resetMutation } = useMutationStore();
  const { addAnnotation } = useLayerStore();

  const targetNode = baseNodes.find((n) => n.id === targetNodeId);

  const handleSelectCategory = () => {
    if (!targetNode) return;
    const matchingIds = baseNodes
      .filter((n) => n.category === targetNode.category)
      .map((n) => n.id);
    selectAll(matchingIds);
    onClose();
  };

  const handleSelectValueRange = () => {
    if (!targetNode || targetNode.valueY === undefined) return;
    const targetVal = targetNode.valueY;
    const margin = Math.abs(targetVal * 0.25);
    const matchingIds = baseNodes
      .filter(
        (n) =>
          n.valueY !== undefined &&
          n.valueY >= targetVal - margin &&
          n.valueY <= targetVal + margin
      )
      .map((n) => n.id);
    selectAll(matchingIds);
    onClose();
  };

  const handleTogglePinSelection = () => {
    const idsToPin = selectedNodeIds.length > 0 ? selectedNodeIds : targetNodeId ? [targetNodeId] : [];
    idsToPin.forEach((id) => togglePin(id));
    onClose();
  };

  const handleAddAnnotation = () => {
    if (!targetNodeId) return;
    const text = prompt('Escribe una nota para este punto:', 'Observación destacada');
    if (text) {
      addAnnotation(targetNodeId, text, 40, -45, 'bezier');
    }
    onClose();
  };

  const handleResetSelected = () => {
    const ids = selectedNodeIds.length > 0 ? selectedNodeIds : targetNodeId ? [targetNodeId] : [];
    ids.forEach((id) => resetMutation(id));
    onClose();
  };

  return (
    <div
      className="fixed z-50 w-64 bg-white border border-[#e6dcce] rounded-xl shadow-xl text-xs p-1 select-none animate-in fade-in zoom-in-95 duration-100 text-[#2c1a0e]"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {targetNode && (
        <div className="px-2.5 py-1.5 border-b border-[#ebd9c8] text-[#8c7664] font-mono text-[10px] flex items-center justify-between bg-[#faf7f2] rounded-t-lg">
          <span className="truncate max-w-[150px] font-medium text-[#2c1a0e]">{targetNode.label}</span>
          <span className="text-[#e11d48] font-semibold">{targetNode.category}</span>
        </div>
      )}

      <div className="py-1 flex flex-col gap-0.5">
        {targetNode && (
          <>
            <button
              onClick={handleSelectCategory}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#fff5f5] text-[#5e4634] hover:text-[#e11d48] transition-colors text-left cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Seleccionar grupo: <strong className="font-semibold">{targetNode.category}</strong></span>
            </button>

            <button
              onClick={handleSelectValueRange}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#fff5f5] text-[#5e4634] hover:text-[#e11d48] transition-colors text-left cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Seleccionar puntos con valores similares (±25%)</span>
            </button>

            <button
              onClick={handleAddAnnotation}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#fff5f5] text-[#5e4634] hover:text-[#e11d48] transition-colors text-left cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Añadir nota explicativa con flecha</span>
            </button>
          </>
        )}

        <button
          onClick={handleTogglePinSelection}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#fff5f5] text-[#5e4634] hover:text-[#b44b10] transition-colors text-left cursor-pointer"
        >
          <Pin className="w-3.5 h-3.5 text-[#b44b10]" />
          <span>Fijar / Desanclar posición</span>
        </button>

        <button
          onClick={handleResetSelected}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#fff1f2] text-[#be123c] transition-colors text-left cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Regresar a su posición matemática</span>
        </button>
      </div>
    </div>
  );
};
