import React, { useRef, useState, useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { CanvasNode } from './CanvasNode';
import { TetheredAnnotations } from './TetheredAnnotations';
import { DataLassoContextMenu } from './DataLasso';
import { colorService } from '../services/colorService';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const Canvas: React.FC<CanvasProps> = ({ svgRef }) => {
  const { baseNodes, voronoiCells, axes, layoutBounds, chartType, setLayoutBounds } = useDataStore();
  const { clearSelection } = useMutationStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetNodeId: string | null;
  }>({ visible: false, x: 0, y: 0, targetNodeId: null });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 200 && height > 200) {
          setLayoutBounds({
            width: Math.floor(width),
            height: Math.floor(height),
            padding: { top: 40, right: 50, bottom: 60, left: 75 },
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setLayoutBounds]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.max(0.3, Math.min(prev * zoomFactor, 5)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      return;
    }

    if (e.button === 0 && (e.target as Element).tagName === 'svg') {
      clearSelection();
      setContextMenu((prev) => ({ ...prev, visible: false }));
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as Element;
    const nodeElement = target.closest('g[id^="node-"]');
    const targetId = nodeElement ? nodeElement.getAttribute('id') : null;

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetNodeId: targetId,
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const currentBlendMode = colorService.getBlendMode();

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full relative overflow-hidden bg-[#fffdf9] select-none cursor-default"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
    >
      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg border border-stone-200 shadow-sm text-xs text-stone-700">
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.2, 5))}
          className="p-1.5 rounded hover:bg-stone-100"
          title="Acercar (Zoom In)"
        >
          <ZoomIn className="w-3.5 h-3.5 text-stone-600" />
        </button>
        <span className="font-mono text-[10px] w-12 text-center text-stone-500 font-medium">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.max(z / 1.2, 0.3))}
          className="p-1.5 rounded hover:bg-stone-100"
          title="Alejar (Zoom Out)"
        >
          <ZoomOut className="w-3.5 h-3.5 text-stone-600" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 rounded hover:bg-stone-100"
          title="Centrar vista"
        >
          <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
        </button>
      </div>

      {/* Primary SVG Rendering Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full block"
        viewBox={`0 0 ${layoutBounds.width} ${layoutBounds.height}`}
      >
        <defs>
          <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" fill="#e5dacd" />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <rect
            x={0}
            y={0}
            width={layoutBounds.width}
            height={layoutBounds.height}
            fill="url(#grid-dots)"
            className="pointer-events-none"
          />

          <g className="axes-group select-none" data-editor-ui="true">
            {axes.xTicks.map((t, idx) => (
              <g key={`xtick-${idx}`} transform={`translate(${t.x}, ${layoutBounds.height - layoutBounds.padding.bottom})`}>
                <line y1="0" y2="6" stroke="#c4b5a5" />
                <line y1="0" y2={-(layoutBounds.height - layoutBounds.padding.bottom - layoutBounds.padding.top)} stroke="#ede3d7" strokeDasharray="3 3" />
                <text
                  y="18"
                  textAnchor="middle"
                  fill="#78716c"
                  fontSize="9.5"
                  fontFamily="SF Mono, monospace"
                >
                  {typeof t.value === 'number' ? t.value.toLocaleString() : t.value}
                </text>
              </g>
            ))}

            {axes.yTicks.map((t, idx) => (
              <g key={`ytick-${idx}`} transform={`translate(${layoutBounds.padding.left}, ${t.y})`}>
                <line x1="-6" x2="0" stroke="#c4b5a5" />
                <line x1="0" x2={layoutBounds.width - layoutBounds.padding.left - layoutBounds.padding.right} stroke="#ede3d7" strokeDasharray="3 3" />
                <text
                  x="-10"
                  y="3"
                  textAnchor="end"
                  fill="#78716c"
                  fontSize="9.5"
                  fontFamily="SF Mono, monospace"
                >
                  {typeof t.value === 'number' ? t.value.toLocaleString() : t.value}
                </text>
              </g>
            ))}
          </g>

          {chartType === 'voronoi' && (
            <g className="voronoi-mesh" opacity="0.45">
              {Array.from(voronoiCells.entries()).map(([nodeId, pathD]) => (
                <path
                  key={`voronoi-${nodeId}`}
                  d={pathD}
                  fill="none"
                  stroke="#c2410c"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              ))}
            </g>
          )}

          <g className="nodes-group">
            {baseNodes.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                blendMode={currentBlendMode}
              />
            ))}
          </g>

          <TetheredAnnotations />
        </g>
      </svg>

      {contextMenu.visible && (
        <DataLassoContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetNodeId={contextMenu.targetNodeId}
          onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
};
