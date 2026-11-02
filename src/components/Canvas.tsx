import React, { useRef, useState, useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import { useMutationStore } from '../store/mutationStore';
import { CanvasNode } from './CanvasNode';
import { TetheredAnnotations } from './TetheredAnnotations';
import { DataLassoContextMenu } from './DataLasso';
import { colorService } from '../services/colorService';
import { ZoomIn, ZoomOut, Maximize2, Upload, ShieldCheck } from 'lucide-react';
import { NectarineLogo } from './NectarineLogo';
import { openNativeFileDialog, processDataFile } from '../services/fileImportHelper';

interface CanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const Canvas: React.FC<CanvasProps> = ({ svgRef }) => {
  const {
    baseNodes,
    voronoiCells,
    chordRibbons,
    spiralTrack,
    celestialOrbits,
    constellationLinks,
    curvedTextPaths,
    axes,
    layoutBounds,
    chartType,
    setLayoutBounds,
    loadDataset,
  } = useDataStore();
  const { clearSelection, isGlowEnabled, activeTool } = useMutationStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputFallbackRef = useRef<HTMLInputElement>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
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
    if (e.button === 1 || e.altKey || activeTool === 'pan') {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
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

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processDataFile(file, loadDataset);
    }
  };

  const handleNativeUploadClick = async () => {
    await openNativeFileDialog(loadDataset, fileInputFallbackRef.current);
  };

  const handleFallbackFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processDataFile(file, loadDataset);
    }
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

  const cursorClass = isPanning
    ? 'cursor-grabbing'
    : activeTool === 'pan'
    ? 'cursor-grab'
    : activeTool === 'annotate'
    ? 'cursor-crosshair'
    : 'cursor-default';

  return (
    <div
      ref={containerRef}
      className={`flex-1 h-full relative overflow-hidden bg-[#fffdf9] select-none ${cursorClass} transition-colors ${
        isDraggingFile ? 'bg-rose-50/50 ring-4 ring-inset ring-[#e11d48]/20' : ''
      }`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input for Canvas Empty State */}
      <input
        ref={fileInputFallbackRef}
        type="file"
        accept=".csv,.json,.parquet"
        onChange={handleFallbackFileChange}
        className="hidden"
      />

      {/* Empty State / Drag-and-Drop Ingestion Card */}
      {baseNodes.length === 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 pointer-events-auto bg-[#fffdf9]/95 backdrop-blur-2xs">
          <div
            className={`max-w-md w-full p-8 rounded-2xl border-2 transition-all flex flex-col items-center text-center space-y-4 shadow-xl ${
              isDraggingFile
                ? 'border-[#e11d48] bg-[#fff5f5] scale-[1.02]'
                : 'border-dashed border-[#dfd2c4] bg-white'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#faf7f2] border border-[#ebd9c8] flex items-center justify-center shadow-2xs">
              <NectarineLogo size={36} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-[#2c1a0e] tracking-tight">
                Abre tus datos para comenzar
              </h2>
              <p className="text-xs text-[#5e4634] leading-relaxed">
                Arrastra y suelta aquí cualquier archivo <strong>CSV, JSON o Parquet</strong>, o pulsa el botón para seleccionarlo desde tu Mac.
              </p>
            </div>

            <button
              onClick={handleNativeUploadClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] active:translate-y-px text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Archivo de Datos</span>
            </button>

            <div className="flex items-center gap-2 pt-2 text-[10.5px] text-[#8c7664] font-mono">
              <span className="px-2 py-0.5 rounded bg-[#f5ede3] border border-[#e2d5c5]">.csv delimitado</span>
              <span className="px-2 py-0.5 rounded bg-[#f5ede3] border border-[#e2d5c5]">.json matrices</span>
              <span className="px-2 py-0.5 rounded bg-[#f5ede3] border border-[#e2d5c5]">.parquet columnar</span>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[10.5px] text-[#8c7664]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>Privacidad total: tus datos nunca salen de tu Mac</span>
            </div>
          </div>
        </div>
      )}

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

          {/* Nadieh Bremer / Visual Cinnamon Starlight & Aurora Glow Filters */}
          <filter id="celestial-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="ribbon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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

          {/* Cartesian Axes: only for Cartesian charts */}
          {chartType !== 'chord' && chartType !== 'spiral' && chartType !== 'celestial' && chartType !== 'network' && (
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
          )}

          {/* Visual Cinnamon: Chord Ribbons & Curved Outer Labels */}
          {chartType === 'chord' && (
            <>
              <g className="chord-ribbons-layer" style={{ mixBlendMode: currentBlendMode as any }}>
                {chordRibbons.map((ribbon) => (
                  <path
                    key={ribbon.id}
                    d={ribbon.d}
                    fill="none"
                    stroke={ribbon.color}
                    strokeWidth="2"
                    strokeOpacity={ribbon.opacity}
                    filter={isGlowEnabled ? 'url(#ribbon-glow)' : undefined}
                    className="transition-all"
                  />
                ))}
              </g>

              {/* Text on Curved Trajectory (textPath) */}
              <g className="curved-text-layer select-none">
                {curvedTextPaths.map((tp) => (
                  <g key={tp.id}>
                    <path id={tp.id} d={tp.pathD} fill="none" stroke="none" />
                    <text
                      fill={tp.fill || '#b44b10'}
                      fontSize={tp.fontSize || 10}
                      fontWeight="600"
                      letterSpacing="0.08em"
                    >
                      <textPath href={`#${tp.id}`} startOffset={tp.offset} textAnchor="middle">
                        {tp.text}
                      </textPath>
                    </text>
                  </g>
                ))}
              </g>
            </>
          )}

          {/* Visual Cinnamon: Golden Spiral Track & Rings */}
          {chartType === 'spiral' && spiralTrack && (
            <g className="spiral-layer">
              <g className="spiral-rings select-none" opacity="0.35">
                {spiralTrack.rings.map((ring, idx) => (
                  <g key={`ring-${idx}`}>
                    <circle
                      cx={layoutBounds.width / 2}
                      cy={layoutBounds.height / 2}
                      r={ring.radius}
                      fill="none"
                      stroke="#b44b10"
                      strokeWidth="0.8"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={layoutBounds.width / 2 + ring.radius + 4}
                      y={layoutBounds.height / 2 + 3}
                      fill="#8c7664"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {ring.label}
                    </text>
                  </g>
                ))}
              </g>
              <path
                d={spiralTrack.d}
                fill="none"
                stroke="#c2410c"
                strokeWidth="1.6"
                strokeOpacity="0.75"
                filter={isGlowEnabled ? 'url(#ribbon-glow)' : undefined}
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Visual Cinnamon: Celestial Orbits & Constellation Links */}
          {chartType === 'celestial' && (
            <g className="celestial-layer">
              <g className="celestial-orbits select-none" opacity="0.45">
                {celestialOrbits.map((orb, idx) => (
                  <g key={`orbit-${idx}`}>
                    <ellipse
                      cx={orb.cx}
                      cy={orb.cy}
                      rx={orb.rx}
                      ry={orb.ry}
                      transform={`rotate(${orb.rotation} ${orb.cx} ${orb.cy})`}
                      fill="none"
                      stroke={orb.stroke}
                      strokeWidth="1"
                      strokeDasharray="5 4"
                    />
                    {orb.label && (
                      <text
                        x={orb.cx}
                        y={orb.cy - orb.ry - 6}
                        textAnchor="middle"
                        fill="#8c7664"
                        fontSize="9.5"
                        fontFamily="monospace"
                      >
                        {orb.label}
                      </text>
                    )}
                  </g>
                ))}
              </g>

              <g className="constellation-links" opacity="0.6">
                {constellationLinks.map((link) => (
                  <line
                    key={link.id}
                    x1={link.x1}
                    y1={link.y1}
                    x2={link.x2}
                    y2={link.y2}
                    stroke={link.stroke}
                    strokeWidth="1.2"
                    strokeDasharray={link.dashArray}
                    filter={isGlowEnabled ? 'url(#ribbon-glow)' : undefined}
                  />
                ))}
              </g>
            </g>
          )}

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
                zoom={zoom}
              />
            ))}
          </g>

          <TetheredAnnotations zoom={zoom} />
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
