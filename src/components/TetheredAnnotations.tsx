import React, { useRef, useState } from 'react';
import { useLayerStore } from '../store/layerStore';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { buildArchedArrowPath } from '../engine/bezierMath';

export const TetheredAnnotations: React.FC = () => {
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
      {/* SVG Marker definition for organic arrows */}
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
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#aab2c0" />
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

        const handlePointerDown = (e: React.PointerEvent) => {
          e.stopPropagation();
          setActiveDraggingId(ann.id);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialDx: ann.dx,
            initialDy: ann.dy,
          };
          (e.target as Element).setPointerCapture(e.pointerId);
        };

        const handlePointerMove = (e: React.PointerEvent) => {
          if (activeDraggingId === ann.id) {
            e.stopPropagation();
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
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
              (e.target as Element).releasePointerCapture(e.pointerId);
            } catch (_) {}
          }
        };

        return (
          <g key={ann.id} className="tethered-annotation select-none">
            {/* Dynamic Arched Connector Line */}
            <path
              d={arrowPath}
              fill="none"
              stroke="#868e9e"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              markerEnd="url(#editorial-arrow)"
              className="transition-all"
            />

            {/* Annotation Text Card */}
            <g
              transform={`translate(${cardX}, ${cardY})`}
              className="cursor-move"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const newText = prompt('Editar texto de la anotación:', ann.text);
                if (newText !== null) {
                  if (newText.trim() === '') removeAnnotation(ann.id);
                  else updateAnnotation(ann.id, { text: newText });
                }
              }}
            >
              {/* Background badge pill */}
              <rect
                x={-6}
                y={-14}
                width={Math.max(120, ann.text.length * 6.5 + 16)}
                height={22}
                rx={4}
                fill="rgba(22, 25, 34, 0.95)"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="0.8"
                className="filter drop-shadow-md"
              />
              <text
                x={4}
                y={2}
                fill="#f1f5f9"
                fontSize="10"
                fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
                fontWeight="500"
              >
                {ann.text}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};
