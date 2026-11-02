import React, { useEffect, useRef, useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { SemanticLayersPanel } from './components/SemanticLayersPanel';
import { Canvas } from './components/Canvas';
import { NodeInspector } from './components/NodeInspector';
import { DataProfilerModal } from './components/DataProfilerModal';
import { GuardrailWarning } from './components/GuardrailWarning';
import { DocumentationModal } from './components/DocumentationModal';
import { duckdbService } from './services/duckdb';
import { useMutationStore } from './store/mutationStore';

export const App: React.FC = () => {
  const [isProfilerOpen, setIsProfilerOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Keyboard shortcut listener for tools and documentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsDocsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsDocsOpen(false);
        setIsProfilerOpen(false);
      } else if (e.key === 'h' || e.key === 'H') {
        useMutationStore.getState().setActiveTool('pan');
      } else if (e.key === 'v' || e.key === 'V') {
        useMutationStore.getState().setActiveTool('select');
      } else if (e.key === 'm' || e.key === 'M') {
        useMutationStore.getState().setActiveTool('move');
      } else if (e.key === 'b' || e.key === 'B') {
        useMutationStore.getState().setActiveTool('bezier');
      } else if (e.key === 'a' || e.key === 'A') {
        useMutationStore.getState().setActiveTool('annotate');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize DuckDB WASM in RAM cleanly on startup
  useEffect(() => {
    let mounted = true;
    duckdbService.init()
      .then(() => {
        if (mounted) setIsLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to initialize DuckDB WASM:', err);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-mac-bg text-mac-text overflow-hidden font-sans transition-colors">
      {/* 1. macOS Native Window TitleBar with Documentation button */}
      <TitleBar onOpenDocs={() => setIsDocsOpen(true)} />

      {/* 2. Analytical & Vector Tools Bar (Clean & Focused Workbench) */}
      <Toolbar
        onOpenProfiler={() => setIsProfilerOpen(true)}
        svgRef={svgRef}
      />

      {/* 3. Main Workbench (Groups + Canvas + Node Inspector) */}
      <main className="flex-1 flex overflow-hidden relative">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#fffdf9] text-[#8c7664]">
            <div className="w-6 h-6 border-2 border-[#e11d48] border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs">Preparando motor de datos en memoria...</span>
          </div>
        ) : (
          <>
            <SemanticLayersPanel />
            <Canvas svgRef={svgRef} />
            <NodeInspector />
          </>
        )}
      </main>

      {/* 4. Modals, Documentation & Guardrails */}
      <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <DataProfilerModal isOpen={isProfilerOpen} onClose={() => setIsProfilerOpen(false)} />
      <GuardrailWarning />
    </div>
  );
};

export default App;
