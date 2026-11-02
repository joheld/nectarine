import React, { useRef, useState } from 'react';
import { useLayerStore } from '../store/layerStore';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { buildArchedArrowPath } from '../engine/bezierMath';

interface TetheredAnnotationsProps {
  zoom?: number;
}

export const TetheredAnnotations: React.FC<TetheredAnnotationsProps> = ({ zoom = 1 }) => {
  const { annotations, updateAnnotation, removeAnnotation } = useLayerStore();
  const { baseNodes } = useDataStore();
  const { mutations } = useMutationStore();
  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; initialDx: number; initialDy: number }>({
    startX: 0,
    startY: 0,
    initialDx: 0,
    initialDy: 0,
  });

  return (
    <g className="tethered-annotations-group">
      <defs>
        <marker
          id="editorial-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#b45309" />
        </marker>
      </defs>

      {annotations.map((ann) => {
        const baseNode = baseNodes.find((n) => n.id === ann.targetNodeId);
        if (!baseNode) return null;

        const mut = mutations[baseNode.id];
        const nodeX = mut?.customX ?? baseNode.mathX;
        const nodeY = mut?.customY ?? baseNode.mathY;

        const cardX = nodeX + ann.dx;
        const cardY = nodeY + ann.dy;

        const { path: arrowPath } = buildArchedArrowPath(
          { x: cardX, y: cardY },
          { x: nodeX, y: nodeY },
          ann.curveType === 'bezier' ? 0.25 : 0.05
        );

        const cardWidth = Math.max(130, ann.text.length * 6.8 + 32);

        const handlePointerDown = (e: React.PointerEvent) => {
          e.stopPropagation();
          setActiveDraggingId(ann.id);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialDx: ann.dx,
            initialDy: ann.dy,
          };
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
        };

        const handlePointerMove = (e: React.PointerEvent) => {
          if (activeDraggingId === ann.id) {
            e.stopPropagation();
            const deltaX = (e.clientX - dragRef.current.startX) / zoom;
            const deltaY = (e.clientY - dragRef.current.startY) / zoom;
            updateAnnotation(ann.id, {
              dx: dragRef.current.initialDx + deltaX,
              dy: dragRef.current.initialDy + deltaY,
            });
          }
        };

        const handlePointerUp = (e: React.PointerEvent) => {
          if (activeDraggingId === ann.id) {
            setActiveDraggingId(null);
            try {
              (e.currentTarget as Element).releasePointerCapture(e.pointerId);
            } catch (_) {}
          }
        };

        return (
          <g key={ann.id} className="tethered-annotation select-none" data-editor-ui="true">
            {/* Dynamic Arched Connector Line */}
            <path
              d={arrowPath}
              fill="none"
              stroke="#d97706"
              strokeWidth="1.3"
              strokeDasharray="3 2"
              markerEnd="url(#editorial-arrow)"
              className="transition-all"
            />

            {/* Annotation Text Card with warm editorial styling */}
            <g
              transform={`translate(${cardX}, ${cardY})`}
              className="cursor-grab active:cursor-grabbing group"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const newText = prompt('Editar texto de la anotación (deja vacío para eliminar):', ann.text);
                if (newText !== null) {
                  if (newText.trim() === '') removeAnnotation(ann.id);
                  else updateAnnotation(ann.id, { text: newText.trim() });
                }
              }}
            >
              <rect
                x={-6}
                y={-14}
                width={cardWidth}
                height={24}
                rx={6}
                fill="#fffbf5"
                stroke="#e6dcce"
                strokeWidth="1.2"
                className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
              />
              <text
                x={4}
                y={2.5}
                fill="#2c1a0e"
                fontSize="10"
                fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                fontWeight="600"
              >
                {ann.text}
              </text>

              {/* Close / Delete badge button */}
              <g
                transform={`translate(${cardWidth - 14}, -2)`}
                className="cursor-pointer hover:scale-125 transition-transform"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  removeAnnotation(ann.id);
                }}
              >
                <title>Eliminar anotación</title>
                <circle r={6.5} fill="#fee2e2" stroke="#fca5a5" strokeWidth="0.8" />
                <text
                  x={0}
                  y={2.5}
                  textAnchor="middle"
                  fill="#b91c1c"
                  fontSize="8"
                  fontWeight="bold"
                >
                  ×
                </text>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
};
