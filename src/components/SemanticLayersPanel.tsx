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

  // Group nodes by category
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
    <aside className="w-64 bg-mac-surface border-r border-mac-border flex flex-col h-full select-none text-xs transition-colors">
      {/* Panel Header */}
      <div className="p-3 border-b border-mac-border flex items-center justify-between bg-mac-panel">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-mac-accent" />
          <span className="font-semibold text-mac-text">Grupos por Categoría</span>
        </div>
        <span className="text-[11px] font-mono text-mac-textMuted bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
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
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-mac-accent'
                  : 'bg-mac-card border-mac-border hover:border-mac-borderHover'
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
                    className="text-mac-textMuted hover:text-mac-text p-0.5"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isCollapsed ? (
                    <Folder className="w-4 h-4 text-mac-accent shrink-0" />
                  ) : (
                    <FolderOpen className="w-4 h-4 text-mac-accent shrink-0" />
                  )}

                  <span className="font-medium text-mac-text truncate">{category}</span>
                  <span className="text-[10px] font-mono text-mac-textMuted bg-black/5 dark:bg-black/30 px-1.5 py-0.2 rounded">
                    {count}
                  </span>
                </div>

                {/* Layer Quick Controls */}
                <div className="flex items-center gap-1 pl-1">
                  {/* Color Swatch Picker */}
                  <label className="cursor-pointer relative flex items-center justify-center p-0.5" title="Cambiar color del grupo">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => setLayerColor(category, e.target.value)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/30 shadow-sm"
                      style={{ backgroundColor: currentColor }}
                    />
                  </label>

                  {/* Visibility Eye */}
                  <button
                    onClick={() => toggleLayerVisibility(category)}
                    className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 ${
                      isVisible ? 'text-mac-textSecondary' : 'text-mac-textMuted opacity-40'
                    }`}
                    title={isVisible ? 'Ocultar grupo en el lienzo' : 'Mostrar grupo'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    onClick={() => toggleLayerLock(category)}
                    className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 ${
                      isLocked ? 'text-amber-500' : 'text-mac-textMuted'
                    }`}
                    title={isLocked ? 'Grupo bloqueado contra cambios' : 'Bloquear grupo'}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Subnodes preview if expanded */}
              {!isCollapsed && (
                <div className="px-3 pb-2 pt-0 border-t border-mac-border/50 max-h-36 overflow-y-auto space-y-0.5 text-[11px] text-mac-textSecondary font-mono">
                  {nodes.slice(0, 15).map((n) => {
                    const isSelected = selectedNodeIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`py-0.5 px-1.5 rounded flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-mac-accent text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        onClick={() => selectAll([n.id])}
                      >
                        <span className="truncate">{n.label}</span>
                        {n.valueY !== undefined && (
                          <span className="text-[10px] opacity-75">{n.valueY.toFixed(1)}</span>
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

      {/* Footer Instructions */}
      <div className="p-2.5 border-t border-mac-border bg-mac-card text-[11px] text-mac-textMuted">
        <span>💡 Toca un grupo para seleccionarlo entero.</span>
      </div>
    </aside>
  );
};
