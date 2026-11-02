import React, { useRef, useState } from 'react';
import { BaseNode } from '../engine/types';
import { useMutationStore } from '../store/mutationStore';
import { colorService } from '../services/colorService';
import { useLayerStore } from '../store/layerStore';
import { useDataStore } from '../store/dataStore';
import { buildClosedOrganicBezierPath, generateOrganicBezierHandles } from '../engine/bezierMath';
import { generateGlyphPath } from '../engine/glyphMath';

interface CanvasNodeProps {
  node: BaseNode;
  blendMode: string;
  zoom?: number;
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({ node, blendMode, zoom = 1 }) => {
  const {
    mutations,
    selectedNodeIds,
    selectNode,
    updatePosition,
    updateBezierHandles,
    resetBezierHandles,
    setHoveredNode,
    activeTool,
    calculateDistortion,
    togglePin,
    isGlowEnabled,
  } = useMutationStore();

  const { baseNodes } = useDataStore();
  const { layerOverrides, addAnnotation } = useLayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCp1, setIsDraggingCp1] = useState(false);
  const [isDraggingCp2, setIsDraggingCp2] = useState(false);

  const nodeDragStartRef = useRef<{
    clientX: number;
    clientY: number;
    initialPositions: Record<string, { x: number; y: number }>;
  }>({
    clientX: 0,
    clientY: 0,
    initialPositions: {},
  });

  const cp1DragStartRef = useRef<{ clientX: number; clientY: number; initialCp1x: number; initialCp1y: number }>({
    clientX: 0,
    clientY: 0,
    initialCp1x: 0,
    initialCp1y: 0,
  });

  const cp2DragStartRef = useRef<{ clientX: number; clientY: number; initialCp2x: number; initialCp2y: number }>({
    clientX: 0,
    clientY: 0,
    initialCp2x: 0,
    initialCp2y: 0,
  });

  const mut = mutations[node.id];
  const isSelected = selectedNodeIds.includes(node.id);
  const layerOverride = layerOverrides[node.category];

  if (layerOverride?.isVisible === false) {
    return null;
  }

  const isLocked = layerOverride?.isLocked || false;

  const currentX = mut?.customX ?? node.mathX;
  const currentY = mut?.customY ?? node.mathY;
  const scale = mut?.manualScale ?? 1.0;
  const radius = (mut?.customR ?? node.mathR) * scale;
  const baseFill = layerOverride?.color || colorService.getColorForCategory(node.category);
  const fill = mut?.customFill || baseFill;
  const isPinned = mut?.isPinned || false;

  const distortion = calculateDistortion(node);
  const showGhost = isPinned && (Math.abs(currentX - node.mathX) > 2 || Math.abs(currentY - node.mathY) > 2);

  const effectiveGlyphShape = mut?.glyphShape || node.glyphShape || 'circle';

  // Default organic Bézier handles relative to center
  const defaultHandles = generateOrganicBezierHandles(radius);
  const cp1x = mut?.cp1x ?? defaultHandles.cp1x;
  const cp1y = mut?.cp1y ?? defaultHandles.cp1y;
  const cp2x = mut?.cp2x ?? defaultHandles.cp2x;
  const cp2y = mut?.cp2y ?? defaultHandles.cp2y;
  const hasCustomBezier = mut?.cp1x !== undefined || mut?.cp2x !== undefined;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;

    // Si la herramienta es Mano (pan), burbujea al lienzo
    if (activeTool === 'pan') {
      return;
    }

    e.stopPropagation();

    // 1. Herramienta Anotar: solicitar texto al hacer clic
    if (activeTool === 'annotate') {
      selectNode(node.id, false);
      const label = node.label || `Dato #${node.rawIndex + 1}`;
      const text = prompt(`Añadir anotación atada a "${label}":`, `Nota: ${label}`);
      if (text && text.trim() !== '') {
        addAnnotation(node.id, text.trim(), 40, -45, 'bezier');
      }
      return;
    }

    // 2. Herramienta Selección: SOLO SELECCIONA (No arrastra el nodo por accidente)
    if (activeTool === 'select') {
      selectNode(node.id, e.shiftKey || e.metaKey);
      return;
    }

    // 3. Herramienta Curvar Bézier: selecciona e inicializa manetas de curvatura si no existen
    if (activeTool === 'bezier') {
      selectNode(node.id, false);
      if (!hasCustomBezier) {
        updateBezierHandles(node.id, defaultHandles.cp1x, defaultHandles.cp1y, defaultHandles.cp2x, defaultHandles.cp2y);
      }
      return;
    }

    // 4. Herramienta Mover / Arrastre: inicia arrastre del nodo o grupo
    if (activeTool === 'move') {
      const isAlreadySelected = selectedNodeIds.includes(node.id);
      if (!isAlreadySelected) {
        selectNode(node.id, false);
      }

      const targetsToMove = isAlreadySelected ? selectedNodeIds : [node.id];
      const initialPositions: Record<string, { x: number; y: number }> = {};

      targetsToMove.forEach((id) => {
        const targetNode = baseNodes.find((n) => n.id === id);
        if (targetNode) {
          const targetMut = mutations[id];
          initialPositions[id] = {
            x: targetMut?.customX ?? targetNode.mathX,
            y: targetMut?.customY ?? targetNode.mathY,
          };
        }
      });

      setIsDragging(true);
      nodeDragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        initialPositions,
      };
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && activeTool === 'move') {
      e.stopPropagation();
      const dx = (e.clientX - nodeDragStartRef.current.clientX) / zoom;
      const dy = (e.clientY - nodeDragStartRef.current.clientY) / zoom;

      Object.entries(nodeDragStartRef.current.initialPositions).forEach(([id, initPos]) => {
        updatePosition(id, initPos.x + dx, initPos.y + dy, true);
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleCp1PointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingCp1(true);
    cp1DragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialCp1x: cp1x,
      initialCp1y: cp1y,
    };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handleCp1PointerMove = (e: React.PointerEvent) => {
    if (isDraggingCp1) {
      e.stopPropagation();
      const deltaX = (e.clientX - cp1DragStartRef.current.clientX) / zoom;
      const deltaY = (e.clientY - cp1DragStartRef.current.clientY) / zoom;
      updateBezierHandles(
        node.id,
        cp1DragStartRef.current.initialCp1x + deltaX,
        cp1DragStartRef.current.initialCp1y + deltaY,
        cp2x,
        cp2y
      );
    }
  };

  const handleCp1PointerUp = (e: React.PointerEvent) => {
    if (isDraggingCp1) {
      setIsDraggingCp1(false);
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleCp2PointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingCp2(true);
    cp2DragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialCp2x: cp2x,
      initialCp2y: cp2y,
    };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handleCp2PointerMove = (e: React.PointerEvent) => {
    if (isDraggingCp2) {
      e.stopPropagation();
      const deltaX = (e.clientX - cp2DragStartRef.current.clientX) / zoom;
      const deltaY = (e.clientY - cp2DragStartRef.current.clientY) / zoom;
      updateBezierHandles(
        node.id,
        cp1x,
        cp1y,
        cp2DragStartRef.current.initialCp2x + deltaX,
        cp2DragStartRef.current.initialCp2y + deltaY
      );
    }
  };

  const handleCp2PointerUp = (e: React.PointerEvent) => {
    if (isDraggingCp2) {
      setIsDraggingCp2(false);
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleResetBezier = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetBezierHandles(node.id);
  };

  const nodeCursor = isLocked
    ? 'cursor-not-allowed'
    : activeTool === 'pan'
    ? 'cursor-grab'
    : activeTool === 'select'
    ? 'cursor-pointer'
    : activeTool === 'annotate'
    ? 'cursor-crosshair'
    : activeTool === 'bezier'
    ? 'cursor-crosshair'
    : activeTool === 'move'
    ? isDragging
      ? 'cursor-grabbing'
      : 'cursor-grab'
    : 'cursor-pointer';

  return (
    <g
      id={node.id}
      className={`${nodeCursor} transition-opacity group`}
      onPointerEnter={() => setHoveredNode(node.id)}
      onPointerLeave={() => setHoveredNode(null)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        togglePin(node.id);
      }}
    >
      {/* 1. Ghost Trace & Mathematical Anchor Phantom (Purged on export) */}
      {showGhost && (
        <g className="ghost-trace pointer-events-none" data-editor-ui="true">
          <line
            x1={currentX}
            y1={currentY}
            x2={node.mathX}
            y2={node.mathY}
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            strokeOpacity="0.75"
          />
          <circle
            cx={node.mathX}
            cy={node.mathY}
            r={node.mathR}
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            strokeOpacity="0.6"
            className="ghost-node"
          />
        </g>
      )}

      {/* 2. Main Vector Node Shape (Closed Organic Bézier or Exact Circle) */}
      <g
        transform={`translate(${currentX}, ${currentY})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {hasCustomBezier ? (
          <path
            d={buildClosedOrganicBezierPath(radius, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y })}
            fill={fill}
            fillOpacity="0.88"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth={isSelected ? 2 : 1}
            filter={isGlowEnabled ? 'url(#celestial-glow)' : undefined}
            style={{ mixBlendMode: blendMode as any }}
          />
        ) : effectiveGlyphShape === 'circle' ? (
          <circle
            r={radius}
            fill={fill}
            fillOpacity="0.9"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={isSelected ? 2 : 1}
            filter={isGlowEnabled ? 'url(#celestial-glow)' : undefined}
            style={{ mixBlendMode: blendMode as any }}
          />
        ) : (
          <path
            d={generateGlyphPath(effectiveGlyphShape, radius)}
            fill={fill}
            fillOpacity="0.9"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={isSelected ? 2 : 1}
            filter={isGlowEnabled ? 'url(#celestial-glow)' : undefined}
            style={{ mixBlendMode: blendMode as any }}
          />
        )}

        {/* Halo outline hint when Bézier tool is active */}
        {activeTool === 'bezier' && !isSelected && (
          <circle
            r={radius + 4}
            fill="none"
            stroke="#e11d48"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.65"
            className="animate-pulse"
          />
        )}

        {/* Pin indicator badge */}
        {isPinned && (
          <circle
            cx={radius * 0.7}
            cy={-radius * 0.7}
            r={3.5}
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="1"
            className="anchor-pin"
            data-editor-ui="true"
          />
        )}

        {/* Selection Ring (Purged on export) */}
        {isSelected && (
          <circle
            r={radius + 5}
            fill="none"
            stroke="#0066cc"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="selection-ring"
            data-editor-ui="true"
          />
        )}
      </g>

      {/* 3. Distortion Warning Badge (Purged on export) */}
      {distortion.isDistorted && (
        <g
          transform={`translate(${currentX + radius + 4}, ${currentY - radius - 2})`}
          className="distortion-badge pointer-events-none"
          data-editor-ui="true"
        >
          <rect
            x={0}
            y={-11}
            width={58}
            height={15}
            rx={3}
            fill="rgba(239, 68, 68, 0.95)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="0.8"
          />
          <text
            x={4}
            y={0}
            fill="#ffffff"
            fontSize="8.5"
            fontFamily="SF Mono, monospace"
            fontWeight="bold"
          >
            Δ {distortion.distortionPct > 0 ? `+${distortion.distortionPct}%` : `${distortion.distortionPct}%`}
          </text>
        </g>
      )}

      {/* 4. Bézier Interactive Handles & Reset (Purged on export) */}
      {isSelected && activeTool === 'bezier' && (
        <g className="bezier-handles" data-editor-ui="true">
          {/* Line to cp1 (Upper tangent) */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX + cp1x}
            y2={currentY + cp1y}
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            className="bezier-line"
          />
          {/* Handle 1: Upper control (Cyan/Blue) */}
          <g
            transform={`translate(${currentX + cp1x}, ${currentY + cp1y})`}
            onPointerDown={handleCp1PointerDown}
            onPointerMove={handleCp1PointerMove}
            onPointerUp={handleCp1PointerUp}
            className="cursor-grab active:cursor-grabbing group/h1"
          >
            <title>Maneta Superior: Arrastra para deformar el lóbulo superior</title>
            {/* Expanded Hit area */}
            <circle r={15} fill="transparent" />
            <circle
              r={6.5}
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="2"
              className="drop-shadow-sm group-hover/h1:scale-125 transition-transform"
            />
            {/* Tag badge */}
            <rect x={10} y={-8} width={48} height={15} rx={4} fill="#0284c7" opacity={0.9} />
            <text x={14} y={3} fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              Curva 1
            </text>
          </g>

          {/* Line to cp2 (Lower tangent) */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX + cp2x}
            y2={currentY + cp2y}
            stroke="#e11d48"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            className="bezier-line"
          />
          {/* Handle 2: Lower control (Rose/Red) */}
          <g
            transform={`translate(${currentX + cp2x}, ${currentY + cp2y})`}
            onPointerDown={handleCp2PointerDown}
            onPointerMove={handleCp2PointerMove}
            onPointerUp={handleCp2PointerUp}
            className="cursor-grab active:cursor-grabbing group/h2"
          >
            <title>Maneta Inferior: Arrastra para deformar el lóbulo inferior</title>
            {/* Expanded Hit area */}
            <circle r={15} fill="transparent" />
            <circle
              r={6.5}
              fill="#e11d48"
              stroke="#ffffff"
              strokeWidth="2"
              className="drop-shadow-sm group-hover/h2:scale-125 transition-transform"
            />
            {/* Tag badge */}
            <rect x={10} y={-8} width={48} height={15} rx={4} fill="#e11d48" opacity={0.9} />
            <text x={14} y={3} fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              Curva 2
            </text>
          </g>

          {/* Reset curve button */}
          {hasCustomBezier && (
            <g
              transform={`translate(${currentX + radius + 14}, ${currentY})`}
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={handleResetBezier}
            >
              <title>Restablecer forma circular perfecta</title>
              <rect x={-9} y={-9} width={18} height={18} rx={5} fill="#ffffff" stroke="#dfd2c4" strokeWidth="1" className="shadow-xs" />
              <text x={0} y={3.5} textAnchor="middle" fill="#8c7664" fontSize="11" fontWeight="bold">↺</text>
            </g>
          )}
        </g>
      )}
    </g>
  );
};
