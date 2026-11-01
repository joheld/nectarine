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

### Brechas de Diseño Detectadas y Soluciones
- *Brecha*: Sobrecarga del DOM si se intentan dibujar más de 10,000 elementos SVG interactivos.
  *Solución*: Se diseñará un interceptor de rendimiento en el profiling de DuckDB que calculará el recuento proyectado de nodos; si excede 10,000, activará de forma no bloqueante sugerencias de agregación previa o una vista muestreada/simplificada.
- *Brecha*: Desacoplamiento de D3 y React. Si D3 manipula directamente el árbol DOM mediante `d3.select().append()`, colisiona con el ciclo de reconciliación de React.
  *Solución*: D3 se confinará estrictamente a funciones puras de cálculo en `src/engine/` (escalas lineales, de logaritmo y de banda, curvas `d3.link`, `d3.line`, generadores de Bézier, simulaciones de fuerza y diagramas de Voronoi), mientras que React renderiza los elementos `<path>`, `<circle>`, `<g>` de manera declarativa y reactiva.
