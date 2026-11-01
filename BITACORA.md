# BITACORA.md — Vectura Studio

## Entrada 001 — Inicialización del Proyecto y Definición Arquitectónica
- **Fecha y Hora**: 2026-11-01
- **Fase**: Andamiaje y Datos (Inicialización)
- **Arquitecto**: Antigravity Principal Software Architect

### Contexto y Visión
Se concibe **Vectura** como un atelier de diseño y analítica nativo para macOS. A diferencia de las herramientas de Business Intelligence tradicionales (que producen gráficos rígidos y utilitarios) o de software de diseño vectorial como Illustrator/Figma (donde los gráficos pierden todo vínculo con la verdad matemática de los datos subyacentes), Vectura implementa una **arquitectura híbrida**:
1. El dato empírico vive en **DuckDB-WASM** en la memoria local del usuario (sin subir datos a la nube).
2. La geometría se genera algorítmicamente mediante **D3.js** estrictamente como motor matemático desacoplado de la manipulación del DOM.
3. El usuario puede seleccionar, retocar, transformar y curvar vectores artísticamente con manetas Bézier, pero un **Guardián Ético y Monitor de Distorsión** rastrea en tiempo real cuánto se aleja la representación visual del dato empírico real, proyectando un rastro fantasma traslúcido (*ghost line*) entre el vector mutado y su coordenada matemática original.
4. La exportación final purga automáticamente todos los artefactos de la interfaz de usuario para entregar un archivo SVG puro, estándar y escalable listo para editorial o imprenta.

### Decisiones Técnicas Fundamentales
1. **Control de Versiones y Protocolo Zero-Port-Collision**:
   - Repositorio Git inicializado en `/Users/joe/vectura` en la rama `main`.
   - Se auditaron los puertos en uso en la máquina (5173, 5190, 5195, 5200 ocupados). Se asigna y reserva estrictamente el puerto `5220` con `strictPort: true` y enlace local `127.0.0.1`.
2. **Framework y Runtime**:
   - Frontend: React 19 + TypeScript + Vite.
   - Desktop Harness: Tauri v2 con permisos para File System y Native Dialogs.
   - Procesamiento Analítico: `@duckdb/duckdb-wasm` para ingestión de CSV, JSON y Parquet.
   - Gestión de Estado: Zustand dividido en `dataStore.ts` (datos empíricos inmutables) y `mutationStore.ts` (mutaciones y anclajes manuales).
   - Estilizado: Tailwind CSS con arquetipo de diseño *Technical Precision / macOS Human Premium* (tipografía SF Pro, rim-light subpíxel, barras de título translúcidas estilo macOS con botones de semáforo nativo, controles segmentados y combinaciones de teclas `<kbd>`).

---

## Entrada 002 — Implementación Integral de las 5 Fases y Verificación Zero-Defect
- **Fecha y Hora**: 2026-11-01
- **Fase**: Fase 1 a Fase 5 (Completadas)
- **Arquitecto**: Antigravity Principal Software Architect

### 1. Fase 1: Andamiaje, Datos y Guardarraíl
- **DuckDB-WASM**: Se copiaron los archivos binarios `duckdb-eh.wasm`, `duckdb-browser-eh.worker.js`, etc. a `public/duckdb/` para garantizar funcionamiento 100% offline y desacoplado de CDN. Se implementó ingestión nativa en memoria para CSV, JSON y buffers binarios de Parquet (`duckdbService.ts`).
- **Asistente de Estructura**: `profiler.ts` analiza tipos, valores nulos, cardinalidad, rangos numéricos y evalúa la idoneidad para 6 tipologías gráficas (Dispersión, Burbujas, Barras Categóricas, Telas de Voronoi, Fuerzas Físicas y Streamgraph). Los compatibles se iluminan en la barra de herramientas; los incompatibles se atenúan con tooltip explicativo.
- **Transformaciones Visuales sin SQL**: Soporte para filtros por umbral (`>`, `<`, `=`, `!=`), agrupaciones categóricas con agregación (`mean`, `sum`, `count`, `max`, `min`) y extracción de Top N.
- **Guardarraíl de Rendimiento**: Interceptor de umbral que detecta consultas con más de 10,000 nodos proyectados, activando un diálogo modal no bloqueante con sugerencias de agregación o muestreo inteligente LTTB.

### 2. Fase 2: Estado, Ética y Monitor de Distorsión
- **Separación de Almacenes**:
  - `dataStore.ts`: Guarda el dataset normalizado y las coordenadas base generadas puramente por la matemática.
  - `mutationStore.ts`: Indexa mutaciones manuales por `node_id` (posición `customX, customY`, manetas de control Bézier `cp1x, cp1y, cp2x, cp2y`, color de relleno y escala).
- **Anclaje y Fantasmas**: Propiedad `isPinned`. Cuando los datos cambian o se filtran, los nodos anclados conservan su posición artística; simultáneamente se proyecta un rastro punteado translúcido (*ghost trace*) hacia la coordenada matemática calculada junto con un nodo fantasma hueco.
- **Monitor de Distorsión**: Calcula en tiempo real la desviación porcentual `Δ %` cuando el usuario escala o desplaza un nodo. Si la distorsión supera el umbral ético (15%), se proyecta una insignia de alerta visual para preservar la honestidad del dato.

### 3. Fase 3: Matemática Desacoplada y Arquitectura Cromática
- **Desacoplamiento Estricto de D3**: D3.js se aisló en `src/engine/` (`scales.ts`, `bezierMath.ts`, `layoutEngine.ts`). Todas las operaciones son puras (cálculo de coordenadas, Delaunay/Voronoi, escalas continuas y simulación física in-memory con 120 ticks); React renderiza el SVG de forma completamente declarativa.
- **Servicio Cromático**: `colorService.ts` incluye 4 paletas editoriales calibradas (*Swiss International*, *Risograph Workshop*, *Cybernetic Slate* y *Monospaced Terminal*) con soporte para modos de fusión vectorial (`multiply`, `screen`, `overlay`) que garantizan transparencias limpias sin enturbiar las capas.

### 4. Fase 4: Lienzo e Interacción
- **Lienzo Híbrido (`Canvas.tsx` / `CanvasNode.tsx`)**: Soporta zoom, encuadre (pan), cuadrícula de precisión subpíxel, ejes métricos y manetas Bézier cúbicas interactivas para deformación orgánica de nodos.
- **Capas Semánticas (`SemanticLayersPanel.tsx`)**: Agrupación jerárquica en carpetas dinámicas por dimensiones categóricas, con controles rápidos de visibilidad (ojo), bloqueo (candado) y sobrescritura de color de capa.
- **Lazo de Datos (`DataLasso.tsx`)**: Menú contextual con selección en bloque de nodos por categoría, rango métrico o color.
- **Anotaciones Atadas (`TetheredAnnotations.tsx`)**: Etiquetas con flechas arqueadas vinculadas directamente al identificador del nodo (`targetNodeId`). Al mover el nodo o recalcular los datos, la flecha y el rótulo recalculan su trayectoria dinámica.

### 5. Fase 5: Purga DOM y Exportación
- **Rutina de Limpieza (`exportService.ts`)**: Clona en memoria el árbol SVG activo y purga selectivamente todas las clases de UI editor (`.editor-gizmo`, `.selection-ring`, `.ghost-trace`, `.anchor-pin`, `.distortion-badge`, `.bezier-handle`). Inyecta encabezados XML limpios, dimensiones `viewBox` explícitas y preserva únicamente la geometría y las anotaciones editoriales.
- **Escritura Nativa**: Enlace con `@tauri-apps/plugin-dialog` y `@tauri-apps/plugin-fs` para guardar directamente en el sistema de archivos de macOS, con fallback automático a descarga web.

### 6. Batería Zero-Defect y Validación
- **Tipado Estricto**: `tsc -b` completado con 0 errores.
- **Build de Producción**: `vite build` compiló en 2.21s generando `dist/assets/index-*.js` y `dist/assets/index-*.css`.
- **Cargo Rust Backend**: `cargo check` en `src-tauri` completado exitosamente en 4.58s con compatibilidad nativa para macOS overlay titlebar y plugins Tauri v2 (`fs` y `dialog`).
- **Pruebas Automatizadas**: 15 tests pasados (100%) en `tests/profiler.test.ts`, `tests/engine.test.ts`, `tests/stateAndEthics.test.ts` y `tests/exportService.test.ts`.
- **Liveness Gate**: Socket HTTP en `127.0.0.1:5220` activo y respondiendo con `HTTP/1.1 200 OK` y cabeceras de aislamiento WebAssembly (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`).
