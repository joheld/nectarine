import React, { useRef, useState } from 'react';
import { BaseNode } from '../engine/types';
import { useMutationStore } from '../store/mutationStore';
import { colorService } from '../services/colorService';
import { useLayerStore } from '../store/layerStore';
import { buildCubicBezierPath } from '../engine/bezierMath';

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
    setHoveredNode,
    activeTool,
    calculateDistortion,
    togglePin,
    isGlowEnabled,
  } = useMutationStore();

  const { layerOverrides, addAnnotation } = useLayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCp1, setIsDraggingCp1] = useState(false);
  const [isDraggingCp2, setIsDraggingCp2] = useState(false);

  const nodeDragStartRef = useRef<{ clientX: number; clientY: number; initialX: number; initialY: number }>({
    clientX: 0,
    clientY: 0,
    initialX: 0,
    initialY: 0,
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

  // Default Bézier handles relative to center
  const cp1x = mut?.cp1x ?? -radius * 1.5;
  const cp1y = mut?.cp1y ?? -radius * 0.8;
  const cp2x = mut?.cp2x ?? radius * 1.5;
  const cp2y = mut?.cp2y ?? radius * 0.8;
  const hasCustomBezier = mut?.cp1x !== undefined || mut?.cp2x !== undefined;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;

    // Si la herramienta activa es Mano (pan), permitir que el evento burbujee al lienzo
    if (activeTool === 'pan') {
      return;
    }

    e.stopPropagation();

    // Si la herramienta activa es Anotar, solicitar texto y crear nota atada
    if (activeTool === 'annotate') {
      selectNode(node.id, false);
      const label = node.label || `Dato #${node.rawIndex + 1}`;
      const text = prompt(`Añadir anotación atada a "${label}":`, `Nota: ${label}`);
      if (text && text.trim() !== '') {
        addAnnotation(node.id, text.trim(), 40, -45, 'bezier');
      }
      return;
    }

    selectNode(node.id, e.shiftKey || e.metaKey);

    // Herramienta Mover o Seleccionar: iniciar arrastre con zoom compensado
    if (activeTool === 'move' || activeTool === 'select') {
      setIsDragging(true);
      nodeDragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        initialX: currentX,
        initialY: currentY,
      };
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    }

    // Herramienta Curvar Bézier: inicializar manetas si no existen
    if (activeTool === 'bezier' && !hasCustomBezier) {
      updateBezierHandles(node.id, cp1x, cp1y, cp2x, cp2y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      const dx = (e.clientX - nodeDragStartRef.current.clientX) / zoom;
      const dy = (e.clientY - nodeDragStartRef.current.clientY) / zoom;
      updatePosition(node.id, nodeDragStartRef.current.initialX + dx, nodeDragStartRef.current.initialY + dy, true);
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

  const nodeCursor = isLocked
    ? 'cursor-not-allowed'
    : activeTool === 'pan'
    ? 'cursor-grab'
    : activeTool === 'annotate'
    ? 'cursor-crosshair'
    : activeTool === 'move'
    ? isDragging
      ? 'cursor-grabbing'
      : 'cursor-grab'
    : 'cursor-pointer';

  return (
    <g
      id={node.id}
      className={`${nodeCursor} transition-opacity`}
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

      {/* 2. Main Vector Node */}
      <g
        transform={`translate(${currentX}, ${currentY})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {hasCustomBezier ? (
          <path
            d={buildCubicBezierPath(
              { x: -radius, y: 0 },
              { x: cp1x, y: cp1y },
              { x: cp2x, y: cp2y },
              { x: radius, y: 0 }
            )}
            fill={fill}
            fillOpacity="0.88"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1"
            filter={isGlowEnabled ? 'url(#celestial-glow)' : undefined}
            style={{ mixBlendMode: blendMode as any }}
          />
        ) : (
          <circle
            r={radius}
            fill={fill}
            fillOpacity="0.9"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={isSelected ? 2 : 1}
            filter={isGlowEnabled ? 'url(#celestial-glow)' : undefined}
            style={{ mixBlendMode: blendMode as any }}
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
            r={radius + 4}
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

      {/* 4. Bézier Interactive Handles (Purged on export) */}
      {isSelected && activeTool === 'bezier' && (
        <g className="bezier-handles" data-editor-ui="true">
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX + cp1x}
            y2={currentY + cp1y}
            stroke="#0066cc"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="bezier-line"
          />
          <circle
            cx={currentX + cp1x}
            cy={currentY + cp1y}
            r={5}
            fill="#0066cc"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="bezier-handle cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            onPointerDown={handleCp1PointerDown}
            onPointerMove={handleCp1PointerMove}
            onPointerUp={handleCp1PointerUp}
          />

          <line
            x1={currentX}
            y1={currentY}
            x2={currentX + cp2x}
            y2={currentY + cp2y}
            stroke="#e11d48"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="bezier-line"
          />
          <circle
            cx={currentX + cp2x}
            cy={currentY + cp2y}
            r={5}
            fill="#e11d48"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="bezier-handle cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            onPointerDown={handleCp2PointerDown}
            onPointerMove={handleCp2PointerMove}
            onPointerUp={handleCp2PointerUp}
          />
        </g>
      )}
    </g>
  );
};
