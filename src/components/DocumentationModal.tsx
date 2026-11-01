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
  Database,
  HelpCircle,
  SlidersHorizontal,
  Cpu,
  Share2,
} from 'lucide-react';
import { NectarineLogo } from './NectarineLogo';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChapterId =
  | 'quickstart'
  | 'data-ingestion'
  | 'geometries'
  | 'vector-ethics'
  | 'lighting-color'
  | 'layers-annotations'
  | 'export-pipeline'
  | 'performance-faq'
  | 'shortcuts';

interface Chapter {
  id: ChapterId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Inline Visual SVG Diagrams (High-Fidelity Vector Captures)
// ---------------------------------------------------------------------------

const PipelineDiagram: React.FC = () => (
  <div className="p-4 rounded-xl bg-white border border-[#e6dcce] shadow-2xs">
    <div className="text-[11px] font-mono text-[#8c7664] uppercase tracking-wider mb-2.5">
      Flujo Operativo de Nectarine: Del Dato Crudo a la Ilustración Impresa
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center text-xs">
      <div className="p-3 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#e11d48] text-sm">01</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11.5px]">DuckDB WASM</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5 leading-tight">Ingesta 100% local en RAM sin servidores</div>
      </div>
      <div className="p-3 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#f97316] text-sm">02</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11.5px]">Motor D3 Puro</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5 leading-tight">Escalas y trigonometría sin tocar DOM</div>
      </div>
      <div className="p-3 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#059669] text-sm">03</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11.5px]">Lienzo Bézier</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5 leading-tight">Edición plástica con anclajes y rastros</div>
      </div>
      <div className="p-3 rounded-lg bg-[#faf7f2] border border-[#ebd9c8]">
        <div className="font-mono font-bold text-[#2563eb] text-sm">04</div>
        <div className="font-semibold text-[#2c1a0e] mt-1 text-[11.5px]">Purga Quirúrgica</div>
        <div className="text-[10px] text-[#8c7664] mt-0.5 leading-tight">SVG puro listo para Illustrator y prensa</div>
      </div>
    </div>
  </div>
);

const GhostTraceDiagram: React.FC = () => (
  <div className="p-4 rounded-xl bg-white border border-[#e6dcce] shadow-2xs flex flex-col md:flex-row items-center gap-6">
    <div className="w-full md:w-60 h-40 bg-[#fcfaf7] border border-[#ebd9c8] rounded-lg relative overflow-hidden flex items-center justify-center shrink-0">
      <svg width="220" height="140" viewBox="0 0 220 140" className="overflow-visible">
        {/* Origin math point */}
        <circle cx="50" cy="95" r="8" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="95" r="3" fill="#0284c7" />
        <text x="50" y="118" fontSize="9" textAnchor="middle" fill="#0369a1" fontFamily="sans-serif" fontWeight="bold">
          Dato Matemático
        </text>

        {/* Ghost trace path */}
        <line x1="50" y1="95" x2="160" y2="45" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

        {/* User edited point */}
        <circle cx="160" cy="45" r="10" fill="#e11d48" />
        {/* Bézier handle tangent */}
        <line x1="135" y1="20" x2="185" y2="70" stroke="#be123c" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="135" cy="20" r="3.5" fill="#be123c" />
        <circle cx="185" cy="70" r="3.5" fill="#be123c" />

        {/* Pin icon on node */}
        <circle cx="160" cy="45" r="2.5" fill="#ffffff" />
        <text x="160" y="22" fontSize="9" textAnchor="middle" fill="#be123c" fontFamily="sans-serif" fontWeight="bold">
          Vector Editado
        </text>

        {/* Distortion badge */}
        <rect x="85" y="58" width="50" height="18" rx="5" fill="#fff1f2" stroke="#f43f5e" strokeWidth="0.8" />
        <text x="110" y="71" fontSize="9" textAnchor="middle" fill="#be123c" fontFamily="monospace" fontWeight="bold">
          Δ +28%
        </text>
      </svg>
    </div>

    <div className="space-y-2 text-xs text-[#5e4634]">
      <div className="font-semibold text-[#2c1a0e] text-xs">Captura Esquemática: Transparencia Ética & Rastro Fantasma</div>
      <p className="text-[11.5px] leading-relaxed">
        El círculo punteado azul muestra la coordenada empírica pura calculada por D3. La línea discontinua proyecta en tiempo real el desplazamiento inducido por la mano del artista.
      </p>
      <p className="text-[11px] text-[#8c7664] leading-relaxed">
        Nectarine calcula continuamente la desviación porcentual (<strong className="font-mono text-[#be123c]">Δ%</strong>) para que el diseñador tome decisiones conscientes entre composición artística y fidelidad analítica.
      </p>
    </div>
  </div>
);

const GeometryCard: React.FC<{
  title: string;
  badge: string;
  desc: string;
  formula?: string;
  bestFor: string;
  svgPreview: React.ReactNode;
}> = ({ title, badge, desc, formula, bestFor, svgPreview }) => (
  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] flex flex-col md:flex-row gap-4 items-start shadow-2xs">
    <div className="w-28 h-28 bg-white border border-[#ebd9c8] rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
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
      {formula && (
        <div className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-[#dfd2c4] text-[#8c7664]">
          <strong>Fórmula/Fundamento:</strong> {formula}
        </div>
      )}
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
      title: '1. Inicio Rápido & Filosofía',
      subtitle: 'De datos crudos a vector editorial en 4 pasos',
      icon: <Sparkles className="w-4 h-4 text-[#e11d48]" />,
    },
    {
      id: 'data-ingestion',
      title: '2. Ingesta & Motor DuckDB',
      subtitle: 'CSV, JSON, Parquet en RAM y filtros sin SQL',
      icon: <Database className="w-4 h-4 text-[#d97706]" />,
    },
    {
      id: 'geometries',
      title: '3. Las 9 Geometrías Maestras',
      subtitle: 'Catálogo exhaustivo de diagramas y arte visual',
      icon: <Compass className="w-4 h-4 text-[#f97316]" />,
    },
    {
      id: 'vector-ethics',
      title: '4. Edición & Ética de Datos',
      subtitle: 'Bézier, anclajes y monitor de distorsión',
      icon: <Spline className="w-4 h-4 text-[#b45309]" />,
    },
    {
      id: 'lighting-color',
      title: '5. Iluminación & Fusión Serigráfica',
      subtitle: 'Resplandor estelar y paletas editoriales',
      icon: <SunMedium className="w-4 h-4 text-[#eab308]" />,
    },
    {
      id: 'layers-annotations',
      title: '6. Capas, Lazo & Anotaciones',
      subtitle: 'Carpetas semánticas y notas que viajan',
      icon: <Layers className="w-4 h-4 text-[#059669]" />,
    },
    {
      id: 'export-pipeline',
      title: '7. Exportación e Imprenta',
      subtitle: 'Purga higiénica para Illustrator y Figma',
      icon: <Download className="w-4 h-4 text-[#2563eb]" />,
    },
    {
      id: 'performance-faq',
      title: '8. Rendimiento & Preguntas',
      subtitle: 'Guardarraíl >10k nodos y solución de dudas',
      icon: <HelpCircle className="w-4 h-4 text-[#0d9488]" />,
    },
    {
      id: 'shortcuts',
      title: '9. Hoja de Trucos de Teclado',
      subtitle: 'Atajos esenciales de productividad con ratón',
      icon: <Keyboard className="w-4 h-4 text-[#7c3aed]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
      <div className="bg-[#f8f5ee] border border-[#e6dcce] rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <header className="h-14 px-6 border-b border-[#e6dcce] bg-[#f4ede4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <NectarineLogo size={24} className="w-6 h-6 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2c1a0e] text-sm tracking-tight">Nectarine Studio</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] bg-[#ebd9c8] text-[#5e4634] px-1.5 py-0.5 rounded font-medium">
                  Manual de Referencia Oficial
                </span>
              </div>
              <p className="text-[11px] text-[#8c7664]">
                Guía técnica, matemática y artística paso a paso para dominar el taller vectorial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8c7664] hover:text-[#2c1a0e] hover:bg-[#ebd9c8] transition-colors cursor-pointer"
            title="Cerrar manual (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body: Sidebar + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chapters Sidebar */}
          <nav className="w-72 border-r border-[#e6dcce] bg-[#f8f5ee] p-3 space-y-1 overflow-y-auto shrink-0">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8c7664]">
              Índice de Capítulos
            </div>

            {chapters.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(ch.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
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
                <strong>Atajo global:</strong> Presiona <kbd className="font-mono text-[10px] bg-[#ede5db] px-1 py-0.5 rounded border border-[#dfd2c4]">?</kbd> en cualquier lugar para alternar este manual.
              </div>
            </div>
          </nav>

          {/* Chapter Content Canvas */}
          <main className="flex-1 bg-[#fffdf9] p-8 overflow-y-auto text-[#2c1a0e] select-text">
            {/* 1. QUICKSTART */}
            {activeChapter === 'quickstart' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e11d48]">Capítulo 1</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Inicio Rápido & Filosofía del Taller
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine nació para superar la dolorosa fragmentación entre programar gráficos en D3.js o Python y editarlos manualmente en Adobe Illustrator. Nectarine une en un único entorno nativo de macOS un <strong>motor analítico en memoria SQL (DuckDB WASM)</strong> y un <strong>lienzo vectorial de dibujo artístico libre</strong>.
                  </p>
                </div>

                {/* Walkthrough & Pipeline */}
                <PipelineDiagram />

                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">El Flujo de 4 Pasos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#e11d48]/10 text-[#e11d48] font-bold text-xs flex items-center justify-center font-mono">1</span>
                        <h4 className="font-semibold text-xs text-[#2c1a0e]">Importa tus Datos</h4>
                      </div>
                      <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                        Arrastra cualquier archivo CSV, JSON o Parquet. DuckDB WASM perfila las columnas en microsegundos y determina cuáles son métricas y cuáles dimensiones.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#f97316]/10 text-[#f97316] font-bold text-xs flex items-center justify-center font-mono">2</span>
                        <h4 className="font-semibold text-xs text-[#2c1a0e]">Escoge la Geometría</h4>
                      </div>
                      <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                        Elige entre 9 geometrías en la barra superior. Nectarine ilumina automáticamente los diagramas compatibles según las columnas disponibles.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#059669]/10 text-[#059669] font-bold text-xs flex items-center justify-center font-mono">3</span>
                        <h4 className="font-semibold text-xs text-[#2c1a0e]">Compón & Modifica</h4>
                      </div>
                      <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                        Mueve puntos (<kbd className="font-mono text-[10px] bg-white px-1 rounded border">M</kbd>), curva aristas con manetas de Bézier (<kbd className="font-mono text-[10px] bg-white px-1 rounded border">B</kbd>) y añade anotaciones (<kbd className="font-mono text-[10px] bg-white px-1 rounded border">A</kbd>). El monitor ético auditará tus cambios.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#2563eb]/10 text-[#2563eb] font-bold text-xs flex items-center justify-center font-mono">4</span>
                        <h4 className="font-semibold text-xs text-[#2c1a0e]">Purga & Exporta</h4>
                      </div>
                      <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                        Toca «Exportar SVG». El motor purgará cajas y gizmos de selección, entregando un archivo vectorial limpio listo para Illustrator o imprenta.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical Example */}
                <div className="p-5 rounded-xl bg-[#f5ede3] border border-[#dfd2c4] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#2c1a0e]">
                    <FileSpreadsheet className="w-4 h-4 text-[#e11d48]" />
                    <span>Tutorial Guiado: Tu Primera Infografía en 3 Minutos</span>
                  </div>
                  <ol className="text-xs text-[#5e4634] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Haz clic en el botón <strong>«Países & Economía»</strong> de la barra de muestras superior para cargar los datos de 30 naciones.</li>
                    <li>Observa cómo Nectarine activa la vista de <strong>Dispersión</strong> con el PIB per cápita en X y la Esperanza de Vida en Y.</li>
                    <li>Cambia la geometría a <strong>«Cuerdas»</strong> para ver a los países organizados en una circunferencia conectándose mediante cintas orgánicas según su continente.</li>
                    <li>Activa la herramienta <strong>Mover (<kbd className="font-mono text-[10px] bg-white px-1 rounded border">M</kbd>)</strong> y arrastra a Singapur o Suiza para destacarlos; nota la línea discontinua azul (rastro fantasma) que se proyecta hacia su posición original.</li>
                    <li>Toca <strong>«Luz & Glow»</strong> para bañar la ilustración con resplandor estelar y haz clic en <strong>«Exportar SVG»</strong>.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 2. DATA INGESTION */}
            {activeChapter === 'data-ingestion' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d97706]">Capítulo 2</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Ingesta de Datos, DuckDB WASM & Filtros sin SQL
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine procesa tus datos directamente en el hardware de tu Mac usando <strong>DuckDB compilado a WebAssembly</strong>. La privacidad es total: tus archivos nunca viajan a servidores remotos ni salen de tu equipo.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7] space-y-2">
                  <h3 className="font-semibold text-xs text-[#92400e]">Formatos Soportados & Detección de Esquemas</h3>
                  <div className="space-y-2 text-xs text-[#78350f]">
                    <p>
                      <strong>1. Archivos CSV (.csv):</strong> Separados por coma, punto y coma o tabulación. Nectarine infiere automáticamente si los campos son números con coma o punto decimal y detecta encabezados.
                    </p>
                    <p>
                      <strong>2. Archivos JSON (.json):</strong> Matrices planas de objetos (ej: <code className="font-mono bg-white px-1 rounded">[&#123; "pais": "Chile", "pib": 15000 &#125;]</code>).
                    </p>
                    <p>
                      <strong>3. Archivos Parquet (.parquet):</strong> Estándar analítico columnar de alto rendimiento. Lee millones de celdas en milisegundos con compresión Snappy/ZSTD.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">El Asistente Estructural (Profiler de Columnas)</h3>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Al cargar cualquier dataset, Nectarine clasifica cada columna en una de tres naturalezas estadísticas:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-[#e6dcce] space-y-1">
                      <div className="font-mono font-semibold text-[11px] text-[#059669]">Métricas Cuantitativas</div>
                      <p className="text-[10.5px] text-[#8c7664] leading-snug">Números enteros o flotantes. Alimentan ejes de coordenadas, radios y grosores de cintas.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#e6dcce] space-y-1">
                      <div className="font-mono font-semibold text-[11px] text-[#2563eb]">Dimensiones Categóricas</div>
                      <p className="text-[10.5px] text-[#8c7664] leading-snug">Texto o etiquetas discretas. Alimentan la paleta de colores y las carpetas de capas.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-[#e6dcce] space-y-1">
                      <div className="font-mono font-semibold text-[11px] text-[#7c3aed]">Variables Temporales</div>
                      <p className="text-[10.5px] text-[#8c7664] leading-snug">Fechas o años secuenciales. Alimentan espirales temporales y ondas acumulativas.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-3">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#f97316]" />
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Filtros Visuales & Transformaciones sin Fórmulas</h3>
                  </div>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Al pulsar el botón <strong>«Filtros»</strong> en la barra de herramientas, se abre el panel de control de datos donde puedes:
                  </p>
                  <ul className="text-xs text-[#5e4634] space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>Filtrar por Umbral Numérico:</strong> Muestra solo entidades con valores mayores o menores a cierto límite.</li>
                    <li><strong>Excluir o Incluir Categorías:</strong> Desmarca continentes o tipos de producto con un solo clic.</li>
                    <li><strong>Top N (Los más relevantes):</strong> Limita el gráfico a los primeros 10, 20 o 50 registros más altos.</li>
                    <li><strong>Agrupación Previa (Group By):</strong> Agrega miles de transacciones individuales promediándolas por categoría para ilustrar resúmenes claros.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. GEOMETRIES */}
            {activeChapter === 'geometries' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#f97316]">Capítulo 3</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Enciclopedia Exhaustiva de las 9 Geometrías
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Cada geometría matemática resuelve un desafío perceptual diferente. Nectarine incluye tanto las proyecciones analíticas cartesianas como las geometrías estelares y fluidas inspiradas en <em>Visual Cinnamon</em> (Nadieh Bremer).
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Cuerdas */}
                  <GeometryCard
                    title="1. Cuerdas Radiales (Radial Chord Diagrams)"
                    badge="Relaciones & Flujos"
                    desc="Distribuye las entidades sobre una circunferencia perimetral y proyecta cintas fluidas de Bézier cúbico hacia el centro que comunican los puntos afines. Las etiquetas rotan suavemente sobre la circunferencia exterior mediante arcos SVG (<textPath>)."
                    formula="Distribución polar θ = 2π(i / N) con punto de control central Q(cx, cy)"
                    bestFor="Redes de comercio internacional, genealogías, ecosistemas tecnológicos o taxonomías."
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
                    desc="Plantea una trayectoria matemática continua que se expande hacia el exterior a lo largo de 2.8 ciclos. El radio y el diámetro de cada nodo aumentan en proporción a la magnitud del dato, acompañados de 3 anillos concéntricos guía (33%, 66% y 100%)."
                    formula="r(θ) = r_min + t * (r_max - r_min) donde θ ∈ [0, 5.6π]"
                    bestFor="Series temporales cíclicas (estaciones, meses, crisis económicas periódicas, calentamiento global)."
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
                    badge="Astrolabio Kepleriano"
                    desc="Proyecta 3 planos orbitales elípticos inclinados con estética de carta estelar histórica. Los puntos se posicionan como estrellas relucientes con magnitud proporcional a sus valores y se trazan constelaciones punteadas uniendo elementos de la misma categoría."
                    formula="Elipses de Kepler con rotación angular α_k y semiejes (rx, ry)"
                    bestFor="Portadas editoriales, storytelling científico, mapas de innovación y astronomía."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <ellipse cx="50" cy="50" rx="42" ry="20" fill="none" stroke="#dfd2c4" strokeWidth="1" transform="rotate(-20 50 50)" />
                        <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke="#ebd9c8" strokeWidth="1" transform="rotate(35 50 50)" />
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

                  {/* Voronoi */}
                  <GeometryCard
                    title="4. Mosaico de Voronoi (Delaunay Tessellation)"
                    badge="Partición Espacial"
                    desc="Divide el espacio continuo en polígonos orgánicos donde cada celda engloba la región del lienzo más cercana a su dato generador. Cada polígono se colorea y responde a la interacción como una tesela de vitral moderno."
                    formula="Celdas de Voronoi V(p_i) = {x : d(x, p_i) ≤ d(x, p_j) ∀j≠i}"
                    bestFor="Cobertura territorial, segmentación de mercados, mapas de influencia y arte abstracto."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <polygon points="5,5 55,5 45,45 5,35" fill="#fee2e2" stroke="#f43f5e" strokeWidth="0.8" />
                        <polygon points="55,5 95,5 95,50 45,45" fill="#ffedd5" stroke="#f97316" strokeWidth="0.8" />
                        <polygon points="5,35 45,45 35,95 5,95" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
                        <polygon points="45,45 95,50 95,95 35,95" fill="#ccfbf1" stroke="#0d9488" strokeWidth="0.8" />
                        <circle cx="25" cy="20" r="2.5" fill="#e11d48" />
                        <circle cx="70" cy="25" r="2.5" fill="#ea580c" />
                        <circle cx="20" cy="65" r="2.5" fill="#d97706" />
                        <circle cx="65" cy="70" r="2.5" fill="#0f766e" />
                      </svg>
                    }
                  />

                  {/* Red de Fuerza */}
                  <GeometryCard
                    title="5. Red de Fuerza (Force-Directed Graph)"
                    badge="Física de Partículas"
                    desc="Modela los datos como partículas en suspensión sometidas a fuerzas de repulsión electrostática de Coulomb (para evitar solapamientos) y enlaces de tensión elástica de Hooke entre entidades de la misma familia."
                    formula="F_rep = k / d², F_atr = -c * d (Simulación numérica de Verlet)"
                    bestFor="Grafos de conocimiento, redes neuronales, interacción de proteínas y sistemas complejos."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <line x1="50" y1="50" x2="25" y2="30" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="50" y1="50" x2="75" y2="30" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="50" y1="50" x2="30" y2="75" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="50" y1="50" x2="70" y2="75" stroke="#cbd5e1" strokeWidth="1" />
                        <circle cx="50" cy="50" r="5" fill="#e11d48" />
                        <circle cx="25" cy="30" r="3.5" fill="#f97316" />
                        <circle cx="75" cy="30" r="3.5" fill="#f97316" />
                        <circle cx="30" cy="75" r="3.5" fill="#0d9488" />
                        <circle cx="70" cy="75" r="3.5" fill="#0d9488" />
                      </svg>
                    }
                  />

                  {/* Ondas Fluidas */}
                  <GeometryCard
                    title="6. Ondas Continuas (Streamgraph)"
                    badge="Flujos Apilados"
                    desc="Representa la masa acumulada de diferentes categorías a lo largo de un eje continuo mediante cintas orgánicas Bézier apiladas alrededor de un eje central ondulante."
                    formula="Apilamiento centrado (Baseline Silhouette: y0 = -0.5 ∑ y_i)"
                    bestFor="Tendencias históricas de ventas, evolución demográfica y flujos de tráfico digital."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <path d="M 5 50 C 25 30 50 65 75 45 C 85 38 95 42 95 42 L 95 62 C 80 58 55 78 25 58 L 5 65 Z" fill="#fee2e2" stroke="#e11d48" strokeWidth="0.8" />
                        <path d="M 5 65 C 25 58 55 78 80 62 L 95 68 L 95 85 L 5 85 Z" fill="#fed7aa" stroke="#f97316" strokeWidth="0.8" />
                      </svg>
                    }
                  />

                  {/* Dispersión & Burbujas */}
                  <GeometryCard
                    title="7. Dispersión, Burbujas & Barras Cartesiana"
                    badge="Estándar Analítico"
                    desc="Los pilares de la estadística cuantitativa. Dispersión para correlaciones bivariadas; Burbujas para 3 dimensiones métricas (con escala de radio corregida por raíz cuadrada √r según la ley de Flannery); y Barras para comparaciones discretas precisas."
                    formula="Área del círculo A = πr² ⟹ r ∝ √valor_métrica"
                    bestFor="Econometría, benchmarks de rendimiento, análisis clínico y reportes científicos."
                    svgPreview={
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <line x1="15" y1="85" x2="90" y2="85" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="15" y1="85" x2="15" y2="15" stroke="#cbd5e1" strokeWidth="1" />
                        <circle cx="30" cy="70" r="4" fill="#e11d48" />
                        <circle cx="50" cy="55" r="7" fill="#f97316" opacity="0.8" />
                        <circle cx="75" cy="30" r="9" fill="#0d9488" opacity="0.8" />
                        <circle cx="85" cy="20" r="3.5" fill="#7c3aed" />
                      </svg>
                    }
                  />
                </div>
              </div>
            )}

            {/* 4. VECTOR ETHICS */}
            {activeChapter === 'vector-ethics' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#b45309]">Capítulo 4</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Edición Plástica & El Monitor Ético de Distorsión
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Uno de los mayores dilemas en visualización de datos es el límite entre arte y manipulación (como advertían Edward Tufte y Alberto Cairo). ¿Cómo permitir que un ilustrador mueva un nodo para evitar solapamientos tipográficos sin falsear la verdad empírica? Nectarine resuelve esto con su <strong>motor de ética y rastros fantasma</strong>.
                  </p>
                </div>

                <GhostTraceDiagram />

                <div className="p-4 rounded-xl bg-[#fff7ed] border border-[#fed7aa] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#9a3412]">
                    <ShieldAlert className="w-4 h-4 text-[#ea580c]" />
                    <span>Cómo Opera el Monitor Ético en Tiempo Real</span>
                  </div>
                  <ol className="text-xs text-[#7c2d12] space-y-2 list-decimal list-inside leading-relaxed">
                    <li>
                      <strong>Anclaje Automático (`isPinned`):</strong> Al mover un vector con la herramienta Mover (<kbd className="font-mono bg-white px-1 py-0.5 rounded border text-[10px]">M</kbd>), el punto queda anclado. No volverá a moverse automáticamente si recalculas el diseño o filtras el dataset.
                    </li>
                    <li>
                      <strong>Proyección del Rastro Fantasma:</strong> Nectarine proyecta un rastro vectorial cian discontinuo (<code className="font-mono bg-white px-1 py-0.5 rounded">#0284c7</code>) entre la posición donde tu mano puso el vector y la coordenada matemática donde la fórmula D3 dice que debería estar.
                    </li>
                    <li>
                      <strong>Cálculo Porcentual de Desviación (Δ%):</strong> Mide la distancia euclidiana frente a la escala matemática real:
                      <div className="font-mono bg-white/80 p-2 rounded border border-[#fed7aa] my-1 text-[11px]">
                        Δ% = (Distancia_Desplazada / Longitud_Eje) × 100
                      </div>
                      Si la distorsión supera el 30%, el badge cambia a rojo advirtiendo que el gráfico podría desinformar al lector.
                    </li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">Herramienta de Curvar Bézier (<kbd className="font-mono bg-[#ede5db] px-1 py-0.5 rounded text-[11px]">B</kbd>)</h3>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Al seleccionar la herramienta de Curvar y tocar cualquier nodo, emergen dos <strong>manetas de Bézier tangentes con puntos de control</strong>. Arrastrando estos tiradores puedes deformar un círculo rígido para convertirlo en una gota orgánica, un pétalo o una célula fluida, permitiéndote esculpir con los datos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">¿Cómo restaurar un punto a su coordenada matemática exacta?</h3>
                  <p className="text-xs text-[#5e4634] leading-relaxed">
                    Toca el nodo con la herramienta de Seleccionar (<kbd className="font-mono bg-white px-1 py-0.5 rounded border text-[10px]">V</kbd>) para abrir el Inspector Lateral y haz clic en el botón <strong>«Regresar a su posición exacta»</strong>. El punto viajará suavemente de regreso a su verdad estadística y el rastro fantasma desaparecerá.
                  </p>
                </div>
              </div>
            )}

            {/* 5. LIGHTING & COLOR */}
            {activeChapter === 'lighting-color' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#eab308]">Capítulo 5</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Iluminación, Modos de Fusión & Color Editorial
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    La belleza visual que distingue a un gráfico aficionado de una pieza de galería estriba en el comportamiento de la luz y la superposición de tintas.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="flex items-center gap-2">
                      <SunMedium className="w-4 h-4 text-[#ea580c]" />
                      <h3 className="font-semibold text-xs text-[#2c1a0e]">El Filtro de Luz Estelar (Starlight Glow)</h3>
                    </div>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      Al encender el botón <strong>«Luz & Glow»</strong> en la barra de herramientas, Nectarine inyecta una cadena de filtros SVG de dos etapas:
                    </p>
                    <div className="font-mono text-[10.5px] bg-[#f0e7dc] p-2 rounded-lg border border-[#e2d5c5] space-y-0.5 text-[#5e4634]">
                      <div>&lt;filter id="celestial-glow"&gt;</div>
                      <div className="pl-4">&lt;feGaussianBlur stdDeviation="3.6" result="coloredBlur"/&gt;</div>
                      <div className="pl-4">&lt;feMerge&gt;</div>
                      <div className="pl-8">&lt;feMergeNode in="coloredBlur"/&gt;</div>
                      <div className="pl-8">&lt;feMergeNode in="SourceGraphic"/&gt;</div>
                      <div className="pl-4">&lt;/feMerge&gt;</div>
                      <div>&lt;/filter&gt;</div>
                    </div>
                    <p className="text-[11.5px] text-[#8c7664] leading-relaxed">
                      El resultado es un halo luminoso orgánico que emula estrellas sobre el firmamento o pigmento fresco sobre papel de grabado de alta absorción.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#e11d48]" />
                      <h3 className="font-semibold text-xs text-[#2c1a0e]">Modo de Fusión Serigráfico: «Multiply»</h3>
                    </div>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      La paleta oficial <strong>Nectarine & Melocotón</strong> opera en modo <code className="font-mono text-[11px] bg-[#ede5db] px-1 py-0.5 rounded">mix-blend-mode: multiply</code>. Al cruzarse dos cintas o esferas, no se tapan toscamente como plásticos opacos: sus tintas se fusionan multiplicativamente generando un tercer color más profundo, tal como sucede en la imprenta serigráfica tradicional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. LAYERS & ANNOTATIONS */}
            {activeChapter === 'layers-annotations' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#059669]">Capítulo 6</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Capas Semánticas, Selección en Lazo & Anotaciones Atadas
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    En software convencional de vectores (como Illustrator o Inkscape), un gráfico con 500 puntos produce 500 capas anónimas (<code className="font-mono text-[10px]">&lt;path_482&gt;</code>) imposibles de gestionar. Nectarine estructura las capas a partir de la inteligencia semántica de los datos.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                    <h3 className="font-semibold text-xs text-[#2c1a0e]">Carpetas Inteligentes por Dimensión</h3>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      En el panel izquierdo (`SemanticLayersPanel`), los nodos se agrupan en carpetas según su categoría (continentes, segmentos de clientes, divisiones de negocio):
                    </p>
                    <ul className="text-xs text-[#5e4634] space-y-1.5 list-disc list-inside leading-relaxed">
                      <li><strong>Selección Global de Carpeta:</strong> Haz clic en el nombre del grupo para seleccionar todos sus elementos en el lienzo.</li>
                      <li><strong>Pintado Masivo:</strong> Haz clic en la pastilla de color del grupo para teñir todas las entidades de esa categoría a la vez.</li>
                      <li><strong>Aislamiento (Solo):</strong> Oculta temporalmente los demás grupos con el icono de ojo para trabajar con precisión en una sola categoría.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#0d9488]" />
                      <h3 className="font-semibold text-xs text-[#2c1a0e]">Anotaciones Atadas (Invariante de Viaje)</h3>
                    </div>
                    <p className="text-xs text-[#5e4634] leading-relaxed">
                      Con la herramienta de Anotar activa (<kbd className="font-mono bg-[#ede5db] px-1 py-0.5 rounded text-[11px]">A</kbd>), haz clic en cualquier vector para fijar un cartel explicativo o flecha arqueada. La anotación queda atada físicamente al identificador único del dato (<code className="font-mono text-[10px]">node.id</code>): si cambias de gráfico, filtras el dataset o arrastras el punto, <strong>la anotación viajará solidariamente con el nodo sin despegarse jamás</strong>.
                    </p>

                    {/* Annotation Visual Diagram */}
                    <div className="p-3 rounded-lg bg-white border border-[#ebd9c8] flex items-center justify-center">
                      <svg width="280" height="80" viewBox="0 0 280 80" className="overflow-visible">
                        <circle cx="50" cy="58" r="8" fill="#0d9488" />
                        <path d="M 50 50 C 50 20, 105 20, 135 25" fill="none" stroke="#5e4634" strokeWidth="1.2" strokeDasharray="3 3" />
                        <polygon points="135,22 141,26 134,30" fill="#5e4634" />
                        <rect x="145" y="10" width="125" height="36" rx="6" fill="#fbf8f3" stroke="#ebd9c8" strokeWidth="1" />
                        <text x="154" y="25" fontSize="9.5" fontWeight="bold" fill="#2c1a0e" fontFamily="sans-serif">Suiza (PIB $87.5k)</text>
                        <text x="154" y="38" fontSize="8" fill="#8c7664" fontFamily="sans-serif">Longevidad: 83.8 años</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. EXPORT PIPELINE */}
            {activeChapter === 'export-pipeline' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#2563eb]">Capítulo 7</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Exportación Quirúrgica & Preparación para Imprenta / Figma
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Muchos programas de datos exportan archivos SVG plagados de cajas de selección, etiquetas de depuración y código desordenado. Nectarine cuenta con una rutina de purga en memoria (<code className="font-mono text-[11px]">exportService.ts</code>) que asegura un archivo estándar y prístino.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1e40af]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                    <span>¿Qué Sucede al Pulsar «Exportar SVG»?</span>
                  </div>
                  <ol className="text-xs text-[#1e3a8a] space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li><strong>Clonación de Árbol en Memoria:</strong> Nectarine clona el nodo SVG raíz sin congelar ni alterar la vista que tienes en pantalla.</li>
                    <li><strong>Purga de Gizmos de Interfaz:</strong> Se eliminan todas las cajas delimitadoras de selección, tiradores de resize, chinchetas de anclaje, líneas fantasma de distorsión y manetas de Bézier.</li>
                    <li><strong>Preservación Estética:</strong> Se conservan todas las cintas de cuerdas, órbitas elípticas, textos en arco (<code className="font-mono text-[10.5px]">textPath</code>), filtros de resplandor y modos de fusión serigráfica.</li>
                    <li><strong>Diálogo Nativo de macOS:</strong> Se abre la ventana nativa de guardado para almacenar el archivo vectorial <code className="font-mono bg-white px-1 py-0.5 rounded border text-[11px]">.svg</code> directamente en tu disco.</li>
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

                <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-2">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">Consejos de Producción para Prensa & Figma</h3>
                  <ul className="text-xs text-[#5e4634] space-y-1.5 list-disc list-inside leading-relaxed">
                    <li><strong>Adobe Illustrator:</strong> Abre el archivo `.svg` directamente con <kbd className="font-mono bg-white px-1 rounded border">Cmd + O</kbd>. Todas las rutas quedan agrupadas en capas lógicas con sus curvas Bézier intactas.</li>
                    <li><strong>Figma:</strong> Arrastra el archivo `.svg` a tu lienzo de diseño. Podrás editar nodos individuales y cambiar tipografías vectoriales sin perder nitidez.</li>
                    <li><strong>Conversión a CMYK para Imprenta:</strong> Si vas a enviar la pieza a imprenta offset o serigrafía, abre el SVG en Illustrator y convierte el modo de color a CMYK (perfil FOGRA39 o US Web Coated) para calibrar la saturación de las tintas.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 8. PERFORMANCE & FAQ */}
            {activeChapter === 'performance-faq' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#0d9488]">Capítulo 8</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Rendimiento, Guardarraíl &gt;10,000 Nodos & Preguntas Frecuentes
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine fue diseñado para mantener 60 fotogramas por segundo fluidos en los chips Apple Silicon (M1/M2/M3/M4) gestionando de forma inteligente la carga sobre el árbol DOM.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f0fdfa] border border-[#99f6e4] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#115e59]">
                    <Cpu className="w-4 h-4 text-[#0d9488]" />
                    <span>El Guardarraíl de Rendimiento (&gt;10,000 Nodos SVG)</span>
                  </div>
                  <p className="text-xs text-[#134e4a] leading-relaxed">
                    Los navegadores web y motores SVG se ralentizan severamente cuando existen más de diez mil elementos vectoriales activos con interacción simultánea. Nectarine incorpora un <strong>interceptor automático</strong> que detecta cuando una consulta supera ese umbral y:
                  </p>
                  <ul className="text-xs text-[#134e4a] space-y-1 list-disc list-inside">
                    <li>Alerta al usuario ofreciendo activar la <strong>vista simplificada</strong> (sin filtros pesados de sombra o resplandor).</li>
                    <li>Sugiere aplicar una <strong>agrupación previa</strong> en el panel de Filtros para promediar registros masivos.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-[#2c1a0e]">Preguntas Frecuentes (FAQ)</h3>

                  <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1">
                    <h4 className="font-semibold text-xs text-[#2c1a0e]">¿Por qué algunas geometrías aparecen deshabilitadas?</h4>
                    <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                      El asistente estructural evalúa las columnas de tus datos. Por ejemplo, las <em>Burbujas</em> requieren al menos 3 columnas numéricas (X, Y y Tamaño); si tu dataset solo tiene 2 métricas, el botón se atenúa para evitar errores de renderizado.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1">
                    <h4 className="font-semibold text-xs text-[#2c1a0e]">¿Puedo deshacer todas las ediciones manuales?</h4>
                    <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                      Sí. En la barra de herramientas, haz clic en el botón de restablecer (<code className="font-mono text-[10.5px]">RotateCcw</code>). Todos los nodos anclados volverán inmediatamente a sus posiciones matemáticas exactas y los rastros fantasma se limpiarán.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#e6dcce] space-y-1">
                    <h4 className="font-semibold text-xs text-[#2c1a0e]">¿Cómo me desplazo por el lienzo (Pan) si el gráfico es muy grande?</h4>
                    <p className="text-[11.5px] text-[#5e4634] leading-relaxed">
                      Mantén presionada la tecla <kbd className="font-mono bg-white px-1 rounded border text-[10px]">Alt</kbd> (o <kbd className="font-mono bg-white px-1 rounded border text-[10px]">Option</kbd>) y arrastra con el ratón o trackpad en cualquier parte del fondo para desplazar la vista sin seleccionar nodos involuntariamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SHORTCUTS */}
            {activeChapter === 'shortcuts' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7c3aed]">Capítulo 9</span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#2c1a0e] mt-1">
                    Hoja de Trucos de Teclado & Productividad
                  </h2>
                  <p className="text-sm text-[#5e4634] mt-2 leading-relaxed">
                    Nectarine cuenta con aceleradores de teclado pensados para diseñadores analíticos acostumbrados al flujo de trabajo rápido de Figma y Blender.
                  </p>
                </div>

                <div className="border border-[#e6dcce] rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e6dcce] bg-[#f8f5ee] text-[#5e4634]">
                        <th className="py-2.5 px-4 font-semibold">Atajo</th>
                        <th className="py-2.5 px-4 font-semibold">Herramienta / Acción</th>
                        <th className="py-2.5 px-4 font-semibold">Descripción Operativa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e7dc] text-[#2c1a0e]">
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">V</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Seleccionar</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Toca nodos para inspeccionarlos o abrir su menú contextual.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">M</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Mover</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Arrastra vectores libremente; los ancla y genera el rastro guía.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">B</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Bézier Spline</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Despliega manetas tangentes para moldear círculos plásticamente.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">A</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Anotar</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Toca un punto para crear una nota explicativa que viaje con él.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Doble Clic</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Fijar / Liberar Anclaje</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Alterna la propiedad de anclaje (pin) en el nodo tocado.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Rueda de Ratón</kbd></td>
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
                        <td className="py-2.5 px-4 font-medium">Alternar Manual</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Abre o cierra esta ventana de documentación completa.</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4"><kbd className="font-mono bg-[#ede5db] px-2 py-1 rounded border border-[#dfd2c4] font-semibold">Esc</kbd></td>
                        <td className="py-2.5 px-4 font-medium">Cerrar Ventanas</td>
                        <td className="py-2.5 px-4 text-[#5e4634]">Cierra la documentación, filtros o cualquier menú emergente activo.</td>
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
            className="px-4 py-1.5 rounded-lg bg-[#2c1a0e] text-white hover:bg-[#1a0f07] transition-colors font-medium shadow-2xs cursor-pointer"
          >
            Entendido, volver al taller
          </button>
        </footer>
      </div>
    </div>
  );
};
