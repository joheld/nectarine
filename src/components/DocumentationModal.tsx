import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Compass,
  Spline,
  SunMedium,
  Download,
  Layers,
  Keyboard,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  Palette,
} from 'lucide-react';
import { NectarineLogo } from './NectarineLogo';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChapterId =
  | 'quickstart'
  | 'geometries'
  | 'vector-ethics'
  | 'lighting-color'
  | 'layers-annotations'
  | 'export-pipeline'
  | 'shortcuts';

interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

// Visual Mini-Diagrams for Documentation
const PipelineDiagram: React.FC = () => (
  <div className="p-4 rounded-xl bg-white border border-[#e6dcce] shadow-2xs">
    <div className="text-[11px] font-mono text-[#8c7664] uppercase tracking-wider mb-2">
      Flujo Operativo de Nectarine
    </div>
    <div className="grid grid-cols-4 gap-2 text-center text-xs">
      <div className="p-2.5 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#e11d48] text-sm">01</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11px]">DuckDB WASM</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5">Ingesta local en RAM</div>
      </div>
      <div className="p-2.5 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#f97316] text-sm">02</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11px]">Motor D3 Puro</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5">Cálculo sin tocar DOM</div>
      </div>
      <div className="p-2.5 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#059669] text-sm">03</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11px]">Lienzo Bézier</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5">Edición plástica libre</div>
      </div>
      <div className="p-2.5 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#2563eb] text-sm">04</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11px]">Purga Quirúrgica</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5">SVG puro para imprenta</div>
      </div>
    </div>
  </div>
);

const GhostTraceDiagram: React.FC = () => (
  <div className="p-4 rounded-xl bg-white border border-[#e6dcce] shadow-2xs flex flex-col md:flex-row items-center gap-6">
    <div className="w-full md:w-56 h-36 bg-[#fcfaf7] border border-[#ebd9c8] rounded-lg relative overflow-hidden flex items-center justify-center shrink-0">
      <svg width="200" height="130" viewBox="0 0 200 130" className="overflow-visible">
        {/* Origin math point */}
        <circle cx="45" cy="85" r="7" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="45" cy="85" r="2.5" fill="#0284c7" />
        <text x="45" y="105" fontSize="8.5" textAnchor="middle" fill="#0369a1" fontFamily="sans-serif" fontWeight="bold">
          Dato Matemático
        </text>

        {/* Ghost trace path */}
        <line x1="45" y1="85" x2="145" y2="45" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

        {/* User edited point */}
        <circle cx="145" cy="45" r="9" fill="#e11d48" />
        {/* Bézier handle tangent */}
        <line x1="125" y1="25" x2="165" y2="65" stroke="#be123c" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="125" cy="25" r="3" fill="#be123c" />
        <circle cx="165" cy="65" r="3" fill="#be123c" />

        {/* Pin icon on node */}
        <circle cx="145" cy="45" r="2.5" fill="#ffffff" />
        <text x="145" y="25" fontSize="8.5" textAnchor="middle" fill="#be123c" fontFamily="sans-serif" fontWeight="bold">
          Vector Editado
        </text>

        {/* Distortion badge */}
        <rect x="75" y="52" width="45" height="15" rx="4" fill="#fff1f2" stroke="#f43f5e" strokeWidth="0.8" />
        <text x="97" y="63" fontSize="8" textAnchor="middle" fill="#be123c" fontFamily="monospace" fontWeight="bold">
          Δ +28%
        </text>
      </svg>
    </div>

    <div className="space-y-1.5 text-xs text-[#5e4634]">
      <div className="font-semibold text-[#2c1a0e] text-xs">Captura Esquemática: Transparencia Ética</div>
      <p className="text-[11.5px] leading-relaxed">
        El círculo punteado azul muestra la verdad estadística calculada por D3. La línea discontinua proyecta el desplazamiento introducido por tu mano. Nectarine calcula la desviación en tiempo real para que decidas conscientemente el balance entre rigor científico y libertad plástica.
      </p>
    </div>
  </div>
);

const GeometryCard: React.FC<{
  title: string;
  badge: string;
  desc: string;
  bestFor: string;
  svgPreview: React.ReactNode;
}> = ({ title, badge, desc, bestFor, svgPreview }) => (
  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] flex flex-col md:flex-row gap-4 items-start">
    <div className="w-28 h-28 bg-white border border-[#ebd9c8] rounded-lg shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
      {svgPreview}
    </div>
    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex items-center justify-between flex-wrap gap-1">
        <h3 className="font-semibold text-xs text-[#2c1a0e]">{title}</h3>
        <span className="text-[9.5px] font-mono bg-[#ebd9c8] text-[#5e4634] px-1.5 py-0.5 rounded">
          {badge}
        </span>
      </div>
      <p className="text-xs text-[#5e4634] leading-relaxed">{desc}</p>
      <p className="text-[11px] text-[#8c7664]">
        <strong>Ideal para:</strong> {bestFor}
      </p>
    </div>
  </div>
);

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('quickstart');

  if (!isOpen) return null;

  const chapters: Chapter[] = [
    {
      id: 'quickstart',
      title: 'Inicio Rápido',
      subtitle: 'De datos crudos a vector en 3 pasos',
      icon: <Sparkles className="w-4 h-4 text-[#e11d48]" />,
    },
    {
      id: 'geometries',
      title: 'Las 9 Geometrías',
      subtitle: 'Catálogo visual de diagramas y arte',
      icon: <Compass className="w-4 h-4 text-[#f97316]" />,
    },
    {
      id: 'vector-ethics',
      title: 'Edición & Ética de Datos',
      subtitle: 'Bézier, anclajes y monitor de distorsión',
      icon: <Spline className="w-4 h-4 text-[#b45309]" />,
    },
    {
      id: 'lighting-color',
      title: 'Iluminación & Fusión',
      subtitle: 'Resplandor estelar y paletas editoriales',
      icon: <SunMedium className="w-4 h-4 text-[#d97706]" />,
    },
    {
      id: 'layers-annotations',
      title: 'Capas & Anotaciones',
      subtitle: 'Agrupaciones semánticas y notas que viajan',
      icon: <Layers className="w-4 h-4 text-[#059669]" />,
    },
    {
      id: 'export-pipeline',
      title: 'Exportación e Imprenta',
      subtitle: 'Purga higiénica de gizmos para Illustrator/Figma',
      icon: <Download className="w-4 h-4 text-[#2563eb]" />,
    },
    {
      id: 'shortcuts',
      title: 'Atajos de Teclado',
      subtitle: 'Hoja de trucos y flujo de trabajo rápido',
      icon: <Keyboard className="w-4 h-4 text-[#7c3aed]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
      <div className="bg-[#f8f5ee] border border-[#e6dcce] rounded-2xl w-full max-w-5xl h-[86vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <header className="h-14 px-6 border-b border-[#e6dcce] bg-[#f4ede4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <NectarineLogo size={24} className="w-6 h-6 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2c1a0e] text-sm tracking-tight">Nectarine</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] bg-[#ebd9c8] text-[#5e4634] px-1.5 py-0.5 rounded">
                  Manual de Taller
                </span>
              </div>
              <p className="text-[11px] text-[#8c7664]">
                Guía paso a paso para crear ilustraciones analíticas de calibre editorial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7664] hover:text-[#2c1a0e] hover:bg-[#ebd9c8] transition-colors"
            title="Cerrar manual (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body: Sidebar + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chapters Sidebar */}
          <nav className="w-64 border-r border-[#e6dcce] bg-[#f8f5ee] p-3 space-y-1 overflow-y-auto shrink-0">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8c7664]">
              Capítulos
            </div>

            {chapters.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(ch.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-white text-[#2c1a0e] shadow-xs border border-[#e6dcce]'
                      : 'text-[#5e4634] hover:bg-[#ede5db] hover:text-[#2c1a0e]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{ch.icon}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-tight">{ch.title}</div>
                    <div className="text-[10.5px] text-[#8c7664] truncate leading-tight mt-0.5">
                      {ch.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 px-3 border-t border-[#e6dcce] mt-4">
              <div className="text-[11px] text-[#8c7664] leading-relaxed">
                <strong>Consejo:</strong> Presiona <kbd className="font-mono text-[10px] bg-[#ede5db] px-1 py-0.5 rounded border border-[#dfd2c4]">?</kbd> en cualquier momento para abrir este manual.
              </div>
            </div>
          </nav>

          {/* Chapter Content Canvas */}
          <main className="flex-1 bg-[#fffdf9] p-8 overflow-y-auto text-[#2c1a0e] select-text">
            {activeChapter === 'quickstart' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e11d48]">Capítulo 1</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Inicio Rápido: De una Hoja de Cálculo a una Ilustración Vectorial
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine une dos mundos que antes requerían programar en D3.js y exportar manualmente a Illustrator: un <strong>motor de datos analítico local en memoria</strong> y un <strong>lienzo de dibujo vectorial interactivo</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#e11d48]/10 text-[#e11d48] font-bold text-xs flex items-center justify-center font-mono">
                      1
                    </div>
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Carga tus Datos</h3>
                    <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                      Arrastra cualquier archivo <strong>CSV, JSON o Parquet</strong>. El motor DuckDB WASM los lee 100% en tu equipo, sin enviar ningún byte a la nube.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#f97316]/10 text-[#f97316] font-bold text-xs flex items-center justify-center font-mono">
                      2
                    </div>
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Elige la Geometría</h3>
                    <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                      Selecciona una de las <strong>9 geometrías disponibles</strong> (Dispersión, Cuerdas, Espiral, Celestial, Mosaico, etc.). Nectarine calcula la matemática al instante.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#059669]/10 text-[#059669] font-bold text-xs flex items-center justify-center font-mono">
                      3
                    </div>
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Modifica y Exporta</h3>
                    <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                      Arrastra puntos, curva líneas con manetas de Bézier y exporta un <strong>SVG puro</strong> sin marcas de edición, listo para imprimir o maquetar.
                    </p>
                  </div>
                </div>

                {/* Walkthrough & Pipeline */}
                <PipelineDiagram />

                {/* Example Walkthrough Box */}
                <div className="p-5 rounded-xl bg-[#f5ede3] border border-[#dfd2c4] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2c1a0e]">
                    <FileSpreadsheet className="w-4 h-4 text-[#e11d48]" />
                    <span>Ejemplo Práctico: Datos de Desarrollo Mundial</span>
                  </div>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Si cargas un archivo con columnas como <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-[11px]">gdp_per_capita</code>, <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-[11px]">life_expectancy</code> y <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-[11px]">region</code>:
                  </p>
                  <ul className="text-xs text-[#5e4634] space-y-1.5 list-disc list-inside">
                    <li>El eje horizontal medirá el poder adquisitivo en escala continua.</li>
                    <li>El eje vertical medirá la longevidad en años.</li>
                    <li>Las carpetas de la barra lateral agruparán automáticamente los países por continente.</li>
                    <li>Si cambias a <strong>Cuerdas</strong> o <strong>Celestial</strong>, los países orbitarán o se conectarán con cintas orgánicas según su región.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeChapter === 'geometries' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#f97316]">Capítulo 2</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Enciclopedia de Geometrías: Cuándo Usar Cada Vista
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine incluye tanto las proyecciones cartesianas clásicas como las geometrías astronómicas y fluidas que definen el arte de datos contemporáneo.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Cuerdas */}
                  <GeometryCard
                    title="1. Cuerdas Radiales (Chord Diagrams)"
                    badge="Relaciones Circulares"
                    desc="Distribuye las entidades a lo largo de una circunferencia perfecta y traza cintas fluidas Bézier hacia el centro que conectan los puntos que comparten categorías o flujos. Incluye tipografía en arco exterior (textPath) que abraza la curva."
                    bestFor="Redes de afinidad, intercambio comercial, familias genealógicas o taxonomías."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e6dcce" strokeWidth="1" />
                        <path d="M 22 22 Q 50 50 78 78" fill="none" stroke="#e11d48" strokeWidth="2.5" opacity="0.6" />
                        <path d="M 78 22 Q 50 50 22 78" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.6" />
                        <path d="M 50 10 Q 50 50 50 90" fill="none" stroke="#0d9488" strokeWidth="1.5" opacity="0.5" />
                        <circle cx="22" cy="22" r="3.5" fill="#e11d48" />
                        <circle cx="78" cy="22" r="3.5" fill="#f97316" />
                        <circle cx="78" cy="78" r="3.5" fill="#e11d48" />
                        <circle cx="22" cy="78" r="3.5" fill="#f97316" />
                        <circle cx="50" cy="10" r="3" fill="#0d9488" />
                        <circle cx="50" cy="90" r="3" fill="#0d9488" />
                      </svg>
                    }
                  />

                  {/* Espiral */}
                  <GeometryCard
                    title="2. Espiral Áurea de Arquímedes"
                    badge="Tiempo Cíclico"
                    desc="Plantea una trayectoria matemática continua que se expande hacia el exterior a lo largo de 2.8 ciclos. El radio y el tamaño de cada nodo aumentan en proporción a la magnitud del dato, acompañados de 3 anillos concéntricos guía."
                    bestFor="Series temporales cíclicas (estaciones, meses, crisis económicas históricas)."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="16" fill="none" stroke="#ede5db" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="32" fill="none" stroke="#ede5db" strokeWidth="1" strokeDasharray="2 2" />
                        <path
                          d="M 50 50 A 6 6 0 0 1 56 50 A 12 12 0 0 1 44 50 A 20 20 0 0 1 64 50 A 28 28 0 0 1 36 50 A 36 36 0 0 1 76 50"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="1.2"
                        />
                        <circle cx="50" cy="50" r="2" fill="#f97316" />
                        <circle cx="56" cy="50" r="2.5" fill="#f97316" />
                        <circle cx="44" cy="50" r="3" fill="#f97316" />
                        <circle cx="64" cy="50" r="3.5" fill="#e11d48" />
                        <circle cx="36" cy="50" r="4" fill="#e11d48" />
                        <circle cx="76" cy="50" r="4.5" fill="#be123c" />
                      </svg>
                    }
                  />

                  {/* Celestial */}
                  <GeometryCard
                    title="3. Mapa Celestial & Constelaciones"
                    badge="Astrolabio"
                    desc="Proyecta 3 órbitas elípticas inclinadas con estética de carta estelar histórica. Los puntos se posicionan como estrellas relucientes y se trazan líneas punteadas de constelación uniendo los elementos afines."
                    bestFor="Portadas, infografías de divulgación científica o storytelling estético."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <ellipse cx="50" cy="50" rx="42" ry="20" fill="none" stroke="#dfd2c4" strokeWidth="1" transform="rotate(-20 50 50)" />
                        <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="#ebd9c8" strokeWidth="1" transform="rotate(35 50 50)" />
                        {/* Constellation lines */}
                        <line x1="30" y1="35" x2="65" y2="25" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                        <line x1="65" y1="25" x2="70" y2="60" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                        <circle cx="30" cy="35" r="3" fill="#f59e0b" />
                        <circle cx="65" cy="25" r="3.5" fill="#e11d48" />
                        <circle cx="70" cy="60" r="3" fill="#1e3a8a" />
                        <circle cx="25" cy="65" r="2.5" fill="#0d9488" />
                        <circle cx="50" cy="50" r="4" fill="#be123c" />
                      </svg>
                    }
                  />

                  {/* Mosaico & Ondas */}
                  <GeometryCard
                    title="4. Mosaico de Voronoi & Ondas Fluidas"
                    badge="Partición & Flujos"
                    desc="El Mosaico divide el espacio en polígonos orgánicos según proximidad de Delaunay. Las Ondas (Streamgraph) modelan flujos temporales continuos apilados con curvas suaves Bézier."
                    bestFor="Distribución territorial, ecosistemas, balances de mercado y evolución histórica."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        {/* Voronoi / Streamwaves abstract preview */}
                        <path d="M 5 60 C 25 35 45 75 70 50 C 85 35 95 45 95 45 L 95 85 L 5 85 Z" fill="#fee2e2" opacity="0.7" />
                        <path d="M 5 70 C 30 55 55 80 80 65 L 95 72 L 95 85 L 5 85 Z" fill="#fed7aa" opacity="0.8" />
                        <circle cx="25" cy="45" r="2.5" fill="#e11d48" />
                        <circle cx="55" cy="65" r="3" fill="#f97316" />
                        <circle cx="80" cy="50" r="2.5" fill="#be123c" />
                      </svg>
                    }
                  />
                </div>
              </div>
            )}

            {activeChapter === 'vector-ethics' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b45309]">Capítulo 3</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Edición Artística & El Monitor Ético de Distorsión
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    ¿Cómo modificar artísticamente un gráfico sin falsear la información? Nectarine implementa un sistema pionero de <strong>anclajes con rastros fantasma</strong> y <strong>auditoría de distorsión en tiempo real</strong>.
                  </p>
                </div>

                {/* Visual Diagram */}
                <GhostTraceDiagram />

                <div className="p-4 rounded-xl bg-[#fff7ed] border border-[#fed7aa] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#9a3412]">
                    <ShieldAlert className="w-4 h-4 text-[#ea580c]" />
                    <span>El Principio Ético del Rastro Fantasma</span>
                  </div>
                  <p className="text-xs text-[#7c2d12] leading-relaxed">
                    Cuando arrastras un nodo fuera de su posición matemática (con la herramienta de Mover <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border text-[10px]">M</kbd>), Nectarine hace dos cosas:
                  </p>
                  <ol className="text-xs text-[#7c2d12] space-y-1.5 list-decimal list-inside">
                    <li><strong>Fija el nodo (Pin):</strong> El punto conserva tu posición manual aunque los datos de fondo se recalculen o filtres el dataset.</li>
                    <li><strong>Proyecta un rastro guía azul translúcido:</strong> Una línea discontinua dibuja la trayectoria exacta hacia donde el punto debería estar según la matemática pura.</li>
                    <li><strong>Calcula el porcentaje de distorsión (Δ %):</strong> Te indica cuánto se ha inflado o desplazado el valor respecto a la verdad empírica.</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">Control de Curvas de Bézier (Herramienta <kbd className="font-mono bg-[#ede5db] px-1 py-0.5 rounded text-[11px]">B</kbd>)</h3>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Al seleccionar la herramienta de Curvar y tocar cualquier nodo, emergen dos <strong>manetas de Bézier tangentes</strong>. Arrastrando estas manetas puedes transformar un círculo rígido en una gota orgánica, una hoja o una forma elástica, permitiendo ilustrar con los datos como si fueran plastilina.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">¿Cómo restaurar un punto modificado?</h3>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Toca el nodo modificado para abrir el Inspector Lateral y haz clic en <strong>«Regresar a su posición exacta»</strong>. El punto volverá de forma suave a sus coordenadas matemáticas originales.
                  </p>
                </div>
              </div>
            )}

            {activeChapter === 'lighting-color' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d97706]">Capítulo 4</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Iluminación, Resplandor & Modos de Fusión Vectorial
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    El secreto de que las ilustraciones no se vean planas ni con tonos empastados reside en el uso de <strong>filtros SVG nativos</strong> y <strong>modos de fusión cromática</strong>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="flex items-center gap-2">
                      <SunMedium className="w-4 h-4 text-[#ea580c]" />
                      <h3 className="font-semibold text-xs text-[#2c1a0e]">El Filtro de Luz y Resplandor (Glow)</h3>
                    </div>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      Al encender el botón <strong>«Luz & Glow»</strong> en la barra de herramientas, Nectarine inyecta un filtro compuesto de <code className="font-mono text-[11px] bg-[#ede5db] px-1 py-0.5 rounded">&lt;feGaussianBlur&gt;</code> y <code className="font-mono text-[11px] bg-[#ede5db] px-1 py-0.5 rounded">&lt;feMerge&gt;</code>. Los nodos y las cintas emiten un halo suave que emula la luz estelar o la tinta fresca sobre papel de alta absorción.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#e11d48]" />
                      <h3 className="font-semibold text-xs text-[#2c1a0e]">Modo de Fusión: «Multiply» (Multiplicar)</h3>
                    </div>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      La paleta oficial <strong>Nectarine & Melocotón</strong> opera en modo de fusión <code className="font-mono text-[11px] bg-[#ede5db] px-1 py-0.5 rounded">mix-blend-mode: multiply</code>. Cuando dos capas o cintas se cruzan, no se tapan bruscamente: sus tintas se combinan creando un tercer tono más profundo, tal como sucede en la imprenta tradicional de grabado o serigrafía.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'layers-annotations' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#059669]">Capítulo 5</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Capas Semánticas & Anotaciones Atadas
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    En Nectarine las capas no son listas interminables de vectores anónimos: se organizan automáticamente a partir de las dimensiones categóricas de tus datos.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Carpetas Inteligentes por Dimensión</h3>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      En el panel izquierdo, los nodos se agrupan en carpetas según su categoría (por ejemplo, continentes, segmentos de clientes o familias de producto). Desde cada carpeta puedes:
                    </p>
                    <ul className="text-xs text-[#5e4634] space-y-1 list-disc list-inside">
                      <li><strong>Seleccionar el grupo completo:</strong> Haz clic en el nombre de la categoría para resaltar todos sus nodos a la vez.</li>
                      <li><strong>Cambiar el color del grupo:</strong> Toca la muestra de color para teñir todas las entidades de esa categoría en un clic.</li>
                      <li><strong>Ocultar o bloquear:</strong> Usa el icono de ojo o candado para centrar tu atención en un solo sector del lienzo.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-3">
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Anotaciones Atadas (Herramienta <kbd className="font-mono bg-[#ede5db] px-1 py-0.5 rounded text-[11px]">A</kbd>)</h3>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      Con la herramienta de Anotar activa, haz clic en cualquier nodo para crear un cartel explicativo o flecha arqueada. La anotación queda físicamente vinculada al identificador del dato: si trasladas el punto o recalculas las coordenadas, <strong>la anotación viajará junto con él</strong> sin despegarse jamás.
                    </p>

                    {/* Annotation Visual Diagram */}
                    <div className="p-3 rounded-lg bg-white border border-[#ebd9c8] flex items-center justify-center">
                      <svg width="260" height="75" viewBox="0 0 260 75" className="overflow-visible">
                        <circle cx="45" cy="55" r="7" fill="#0d9488" />
                        <path d="M 45 47 C 45 20, 95 20, 125 25" fill="none" stroke="#5e4634" strokeWidth="1.2" strokeDasharray="3 3" />
                        <polygon points="125,22 131,26 124,30" fill="#5e4634" />
                        <rect x="135" y="10" width="115" height="34" rx="6" fill="#fbf8f3" stroke="#ebd9c8" strokeWidth="1" />
                        <text x="143" y="24" fontSize="9" fontWeight="bold" fill="#2c1a0e" fontFamily="sans-serif">Suiza (PIB $87.5k)</text>
                        <text x="143" y="36" fontSize="7.5" fill="#8c7664" fontFamily="sans-serif">Longevidad: 83.8 años</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'export-pipeline' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2563eb]">Capítulo 6</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Exportación e Imprenta: El Proceso de Purga SVG
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    El gran problema de muchas herramientas web es que al exportar te entregan un archivo lleno de cajas de selección, líneas fantasma y código sucio. Nectarine resuelve esto con una rutina quirúrgica de purga.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1e40af]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                    <span>¿Qué hace el botón «Exportar SVG»?</span>
                  </div>
                  <ol className="text-xs text-[#1e3a8a] space-y-1.5 list-decimal list-inside">
                    <li><strong>Clona el árbol vectorial en memoria:</strong> No toca tu pantalla visible.</li>
                    <li><strong>Purga todos los gizmos de interfaz:</strong> Elimina cajas de selección, anillos de resalte, pines de anclaje, líneas fantasma de distorsión y manetas de Bézier.</li>
                    <li><strong>Preserva el arte:</strong> Conserva todas las cintas de cuerdas, órbitas celestiales, textos en trayectoria, gradientes y filtros de resplandor.</li>
                    <li><strong>Escribe el archivo estándar al disco:</strong> Abre el diálogo nativo de macOS para guardar un archivo <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded border">.svg</code> 100% puro que puedes abrir directamente en Adobe Illustrator, Affinity Designer, Figma o enviar a imprenta.</li>
                  </ol>

                  {/* Before / After Purge Visual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-white border border-[#ebd9c8] space-y-2 text-center shadow-2xs">
                      <div className="text-[10px] font-mono text-[#be123c] uppercase font-semibold">
                        En el Taller (Herramientas Activas)
                      </div>
                      <div className="h-24 bg-[#faf7f2] border border-dashed border-[#e6dcce] rounded-lg flex items-center justify-center">
                        <svg width="140" height="70" viewBox="0 0 140 70">
                          <rect x="40" y="15" width="60" height="40" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx="70" cy="35" r="9" fill="#e11d48" />
                          <line x1="35" y1="52" x2="70" y2="35" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 3" />
                          <circle cx="35" cy="52" r="2.5" fill="#0284c7" />
                          <circle cx="70" cy="35" r="2.5" fill="#fff" />
                          <circle cx="100" cy="15" r="3" fill="#2563eb" />
                          <circle cx="40" cy="55" r="3" fill="#2563eb" />
                        </svg>
                      </div>
                      <div className="text-[10.5px] text-[#8c7664] leading-tight">
                        Cajas de selección, tiradores, pines y líneas guía de distorsión.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-2 text-center shadow-2xs">
                      <div className="text-[10px] font-mono text-[#15803d] uppercase font-semibold">
                        SVG Exportado (Purga Quirúrgica)
                      </div>
                      <div className="h-24 bg-white border border-[#bbf7d0] rounded-lg flex items-center justify-center">
                        <svg width="140" height="70" viewBox="0 0 140 70">
                          <circle cx="70" cy="35" r="9" fill="#e11d48" />
                        </svg>
                      </div>
                      <div className="text-[10.5px] text-[#15803d] leading-tight">
                        Vector puro, limpio y estándar sin elementos residuales de UI.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'shortcuts' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7c3aed]">Capítulo 7</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Atajos de Teclado & Productividad
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine está pensada para ser operada con agilidad mediante atajos nativos directos.
                  </p>
                </div>

                <div className="border border-[#e6dcce] rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e6dcce] bg-[#f8f5ee] text-[#5e4634]">
                        <th className="py-2.5 px-4 font-semibold">Atajo</th>
                        <th className="py-2.5 px-4 font-semibold">Acción</th>
                        <th className="py-2.5 px-4 font-semibold">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e7dc] text-[#2c1a0e]">
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">V</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Herramienta Seleccionar</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Toca nodos para inspeccionarlos o abrir su menú contextual.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">M</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Herramienta Mover</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Arrastra vectores libremente; los ancla y genera el rastro guía.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">B</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Herramienta Bézier</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Edita manetas tangentes para deformar nodos circularmente.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">A</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Herramienta Anotar</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Toca un punto para crear una nota explicativa que viaje con él.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Doble Clic</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Fijar / Liberar Anclaje</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Alterna la propiedad de anclaje (pin) en el nodo tocado.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Rueda del Ratón</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Zoom In / Out</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Acerca o aleja la vista desde un 30% hasta un 500%.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Alt + Arrastre</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Desplazar Lienzo (Pan)</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Navega por el espacio de trabajo libremente sin seleccionar nodos.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">?</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Abrir Manual</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Despliega esta ventana de documentación completa.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Esc</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Cerrar Modales</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Cierra la documentación o cualquier ventana emergente activa.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modal Footer */}
        <footer className="h-12 px-6 border-t border-[#e6dcce] bg-[#f4ede4] flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-[#8c7664]">
            <BookOpen className="w-4 h-4 text-[#e11d48]" />
            <span>Nectarine Studio — Artesanía de Datos & Vectores para macOS</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2c1a0e] text-white hover:bg-[#1a0f07] transition-colors font-medium shadow-2xs"
          >
            Entendido, volver al taller
          </button>
        </footer>
      </div>
    </div>
  );
};