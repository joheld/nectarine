import React, { useRef, useState } from 'react';
import { BaseNode } from '../engine/types';
import { useMutationStore } from '../store/mutationStore';
import { colorService } from '../services/colorService';
import { useLayerStore } from '../store/layerStore';
import { buildCubicBezierPath } from '../engine/bezierMath';

interface CanvasNodeProps {
  node: BaseNode;
  blendMode: string;
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({ node, blendMode }) => {
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
  } = useMutationStore();

  const { layerOverrides } = useLayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCp1, setIsDraggingCp1] = useState(false);
  const [isDraggingCp2, setIsDraggingCp2] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const mut = mutations[node.id];
  const isSelected = selectedNodeIds.includes(node.id);
  const layerOverride = layerOverrides[node.category];

  // If layer is hidden, do not render
  if (layerOverride?.isVisible === false) {
    return null;
  }

  const isLocked = layerOverride?.isLocked || false;

  // Compute resolved coordinates and styling
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

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    selectNode(node.id, e.shiftKey || e.metaKey);

    if (activeTool === 'move' || activeTool === 'select') {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      updatePosition(node.id, currentX + dx, currentY + dy, true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Bézier CP1 dragging
  const handleCp1PointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingCp1(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handleCp1PointerMove = (e: React.PointerEvent) => {
    if (isDraggingCp1) {
      e.stopPropagation();
      const newCp1x = e.clientX - currentX;
      const newCp1y = e.clientY - currentY;
      updateBezierHandles(node.id, newCp1x, newCp1y, cp2x, cp2y);
    }
  };

  const handleCp1PointerUp = (e: React.PointerEvent) => {
    if (isDraggingCp1) {
      setIsDraggingCp1(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Bézier CP2 dragging
  const handleCp2PointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDraggingCp2(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handleCp2PointerMove = (e: React.PointerEvent) => {
    if (isDraggingCp2) {
      e.stopPropagation();
      const newCp2x = e.clientX - currentX;
      const newCp2y = e.clientY - currentY;
      updateBezierHandles(node.id, cp1x, cp1y, newCp2x, newCp2y);
    }
  };

  const handleCp2PointerUp = (e: React.PointerEvent) => {
    if (isDraggingCp2) {
      setIsDraggingCp2(false);
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Render organic Bézier petals if edited, otherwise circle
  const hasCustomBezier = mut?.cp1x !== undefined || mut?.cp2x !== undefined;

  return (
    <g
      id={node.id}
      className="cursor-pointer transition-opacity"
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
          {/* Dashed projection line */}
          <line
            x1={currentX}
            y1={currentY}
            x2={node.mathX}
            y2={node.mathY}
            stroke="#00ffff"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            strokeOpacity="0.6"
          />
          {/* Ghost phantom node at exact mathematical location */}
          <circle
            cx={node.mathX}
            cy={node.mathY}
            r={node.mathR}
            fill="none"
            stroke="#00ffff"
            strokeWidth="1"
            strokeDasharray="2 2"
            strokeOpacity="0.5"
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
            fillOpacity="0.85"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            style={{ mixBlendMode: blendMode as any }}
          />
        ) : (
          <circle
            r={radius}
            fill={fill}
            fillOpacity="0.88"
            stroke="#ffffff"
            strokeWidth={isSelected ? 2 : 1}
            strokeOpacity={isSelected ? 0.9 : 0.3}
            style={{ mixBlendMode: blendMode as any }}
          />
        )}

        {/* Pin indicator badge */}
        {isPinned && (
          <circle
            cx={radius * 0.7}
            cy={-radius * 0.7}
            r={3.5}
            fill="#ff9f0a"
            stroke="#0e1117"
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
            stroke="#0a84ff"
            strokeWidth="1.8"
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
            fill="rgba(255, 69, 58, 0.9)"
            stroke="rgba(255, 255, 255, 0.3)"
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
          {/* CP1 handle line and control node */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX + cp1x}
            y2={currentY + cp1y}
            stroke="#0a84ff"
            strokeWidth="1"
            className="bezier-line"
          />
          <circle
            cx={currentX + cp1x}
            cy={currentY + cp1y}
            r={4.5}
            fill="#0a84ff"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="bezier-handle cursor-grab active:cursor-grabbing"
            onPointerDown={handleCp1PointerDown}
            onPointerMove={handleCp1PointerMove}
            onPointerUp={handleCp1PointerUp}
          />

          {/* CP2 handle line and control node */}
          <line
            x1={currentX}
            y1={currentY}
            x2={currentX + cp2x}
            y2={currentY + cp2y}
            stroke="#ff2a85"
            strokeWidth="1"
            className="bezier-line"
          />
          <circle
            cx={currentX + cp2x}
            cy={currentY + cp2y}
            r={4.5}
            fill="#ff2a85"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="bezier-handle cursor-grab active:cursor-grabbing"
            onPointerDown={handleCp2PointerDown}
            onPointerMove={handleCp2PointerMove}
            onPointerUp={handleCp2PointerUp}
          />
        </g>
      )}
    </g>
  );
};
