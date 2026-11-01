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

  // Batch Select by Category
  const handleSelectCategory = () => {
    if (!targetNode) return;
    const matchingIds = baseNodes
      .filter((n) => n.category === targetNode.category)
      .map((n) => n.id);
    selectAll(matchingIds);
    onClose();
  };

  // Batch Select by Value Range (within ±25% of target value)
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

  // Batch Pin/Unpin
  const handleTogglePinSelection = () => {
    const idsToPin = selectedNodeIds.length > 0 ? selectedNodeIds : targetNodeId ? [targetNodeId] : [];
    idsToPin.forEach((id) => togglePin(id));
    onClose();
  };

  // Add Tethered Annotation
  const handleAddAnnotation = () => {
    if (!targetNodeId) return;
    const text = prompt('Texto de la anotación vinculada:', 'Observación analítica clave');
    if (text) {
      addAnnotation(targetNodeId, text, 40, -45, 'bezier');
    }
    onClose();
  };

  // Reset selected mutations
  const handleResetSelected = () => {
    const ids = selectedNodeIds.length > 0 ? selectedNodeIds : targetNodeId ? [targetNodeId] : [];
    ids.forEach((id) => resetMutation(id));
    onClose();
  };

  return (
    <div
      className="fixed z-50 w-64 bg-mac-panel border border-mac-border rounded-lg shadow-macos text-xs p-1 select-none backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {targetNode && (
        <div className="px-2.5 py-1.5 border-b border-mac-border/50 text-gray-400 font-mono text-[10px] flex items-center justify-between">
          <span className="truncate max-w-[150px]">{targetNode.label}</span>
          <span className="text-mac-accent">{targetNode.category}</span>
        </div>
      )}

      <div className="py-1 flex flex-col gap-0.5">
        {targetNode && (
          <>
            <button
              onClick={handleSelectCategory}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-mac-accent hover:text-white text-gray-200 transition-colors text-left"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Seleccionar categoría: <strong className="font-semibold">{targetNode.category}</strong></span>
            </button>

            <button
              onClick={handleSelectValueRange}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-mac-accent hover:text-white text-gray-200 transition-colors text-left"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Seleccionar rango métrico similar (±25%)</span>
            </button>

            <button
              onClick={handleAddAnnotation}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-mac-accent hover:text-white text-gray-200 transition-colors text-left"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Añadir Anotación Atada</span>
            </button>
          </>
        )}

        <button
          onClick={handleTogglePinSelection}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-mac-accent hover:text-white text-gray-200 transition-colors text-left"
        >
          <Pin className="w-3.5 h-3.5" />
          <span>Fijar / Liberar anclaje de nodos</span>
        </button>

        <button
          onClick={handleResetSelected}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-mac-danger hover:text-white text-gray-200 transition-colors text-left"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer a matemática original</span>
        </button>
      </div>
    </div>
  );
};
