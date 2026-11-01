import React, { useEffect, useRef, useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { Toolbar } from './components/Toolbar';
import { SemanticLayersPanel } from './components/SemanticLayersPanel';
import { Canvas } from './components/Canvas';
import { DataProfilerModal } from './components/DataProfilerModal';
import { GuardrailWarning } from './components/GuardrailWarning';
import { useDataStore } from './store/dataStore';
import { duckdbService } from './services/duckdb';

export const App: React.FC = () => {
  const { loadDataset } = useDataStore();
  const [isProfilerOpen, setIsProfilerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Initialize DuckDB WASM and load default empirical dataset on startup
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await duckdbService.loadDefaultDataset();
        if (mounted) {
          loadDataset('world_development.csv', rows);
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
    <div className="flex flex-col h-screen w-screen bg-mac-bg text-gray-100 overflow-hidden font-sans">
      {/* 1. macOS Native Window TitleBar */}
      <TitleBar />

      {/* 2. Analytical & Vector Tools Bar */}
      <Toolbar onOpenProfiler={() => setIsProfilerOpen(true)} svgRef={svgRef} />

      {/* 3. Main Workbench (Semantic Layers + Interactive Canvas) */}
      <main className="flex-1 flex overflow-hidden relative">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-mac-bg text-gray-400">
            <div className="w-6 h-6 border-2 border-mac-accent border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs">Inicializando motor local DuckDB WASM...</span>
          </div>
        ) : (
          <>
            <SemanticLayersPanel />
            <Canvas svgRef={svgRef} />
          </>
        )}
      </main>

      {/* 4. Modals and Guardrails */}
      <DataProfilerModal isOpen={isProfilerOpen} onClose={() => setIsProfilerOpen(false)} />
      <GuardrailWarning />
    </div>
  );
};

export default App;
