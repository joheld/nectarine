import React, { useState } from 'react';
import {
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
    <aside className="w-64 bg-[#f8f5ee] border-r border-[#e6dcce] flex flex-col h-full select-none text-xs">
      {/* Header */}
      <div className="h-10 px-3 border-b border-[#e6dcce] flex items-center justify-between bg-[#f3ece0]">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#b44b10]" />
          <span className="font-semibold text-[#2c1a0e] text-[11px] uppercase tracking-wider">
            Grupos
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#8c7664] bg-[#ebd9c8] px-1.5 py-0.5 rounded">
          {groups.length} categorías
        </span>
      </div>

      {/* Categories Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {groups.map(({ category, nodes, count, defaultColor }) => {
          const override = layerOverrides[category] || {};
          const isVisible = override.isVisible !== false;
          const isLocked = override.isLocked || false;
          const currentColor = override.color || defaultColor;
          const isCollapsed = collapsedFolders[category] ?? true; // Collapsed by default for clean look!
          const isGroupSelected = nodes.some((n) => selectedNodeIds.includes(n.id));

          return (
            <div
              key={category}
              className={`rounded-md border transition-all ${
                isGroupSelected
                  ? 'bg-[#fffae8] border-[#b44b10] shadow-sm'
                  : 'bg-white border-[#ebd9c8] hover:border-[#b44b10]/40'
              }`}
            >
              {/* Row */}
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <div
                  className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleSelectGroup(nodes)}
                  title="Clic para seleccionar todos los puntos del grupo"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(category);
                    }}
                    className="text-[#8c7664] hover:text-[#2c1a0e] p-0.5"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>

                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: currentColor }}
                  />

                  <span className="font-medium text-[#2c1a0e] truncate text-xs">
                    {category}
                  </span>
                  <span className="text-[10px] text-[#8c7664] bg-[#f5ede3] px-1.5 py-0.2 rounded font-mono">
                    {count}
                  </span>
                </div>

                {/* Quick controls */}
                <div className="flex items-center gap-0.5 pl-1">
                  <label className="cursor-pointer relative flex items-center justify-center p-0.5" title="Cambiar color del grupo">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => setLayerColor(category, e.target.value)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <div
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: currentColor }}
                    />
                  </label>

                  <button
                    onClick={() => toggleLayerVisibility(category)}
                    className={`p-1 rounded hover:bg-[#f5ede3] ${
                      isVisible ? 'text-[#5e4634]' : 'text-[#8c7664] opacity-30'
                    }`}
                    title={isVisible ? 'Ocultar grupo' : 'Mostrar grupo'}
                  >
                    {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={() => toggleLayerLock(category)}
                    className={`p-1 rounded hover:bg-[#f5ede3] ${
                      isLocked ? 'text-[#b44b10]' : 'text-[#8c7664] opacity-40 hover:opacity-100'
                    }`}
                    title={isLocked ? 'Bloqueado' : 'Bloquear'}
                  >
                    {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Subitems if expanded */}
              {!isCollapsed && (
                <div className="px-3 pb-2 pt-1 border-t border-[#f0e7dc] bg-[#fcfbf9] max-h-36 overflow-y-auto space-y-0.5 text-[11px] text-[#5e4634]">
                  {nodes.map((n) => {
                    const isSelected = selectedNodeIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`py-0.5 px-2 rounded flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-[#b44b10] text-white font-medium' : 'hover:bg-[#f3ede4]'
                        }`}
                        onClick={() => selectAll([n.id])}
                      >
                        <span className="truncate">{n.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2 border-t border-[#e6dcce] bg-[#f3ece0] text-[10px] text-[#8c7664] text-center">
        Toca un grupo para seleccionarlo en el lienzo
      </div>
    </aside>
  );
};
