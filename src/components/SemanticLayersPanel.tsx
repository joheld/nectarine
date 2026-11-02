import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Filter,
} from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { useLayerStore } from '../store/layerStore';
import { colorService } from '../services/colorService';

export const SemanticLayersPanel: React.FC = () => {
  const { baseNodes, profiledColumns, mappings, setMappings } = useDataStore();
  const { selectedNodeIds, selectAll, clearSelection } = useMutationStore();
  const { layerOverrides, toggleLayerVisibility, toggleLayerLock, setLayerColor } = useLayerStore();
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [subGroupCol, setSubGroupCol] = useState<string>('');

  const activeCategoryCol = mappings.category || (profiledColumns.find((c) => c.type === 'string')?.name ?? profiledColumns[0]?.name ?? '');

  // Hierarchical Groups computation (Primary category + optional Secondary sub-category)
  const groups = React.useMemo(() => {
    if (baseNodes.length === 0) return [];

    const map = new Map<
      string,
      {
        nodes: typeof baseNodes;
        subGroups: Map<string, typeof baseNodes>;
      }
    >();

    baseNodes.forEach((node) => {
      const cat = node.category || 'General';
      if (!map.has(cat)) {
        map.set(cat, { nodes: [], subGroups: new Map() });
      }
      const entry = map.get(cat)!;
      entry.nodes.push(node);

      if (subGroupCol && node.metadata && node.metadata[subGroupCol] !== undefined) {
        const subCat = String(node.metadata[subGroupCol] ?? 'Otros');
        if (!entry.subGroups.has(subCat)) {
          entry.subGroups.set(subCat, []);
        }
        entry.subGroups.get(subCat)!.push(node);
      }
    });

    return Array.from(map.entries()).map(([category, { nodes, subGroups }]) => ({
      category,
      nodes,
      count: nodes.length,
      defaultColor: colorService.getColorForCategory(category),
      subGroups: Array.from(subGroups.entries()).map(([subCat, subNodes]) => ({
        subCategory: subCat,
        nodes: subNodes,
        count: subNodes.length,
      })),
    }));
  }, [baseNodes, subGroupCol]);

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

  const handlePrimaryColumnChange = (newCol: string) => {
    setMappings({ category: newCol });
  };

  return (
    <aside className="w-64 bg-[#f8f5ee] border-r border-[#e6dcce] flex flex-col h-full select-none text-xs shrink-0">
      {/* 1. Header */}
      <div className="h-11 px-4 border-b border-[#e6dcce] flex items-center justify-between bg-[#f3ece0]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#e11d48]" />
          <span className="font-semibold text-[#2c1a0e] text-[11px] uppercase tracking-wider">
            Capas & Grupos
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#8c7664] bg-[#ebd9c8] px-2 py-0.5 rounded-md">
          {groups.length} grupos
        </span>
      </div>

      {/* 2. Column Selection Selector (Explains and allows picking ANY column for grouping) */}
      {profiledColumns.length > 0 && (
        <div className="p-3 border-b border-[#e6dcce] bg-[#faf7f2] space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="font-semibold text-[#2c1a0e] flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#e11d48]" />
                <span>Agrupar por columna:</span>
              </span>
              <span className="font-mono text-[9.5px] text-[#8c7664] bg-[#ede5db] px-1.5 py-0.2 rounded">
                {profiledColumns.length} cols
              </span>
            </div>
            <select
              value={activeCategoryCol}
              onChange={(e) => handlePrimaryColumnChange(e.target.value)}
              className="w-full bg-white border border-[#dfd2c4] rounded-lg px-2.5 py-1.5 text-xs text-[#2c1a0e] font-medium shadow-2xs focus:outline-none focus:border-[#e11d48] cursor-pointer"
              title="Selecciona qué columna de tu dataset agrupa y tiñe los vectores"
            >
              {profiledColumns.map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name} ({col.type === 'string' ? 'texto' : col.type === 'number' ? 'métrica' : col.type}) — {col.distinctCount} valores
                </option>
              ))}
            </select>
          </div>

          {/* Optional Sub-grouping */}
          {profiledColumns.length > 1 && (
            <div className="space-y-1 pt-1.5 border-t border-[#ede5db]">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="text-[#5e4634] flex items-center gap-1">
                  <FolderTree className="w-3 h-3 text-[#f97316]" />
                  <span>Sub-agrupar por:</span>
                </span>
                {subGroupCol && (
                  <button
                    onClick={() => setSubGroupCol('')}
                    className="text-[9.5px] text-[#e11d48] hover:underline cursor-pointer"
                  >
                    Quitar
                  </button>
                )}
              </div>
              <select
                value={subGroupCol}
                onChange={(e) => setSubGroupCol(e.target.value)}
                className="w-full bg-white border border-[#dfd2c4] rounded-lg px-2 py-1 text-[11px] text-[#5e4634] shadow-2xs focus:outline-none focus:border-[#e11d48] cursor-pointer"
                title="Crea una jerarquía secundaria dentro de cada grupo"
              >
                <option value="">(Ninguno — Grupo único)</option>
                {profiledColumns
                  .filter((c) => c.name !== activeCategoryCol)
                  .map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name} ({col.distinctCount} valores)
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* 3. Categories Tree or Empty State */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {groups.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#8c7664] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#f0e7dc] flex items-center justify-center text-[#8c7664]">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-[#2c1a0e]">Sin datos cargados</div>
            <p className="text-[11px] leading-relaxed text-[#8c7664]">
              Al subir un archivo podrás elegir libremente qué columna clasifica y tiñe tus vectores en carpetas semánticas.
            </p>
          </div>
        ) : (
          groups.map(({ category, nodes, count, defaultColor, subGroups }) => {
            const override = layerOverrides[category] || {};
            const isVisible = override.isVisible !== false;
            const isLocked = override.isLocked || false;
            const currentColor = override.color || defaultColor;
            const isCollapsed = collapsedFolders[category] ?? true;
            const isGroupSelected = nodes.some((n) => selectedNodeIds.includes(n.id));

            return (
              <div
                key={category}
                className={`rounded-lg border transition-all ${
                  isGroupSelected
                    ? 'bg-[#fff5f5] border-[#f43f5e] shadow-xs'
                    : 'bg-white border-[#ebd9c8] hover:border-[#f43f5e]/50'
                }`}
              >
                {/* Primary Category Row */}
                <div className="flex items-center justify-between px-3 py-2">
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

                {/* Subgroups or Nodes if expanded */}
                {!isCollapsed && (
                  <div className="px-3 pb-2 pt-1 border-t border-[#f0e7dc] bg-[#fcfbf9] max-h-48 overflow-y-auto space-y-1 text-[11px] text-[#5e4634]">
                    {subGroups.length > 0 ? (
                      subGroups.map((sub) => {
                        const isSubSelected = sub.nodes.every((n) => selectedNodeIds.includes(n.id));
                        return (
                          <div
                            key={sub.subCategory}
                            onClick={() => handleSelectGroup(sub.nodes)}
                            className={`py-1 px-2 rounded-md flex items-center justify-between cursor-pointer border transition-colors ${
                              isSubSelected
                                ? 'bg-[#e11d48] text-white border-[#be123c] font-medium'
                                : 'bg-white hover:bg-[#f5ede3] border-[#e6dcce]'
                            }`}
                            title={`Seleccionar ${sub.count} nodos en ${sub.subCategory}`}
                          >
                            <span className="truncate">{sub.subCategory}</span>
                            <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded ${
                              isSubSelected ? 'bg-white/20 text-white' : 'bg-[#f0e7dc] text-[#8c7664]'
                            }`}>
                              {sub.count}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      nodes.map((n) => {
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
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {groups.length > 0 && (
        <div className="p-2 border-t border-[#e6dcce] bg-[#f3ece0] text-[10px] text-[#8c7664] text-center">
          Toca cualquier grupo para seleccionarlo en el lienzo
        </div>
      )}
    </aside>
  );
};
