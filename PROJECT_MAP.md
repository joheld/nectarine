# PROJECT_MAP.md — Nectarine Studio (Taller de Datos & Arte Vectorial para macOS)

> Arquitectura de software, grafo de versiones y flujo reactivo para Nectarine: la estación de trabajo nativa de macOS con estética cálida de taller editorial (tonos néctar, melocotón y crema marfil), icono esculpido de fruta fresca y analítica local en memoria con DuckDB-WASM y D3.

---

## 1. Grafo de Versiones Git

```mermaid
gitGraph
    commit id: "init" tag: "v0.1.0"
    commit id: "scaffold-tauri-react"
    commit id: "duckdb-wasm-profiler"
    commit id: "perf-guardrail"
    commit id: "state-stores-ethics"
    commit id: "engine-d3-color"
    commit id: "canvas-semantic-layers"
    commit id: "lasso-tethered-annotations"
    commit id: "export-clean-purge" tag: "v1.0.0"
    commit id: "rebrand-cinnamon-artisanal" tag: "v1.2.0"
    commit id: "rebrand-nectarine-ux-deslop" tag: "v1.3.0"
    commit id: "docs-center-visual-diagrams" tag: "v1.4.0"
    commit id: "docs-masterclass-single-entrypoint" tag: "v1.5.0"
    commit id: "docs-9-of-9-geometries-complete" tag: "v1.6.0"
    commit id: "purge-samples-dynamic-grouping-deslop" tag: "v1.7.0"
    commit id: "fix-macos-launchers-nectarine" tag: "v1.8.0"
    commit id: "fix-tools-hand-drag-annotate-bezier" tag: "v1.9.0"
    commit id: "feat-multi-column-filtering" tag: "v2.0.0"
    commit id: "fix-tools-separation-and-closed-bezier" tag: "v2.1.0"
    commit id: "feat-live-hot-reload-glyphs-textures-figma-clipboard" tag: "v3.0.0"
    commit id: "feat-vertical-toolbox-palette" tag: "v3.1.0"
    commit id: "feat-pro-visual-architecture-redesign" tag: "v3.2.0"
    commit id: "feat-demo-datasets-hover-tooltips-undo-redo" tag: "v3.3.0"
```

---

## 2. Tabla de Checkpoints y Estado del Sistema

| Checkpoint | Módulo / Fase | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **CP-00** | Andamiaje Base | `git init`, `PROJECT_MAP.md`, `BITACORA.md`, asignación de puerto dedicado (5220). | **Completado** |
| **CP-01** | Fase 1: Tauri + React + macOS HIG | Tauri v2, React 19, TypeScript, Tailwind CSS con tokens nativos de macOS y diseño Human Premium (`unslop`). | **Completado** |
| **CP-02** | Fase 1: Motor DuckDB-WASM | Ingestión local en memoria para CSV, JSON y Parquet sin dependencias externas (`/public/duckdb/`). | **Completado** |
| **CP-03** | Fase 1: Asistente Estructural & Guardarraíl | Profiler de columnas, gráficos compatibles iluminados, incompatibles deshabilitados y guardarraíl >10k nodos SVG. | **Completado** |
| **CP-04** | Fase 2: Zustand Stores (`dataStore` & `mutationStore`) | Separación estricta de coordenadas empíricas algorítmicas y mutaciones artísticas. | **Completado** |
| **CP-05** | Fase 2: Ética Vectorial & Fantasmas | Anclaje (`pinned`), rastros fantasma hacia coordenadas matemáticas y monitor de distorsión empírica (`Δ %`). | **Completado** |
| **CP-06** | Fase 3: Engine D3 Desacoplado & Color | D3.js en `src/engine/` para física/escalas sin tocar el DOM. Paletas editoriales y modos de fusión SVG. | **Completado** |
| **CP-07** | Fase 4: Lienzo Híbrido & Capas Semánticas | Canvas interactivo SVG con zoom/pan, capas semánticas por dimensiones de datos y lazo contextual. | **Completado** |
| **CP-08** | Fase 4: Anotaciones Atadas | Callouts, flechas y texto en trayectoria anclados al `node_id` que viajan con los datos. | **Completado** |
| **CP-09** | Fase 5: Purga DOM & Exportación SVG | Limpieza estricta de gizmos/fantasmas en `exportService.ts` y guardado nativo con Tauri Dialog/FS. | **Completado** |
| **CP-10** | Verificación Zero-Defect | Batería en 5 frentes: typecheck (0 errores), tests (19/19 pasados), build de producción y socket liveness (HTTP 200 en puerto 5220). | **Completado** |
| **CP-11** | Lanzadores de Escritorio macOS | Accesos directos creados: `Nectarine.app` y `Nectarine.command` en el Escritorio con resolución portable de paths y socket liveness. | **Completado** |
| **CP-12** | Rediseño Ergonómico Accesible | Barra de inicio rápido con carga de datos en 1 clic y panel inspector lateral amigable para editar puntos. | **Completado** |
| **CP-13** | Rebranding a Cinnamon & Logo Botánico | Renombrado a Cinnamon, generación de quills e icono `.icns`. | **Completado** |
| **CP-14** | Auditoría Estética Radical & Limpieza de Capas | Eliminación del contraste Frankenstein y estandarización a diseño cálido marfil. | **Completado** |
| **CP-15** | Rediseño de Iconografía de Alta Gama | Reemplazo del logo por renderizado 3D de alta fidelidad. | **Completado** |
| **CP-16** | Expansión Visual Cinnamon: Radial, Espiral, Celestial & Resplandor SVG | Cuerdas radiales, espirales áureas, cartas celestiales y filtros de luz `<feGaussianBlur>`. | **Completado** |
| **CP-17** | Rebranding a Nectarine, Desahogo UX/UI & Iconografía Esculpida | Renombrado oficial a **Nectarine** (`com.nectarine.studio`), icono 3D de fruta fresca, purga de 'DuckDB Local' y 'Atelier Gráfico & Analítico', barra aireada con etiquetas contextuales y paleta *Nectarine & Melocotón*. | **Completado** |
| **CP-18** | Centro de Documentación Integral & Diagramas Visuales Paso a Paso | Módulo `DocumentationModal.tsx` de 7 capítulos con explicaciones en lenguaje claro, capturas esquemáticas vectoriales incrustadas, acceso inicial y atajo `<kbd>?</kbd>`. | **Completado** |
| **CP-19** | Unificación de Acceso al Manual & Expansión Enciclopédica Masterclass | Eliminación del botón duplicado en `Toolbar.tsx` liberando espacio horizontal. Expansión exhaustiva de `DocumentationModal.tsx` a 9 capítulos profundos. | **Completado** |
| **CP-20** | Desglose Individual Íntegro de las 9 de 9 Geometrías Maestras | Separación rigurosa de las 9 geometrías en 9 fichas individuales independientes numeradas del 1 al 9 (Dispersión, Burbujas, Barras, Voronoi, Red de Fuerza, Ondas, Cuerdas Radiales, Espiral Áurea, Mapa Celestial), cada una con su propia miniatura SVG vectorial, fundamento matemático, directrices de 'Ideal para' y 'Evitar cuando', más selector interactivo por categoría (Todas, Cartesianas, Redes, Visual Cinnamon). | **Completado** |
| **CP-21** | Purga de Datos Muestra, Lienzo con Dropzone & Agrupación Dinámica Multicolumna | Eliminación radical de muestras precargadas (`paises_y_desarrollo.csv` y `ventas_tecnologia.csv`). El lienzo arranca limpio con tarjeta interactiva de soltar archivos (drag & drop). En el panel de Capas Semánticas se implementó selector de columna primaria y sub-agrupación secundaria jerárquica con recálculo en tiempo real. Erradicación completa de clases oscuras en `DataProfilerModal`, `DataLasso` y `App`. | **Completado** |
| **CP-22** | Resiliencia de Lanzadores macOS & Firma de Código | Corrección de firma de código rota (`a sealed resource is missing or invalid`), desacople total de Terminal en `Nectarine.app`, invocación asíncrona de `launch-desktop.sh`, apertura garantizada de UI en navegador, recuperación de puerto 5220 ante procesos colgados y actualización de `Nectarine.command`. | **Completado** |
| **CP-23** | Reparación Integral de Herramientas & Purga de Anotación Ficticia | Herramienta de Mano (`pan`) añadida para encuadre del lienzo, arrastre de nodos con compensación de escala por zoom 1:1, manetas Bézier con cálculo relativo libre de saltos a infinito, creación interactiva de anotaciones al hacer clic sobre cualquier nodo, botón de eliminación rápida (`×`) en tarjetas y erradicación definitiva del comentario precargado de PIB/esperanza de vida. | **Completado** |
| **CP-24** | Filtrado Multicolumna Compuesto (Multi-Condition Engine) | Sistema dinámico de filtrado multi-regla con soporte para múltiples columnas simultáneas, conjunción lógica conmutable (Y / O), operadores extendidos (`>`, `<`, `>=`, `<=`, `=`, `!=`, `contiene`), contador de filas en tiempo real con telemetría visual, persistencia en `dataStore` y badge numérico en botón de filtros. | **Completado** |
| **CP-25** | Separación Estricta de Herramientas Selección/Mover, Marquee Box & Deformación Bézier Orgánica Cerrada | Separación conceptual y de eventos entre Selección (`select`, selección individual o múltiple elástica rectangular en fondo) y Mover (`move`, arrastre 1:1 con zoom compensado de nodo o selección múltiple). Rediseño del motor Bézier a curvas orgánicas cerradas continuas (sin cortes planos) con dos manetas tangentes rotuladas (`Curva 1` y `Curva 2`), áreas táctiles de 15px, botón de reseteo (`↺`), atajos contextuales y banner flotante de asistencia en lienzo. | **Completado** |
| **CP-26** | Vanguardia de Taller: Reconciliación en Caliente, Glifos Morfológicos, Texturas de Imprenta & Copiar a Figma (<kbd>⌘C</kbd>) | Motor de reconciliación determinista `reconciler.ts` que permite soltar un CSV/JSON actualizado preservando todas las mutaciones artísticas y notas de entidades previas por clave primaria. Estudio de Glifos Morfológicos (`glyphMath.ts`: Círculo, Pétalo, Estrella, Rombo, Semilla). Texturas analógicas de taller editorial (`textureService.ts`: Grano Risográfico, Trama Halftone, Papel de Algodón). Copia directa a Figma/Illustrator con <kbd>⌘C</kbd> y botón en barra. | **Completado** |
| **CP-27** | Paleta Vertical Clásica & Barra Superior Desahogada | Implementación de `VerticalToolbox.tsx` como tira vertical delgada (48px) fija a la izquierda del lienzo (estilo Illustrator / Photoshop) con las 5 herramientas (`select` [V], `move` [M], `bezier` [B], `annotate` [A], `pan` [H]) y botón de reseteo (`↺`). Desahogo total de la barra superior: los 9 gráficos permanecen accesibles en 1 clic directo en el control segmentado central sin menús ocultos, archivo/filtros a la izquierda y estilos/exportación a la derecha. | **Completado** |
| **CP-28** | Auditoría Visual Forense (Visión Computacional) & Rediseño Pro | Inspección empírica de capturas PNG con Playwright: resolución del desbordamiento horizontal en la barra superior (erradicación de selects anchos, visibilidad 100% de 'Copiar a Figma' y 'Exportar SVG'), reubicación ergonómica de la tira de herramientas en el extremo exterior izquierdo (48px), dimensionamiento simétrico de Capas (256px) e implementación del Inspector Permanente Dual (`NodeInspector.tsx`: 'Estudio & Estilo' con swatches de color y controles táctiles cuando no hay selección, e 'Inspector de Vector' cuando se selecciona un elemento). | **Completado** |
| **CP-29** | Blindaje para Evaluadores de Élite: Demos 1-Clic, Tooltips Hover & Pila Undo/Redo (<kbd>⌘Z</kbd>) | Erradicación total de las 3 fuentes de fricción: 1) Dos datasets de demostración curados listos para cargar en 1 clic ('Desarrollo Humano' y 'Cosmos & Exoplanetas') en la tarjeta de lienzo vacío para desbloquear y probar las 9 geometrías en 2 segundos. 2) Tooltip visual de precisión al posar el cursor (`CanvasNode.tsx`) con nombre, categoría y métricas tabulares. 3) Pila reactiva de Deshacer/Rehacer (<kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd>) en `mutationStore.ts` para revertir posiciones, colores, escalas y manetas Bézier. | **Completado** |

---

## 3. Arquitectura del Flujo Reactivo de Datos

```mermaid
flowchart TD
    subgraph Ingestion ["1. Ingestión Local (DuckDB-WASM)"]
        F1["Archivos Locales (.csv, .json, .parquet)"] -->|File Reader / Buffer| DDB[("DuckDB WASM Engine")]
        DDB -->|SQL Zero-Copy Query| DPROF["Structural Profiler & Guardrail"]
    end

    subgraph ReactiveState ["2. Estado Dual & Guardián Ético (Zustand)"]
        DPROF -->|Datos Normalizados + Tipos| DS[("dataStore.ts<br/>(Datos Empíricos & Base Math)")]
        MS[("mutationStore.ts<br/>(Color, Bézier, Posición Manual)")]
        
        DS & MS --> DM["Distortion Monitor<br/>(Cálculo de Desviación % vs Real)"]
        DS & MS --> GH["Ghost Tracer<br/>(Proyección de Rastros Fantasma)"]
    end

    subgraph MathEngine ["3. Motor Matemático Desacoplado (src/engine)"]
        DS -->|Dimensiones & Métricas| D3E["D3 Math Engine<br/>(Scales, Voronoi, Forces, Bézier Curves)"]
        D3E -->|Coordenadas Puras| CANVAS
    end

    subgraph RenderingCanvas ["4. Lienzo Híbrido (React + SVG)"]
        CANVAS["Nectarine Interactive Canvas"]
        MS -->|Sobreescrituras Artísticas| CANVAS
        DM -->|Badges de Distorsión| CANVAS
        GH -->|Rastros Fantasma| CANVAS
        SL["Semantic Layers Panel<br/>(Agrupación por Categorías/Cuartiles)"] <--> CANVAS
        DL["Data Lasso & Batch Selector"] <--> CANVAS
        TA["Tethered Annotations (viajan con node_id)"] <--> CANVAS
        DOCS["Documentation Center & Manual<br/>(7 Capítulos + Capturas Vectoriales)"] <--> CANVAS
    end

    subgraph ExportPipeline ["5. Purga y Exportación Nativa"]
        CANVAS -->|Árbol SVG Sucio| PURGE["exportService.ts<br/>(Purga de Gizmos, Pines, Badges)"]
        PURGE -->|SVG Puro Estándar| TAURI_FS["Tauri FS / Dialog Native API"]
        TAURI_FS -->|Escribe a Disco| DISK["Archivo Vectorial .svg Limpio"]
    end
```

---

## 4. Estado de la Sesión

- **Estado Actual**: Nectarine Studio queda completamente blindado para evaluación por visualizadores de datos de élite. Implementados: 1) Carga de datasets demo en 1 solo clic en la pantalla de bienvenida (Países y Exoplanetas), 2) Tooltips visuales obsidian/terracotta al pasar el cursor (hover) sobre cualquier nodo, y 3) Pila completa de Deshacer/Rehacer con atajos universales de macOS (<kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd>). 36/36 tests unitarios aprobados, compilación limpia en 2.23s y HTTP 200 en puerto 5220.
- **Siguiente Paso**: Commit atómico y entrega explicativa al usuario con guía de compartición.
