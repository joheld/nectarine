import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { useLayerStore } from '../store/layerStore';
import { colorService } from '../services/colorService';

export const SemanticLayersPanel: React.FC = () => {
  const { baseNodes } = useDataStore();
  const { selectedNodeIds, selectAll, clearSelection } = useMutationStore();
  const { layerOverrides, toggleLayerVisibility, toggleLayerLock, setLayerColor } = useLayerStore();
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof baseNodes>();
    baseNodes.forEach((node) => {
      const cat = node.category || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(node);
    });
    return Array.from(map.entries()).map(([category, nodes]) => ({
      category,
      nodes,
      count: nodes.length,
      defaultColor: colorService.getColorForCategory(category),
    }));
  }, [baseNodes]);

  const toggleFolder = (category: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSelectGroup = (nodes: typeof baseNodes) => {
    const ids = nodes.map((n) => n.id);
    const allSelected = ids.every((id) => selectedNodeIds.includes(id));
    if (allSelected) {
      clearSelection();
    } else {
      selectAll(ids);
    }
  };

  return (
    <aside className="w-64 bg-mac-surface border-r border-mac-border flex flex-col h-full select-none text-xs">
      {/* Panel Header */}
      <div className="p-3 border-b border-mac-border flex items-center justify-between bg-stone-50/60">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cinnamon-700" />
          <span className="font-semibold text-stone-800">Grupos por Categoría</span>
        </div>
        <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
          {groups.length} grupos
        </span>
      </div>

      {/* Categories Folder Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {groups.map(({ category, nodes, count, defaultColor }) => {
          const override = layerOverrides[category] || {};
          const isVisible = override.isVisible !== false;
          const isLocked = override.isLocked || false;
          const currentColor = override.color || defaultColor;
          const isCollapsed = collapsedFolders[category];
          const isGroupSelected = nodes.some((n) => selectedNodeIds.includes(n.id));

          return (
            <div
              key={category}
              className={`rounded-lg border transition-all ${
                isGroupSelected
                  ? 'bg-amber-50 border-cinnamon-600'
                  : 'bg-white border-mac-border hover:border-cinnamon-300'
              }`}
            >
              {/* Folder Header Row */}
              <div className="flex items-center justify-between p-2">
                <div
                  className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleSelectGroup(nodes)}
                  title="Haz clic para seleccionar todos los puntos de este grupo"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(category);
                    }}
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isCollapsed ? (
                    <Folder className="w-4 h-4 text-cinnamon-700 shrink-0" />
                  ) : (
                    <FolderOpen className="w-4 h-4 text-cinnamon-700 shrink-0" />
                  )}

                  <span className="font-medium text-stone-800 truncate">{category}</span>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                    {count}
                  </span>
                </div>

                {/* Layer Quick Controls */}
                <div className="flex items-center gap-1 pl-1">
                  <label className="cursor-pointer relative flex items-center justify-center p-0.5" title="Cambiar color del grupo">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => setLayerColor(category, e.target.value)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-sm"
                      style={{ backgroundColor: currentColor }}
                    />
                  </label>

                  <button
                    onClick={() => toggleLayerVisibility(category)}
                    className={`p-1 rounded hover:bg-stone-100 ${
                      isVisible ? 'text-stone-600' : 'text-stone-300'
                    }`}
                    title={isVisible ? 'Ocultar grupo en el lienzo' : 'Mostrar grupo'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleLayerLock(category)}
                    className={`p-1 rounded hover:bg-stone-100 ${
                      isLocked ? 'text-amber-600' : 'text-stone-400'
                    }`}
                    title={isLocked ? 'Grupo bloqueado contra cambios' : 'Bloquear grupo'}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="px-3 pb-2 pt-0 border-t border-stone-100 max-h-36 overflow-y-auto space-y-0.5 text-[11px] text-stone-600 font-mono">
                  {nodes.slice(0, 15).map((n) => {
                    const isSelected = selectedNodeIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`py-0.5 px-1.5 rounded flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-cinnamon-700 text-white' : 'hover:bg-amber-50'
                        }`}
                        onClick={() => selectAll([n.id])}
                      >
                        <span className="truncate">{n.label}</span>
                        {n.valueY !== undefined && (
                          <span className="text-[10px] opacity-80">{n.valueY.toFixed(1)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-mac-border bg-stone-50/50 text-[11px] text-stone-500">
        <span>💡 Toca un grupo para seleccionarlo entero.</span>
      </div>
    </aside>
  );
};
