import React, { useEffect, useRef, useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { QuickStartBar } from './components/QuickStartBar';
import { SemanticLayersPanel } from './components/SemanticLayersPanel';
import { Canvas } from './components/Canvas';
import { NodeInspector } from './components/NodeInspector';
import { DataProfilerModal } from './components/DataProfilerModal';
import { GuardrailWarning } from './components/GuardrailWarning';
import { DocumentationModal } from './components/DocumentationModal';
import { useDataStore } from './store/dataStore';
import { duckdbService } from './services/duckdb';

export const App: React.FC = () => {
  const { loadDataset } = useDataStore();
  const [isProfilerOpen, setIsProfilerOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Keyboard shortcut listener for '?' to toggle documentation
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize DuckDB WASM and load default empirical dataset on startup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await duckdbService.loadDefaultDataset();
        if (mounted) {
          loadDataset('paises_y_desarrollo.csv', rows);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load initial dataset into DuckDB:', err);
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadDataset]);

  return (
    <div className="flex flex-col h-screen w-screen bg-mac-bg text-mac-text overflow-hidden font-sans transition-colors">
      {/* 1. macOS Native Window TitleBar with Documentation button */}
      <TitleBar onOpenDocs={() => setIsDocsOpen(true)} />

      {/* 2. Analytical & Vector Tools Bar (Clean & Focused Workbench) */}
      <Toolbar
        onOpenProfiler={() => setIsProfilerOpen(true)}
        svgRef={svgRef}
      />

      {/* 3. Discreet Sample Data Strip */}
      <QuickStartBar onOpenDocs={() => setIsDocsOpen(true)} />

      {/* 4. Main Workbench (Groups + Canvas + Node Inspector) */}
      <main className="flex-1 flex overflow-hidden relative">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-mac-bg text-mac-textSecondary">
            <div className="w-6 h-6 border-2 border-mac-accent border-t-transparent rounded-full animate-spin" />
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

      {/* 5. Modals, Documentation & Guardrails */}
      <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <DataProfilerModal isOpen={isProfilerOpen} onClose={() => setIsProfilerOpen(false)} />
      <GuardrailWarning />
    </div>
  );
};

export default App;
