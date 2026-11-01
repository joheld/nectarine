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


---

## Entrada 003 — Creación de Accesos Directos de Escritorio macOS
- **Fecha y Hora**: 2026-11-01
- **Fase**: Despliegue y Ergonomía del Sistema
- **Arquitecto**: Antigravity Principal Software Architect

### Acciones Realizadas
1. **Scripts de Lanzamiento Desacoplados**:
   - `run.sh`: Detecta el intérprete de Bun de forma dinámica, verifica la disponibilidad del puerto `5220`, lanza el servidor en segundo plano desacoplado de `stdin` mediante `</dev/null` con `nohup` y sondea el socket hasta validar respuesta `HTTP 200`.
   - `launch-desktop.sh`: Valida si el servicio ya responde en `http://127.0.0.1:5220`; de lo contrario invoca `run.sh`, abre la URL en el navegador nativo y envía una notificación del sistema mediante `osascript`.
2. **Accesos Directos en el Escritorio**:
   - `Vectura Studio.app` (`/Users/joe/Desktop/Vectura Studio.app`): Applet nativo de macOS compilado con `osacompile` que incluye el icono de alta resolución `icon.icns` y firma de código.
   - `Vectura Studio.command` (`/Users/joe/Desktop/Vectura Studio.command`): Script ejecutable para terminal con permisos `+x`.
3. **Portabilidad Multi-Máquina**: Cero rutas absolutas estáticas (`$HOME` dinámico).


---

## Entrada 004 — Rebranding a Lienzo, Modo Claro por Defecto y Ergonomía Accesible
- **Fecha y Hora**: 2026-11-01
- **Fase**: Experiencia de Usuario & Rebranding
- **Arquitecto**: Antigravity Principal Software Architect

### Cambios Implementados en Respuesta al Feedback
1. **Nuevo Nombre ("Lienzo")**:
   - Se sustituye el nombre por **Lienzo** (*Taller de Datos & Arte Vectorial*), un nombre en español, cálido, poético y directamente asociado a la creatividad y al diseño artesanal.
   - Accesos directos de escritorio regenerados: `Lienzo Studio.app` y `Lienzo Studio.command`.
2. **Tema Claro Nativo por Defecto**:
   - Se reestructuraron las variables de diseño de Tailwind CSS en `app.css` y `tailwind.config.js`. El tema claro es ahora el predeterminado con fondo perla `#f5f6f8`, lienzo estilo papel `#fafbfc`, bordes sutiles y tipografía con contraste descansado.
   - Se integró un conmutador instantáneo Sol/Luna en la barra de título para alternar entre modo claro y oscuro cuando el usuario lo desee.
3. **Ergonomía para Principiantes**:
   - **Barra de Inicio Rápido (`QuickStartBar.tsx`)**: Permite con un solo clic cargar datasets demostrativos precargados ("Países y Economía" o "Ventas de Tecnología"), sin obligar al usuario a tener archivos Parquet/CSV listos.
   - **Inspector Lateral de Puntos (`NodeInspector.tsx`)**: Al hacer clic en cualquier punto del lienzo, se abre un panel lateral amigable que muestra los valores en lenguaje natural, permite cambiar el color con paletas circulares de 1 clic, ajustar el tamaño con un deslizador y regresar el punto a su coordenada exacta con un solo botón ("Regresar a su posición exacta").
   - **Terminología Simplificada**: Se reemplazó la jerga técnica por explicaciones cotidianas ("Grupos de Datos", "Puntos", "Rastro guía al origen").


---

## Entrada 005 — Rebranding a Cinnamon, Purga Total de Oscuridad e Icono Botánico
- **Fecha y Hora**: 2026-11-01
- **Fase**: Identidad de Marca & Purga Estética Coherente
- **Arquitecto**: Antigravity Principal Software Architect

### Modificaciones en Respuesta al Feedback
1. **Rebranding Definitivo a "Cinnamon"**:
   - Se renombró la aplicación a **Cinnamon** (*Atelier de Datos & Arte*), con identificador `com.cinnamon.atelier` en Tauri v2, `package.json` y `Cargo.toml`.
   - Se crearon los lanzadores de escritorio: `/Users/joe/Desktop/Cinnamon.app` y `/Users/joe/Desktop/Cinnamon.command`.
2. **Icono Artesanal de Ramita de Canela**:
   - Se programó un generador gráfico con Python Pillow para renderizar dos ramas de canela entrelazadas en espiral con listón de rafia y hoja aromática verde.
   - Se generaron los archivos para macOS: `icon.icns`, `icon.png`, `128x128.png`, `32x32.png` y el SVG vectorial `cinnamon-logo.svg` embebido en la barra de título nativa.
3. **Purga Integral de Elementos Oscuros**:
   - Se eliminaron todos los fondos negros y modales sombríos. La paleta es ahora 100% cálida y luminosa:
     - Fondo principal: Crema vainilla `#faf7f2`.
     - Lienzo de dibujo: Papel suave `#fffdf9` con trama de puntos sutiles `#e5dacd`.
     - Controles y tarjetas: Blanco cálido `#ffffff` con bordes suaves `#e8ded4`.
     - Acentos interactivos: Ámbar canela tostada `#c2410c` y `#ea580c`.
   - Modales (Guardarraíl, Filtros, Inspector) rediseñados con fondos translúcidos amables y tarjetas claras.


---

## Entrada 006 — Auditoría Estética Radical & Des-Frankensteinización Visual
- **Fecha y Hora**: 2026-11-01
- **Fase**: Pulido Estético & Arquitectura Visual
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico Crítico (En respuesta a la captura del usuario)
El usuario presentó una captura de pantalla demostrando un fallo estético innegable:
1. **Contraste esquizofrénico (Frankenstein visual)**: La barra superior y la barra de herramientas se renderizaban con fondo negro carbón (`#09090b`), chocando agresivamente con un lienzo blanco y tarjetas de capas blancas con bordes duros.
2. **Colapso de la jerarquía semántica**: 30 carpetas de capas para 30 registros, porque el selector elegía la columna de clave primaria (`pais`) en vez de la dimensión categórica real (`region`).
3. **Volcado de datos crudos (Anti-diseño)**: Las tarjetas mostraban cadenas sin formato como `Suiza [87500.0, 83.8] 83.8`, destruyendo la sensación de un producto artesanal refinado.

### Resoluciones Aplicadas
1. **Unificación Cromática 100% Cálida & Libre de Negro**:
   - `TitleBar.tsx`: Fondo crema marfil `#f8f5ee`, borde `#e6dcce`, insignia de DuckDB en menta suave y tipografía en chocolate tostado `#2c1a0e`.
   - `Toolbar.tsx`: Fondo crema marfil, selectores segmentados en `#ede5db`, botón de exportación en acento canela `#b44b10`. Cero fondos negros.
   - `Canvas.tsx`: Fondo de papel de archivo `#fffdf9` con retícula de puntos sutiles `#e5dacd` y ejes en piedra cálida `#78716c`.
2. **Heurística de Categorización Inteligente**:
   - `profiler.ts` ahora prioriza columnas de baja a moderada cardinalidad (entre 2 y el 70% del total de filas). En el dataset de prueba, agrupa por `region` produciendo exactamente 5 categorías limpias y coherentes ("Europa Occidental", "Asia Oriental", etc.) en lugar de 30.
3. **Formateo Humano de Nombres**:
   - Se eliminaron todos los arreglos crudos y corchetes `[...]`. Las etiquetas muestran limpiamente el nombre de la entidad (`Suiza`, `Noruega`) y sus subítems están colapsados por defecto para una vista zen y organizada.
4. **Verificación Zero-Defect**:
   - 15/15 tests automatizados pasando en Bun.
   - `tsc -b` con 0 errores y compilación limpia con Vite.
   - `cargo check` en `src-tauri` finalizado con éxito.


---

## Entrada 007 — Rediseño de Iconografía de Alta Gama & Compilación con `iconutil`
- **Fecha y Hora**: 2026-11-01
- **Fase**: Identidad Visual & Diseño de Producto
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico Crítico (En respuesta al feedback del icono)
El usuario criticó con razón el icono previo: un dibujo vectorial geométrico tosco encerrado en un círculo con trazo naranja que, escalado a 20px en la barra de título, parecía una mancha marrón sucia y fuera de lugar con respecto a una aplicación profesional para macOS.

### Resoluciones Aplicadas
1. **Icono Nativo de macOS en Squircle 3D de Alta Fidelidad**:
   - Se diseñó un icono de aplicación con lenguaje visual de macOS Sonoma/Big Sur: baldosín squircle en papel de archivo marfil con bisel subpíxel, sombra ambiental y renderizado 3D de quills de canela de Ceilán enrollados con hilo natural en tonos terracota y ámbar cálido.
   - Procesamiento con máscara de transparencia suave y compilación del conjunto completo `.iconset` con `/usr/bin/iconutil` para generar el archivo maestro `src-tauri/icons/icon.icns` (16x16 hasta 512x512@2x).
   - Actualización del bundle del escritorio `/Users/joe/Desktop/Cinnamon.app` con el nuevo `.icns`.
2. **Logo en Barra de Título**:
   - `CinnamonLogo.tsx` ahora renderiza el squircle oficial de la app con esquinas redondeadas continuas (`rounded-[4.5px]`), sombra sutil y borde subpíxel, idéntico a los iconos proxy de documentos en macOS (Pages, Keynote, Pixelmator).
3. **Glifo Vectorial SVG Puro Rehecho**:
   - Se rediseñó `public/cinnamon-logo.svg` y la variante vectorial de `CinnamonLogo.tsx` eliminando el tosco círculo exterior y dibujando curvas de Bézier fluidas con espirales concéntricas de corteza de canela y amarre de rafia.
4. **Verificación Zero-Defect**:
   - 15/15 tests automatizados pasando en Bun.
   - `tsc -b` con 0 errores y compilación limpia con Vite.
   - `cargo check` en `src-tauri` finalizado con éxito.


---

## Entrada 008 — Expansión a Visual Cinnamon: Geometrías Radiales, Espiral, Celestial & Resplandor SVG
- **Fecha y Hora**: 2026-11-01
- **Fase**: Motor Geométrico Artístico & Estética de Luz (Nadieh Bremer Standard)
- **Arquitecto**: Antigravity Principal Software Architect

### Motivación & Filosofía
El usuario solicitó capacitar a **Cinnamon** para crear proyectos de la complejidad y belleza visual del portafolio de *Visual Cinnamon* (Nadieh Bremer, coautora de *Data Sketches*). El trabajo de Nadieh se caracteriza por abandonar los ejes cartesianos rectangulares en favor de geometrías no-euclidianas (radiales, espirales, celestiales), cintas fluidas con grosor variable, rotulación que abraza curvas orbitales y atmósferas de luz con filtros SVG.

### Resoluciones & Nuevas Capacidades Implementadas
1. **Diagramas Circulares de Cuerdas (`chord`)**:
   - Algoritmo de distribución radial trigonométrica sobre circunferencia de radio controlado.
   - Cintas fluidas Bézier que conectan entidades de la misma categoría o relación con tracción central (`Q cpx cpy`).
   - Rotulación circular con `<textPath>` que sigue arcos exteriores concéntricos, permitiendo que los nombres de categorías dancen sobre el perímetro de la ilustración.
2. **Espirales Áureas de Arquímedes (`spiral`)**:
   - Función paramétrica `r(θ) = minR + t * (maxR - minR)` trazando 2.8 ciclos de evolución temporal o métrica.
   - Generación analítica de la pista vectorial continua y anillos guía concéntricos (33%, 66%, 100% cúspide).
3. **Mapas Astronómicos Celestiales (`celestial`)**:
   - 3 órbitas elípticas inclinadas (`rx, ry, rotation`) con estilización de mapa estelar histórico.
   - Nodos posicionados como estrellas en las órbitas y enlaces de constelación (*constellation links*) punteados uniendo astros por afinidad de datos.
4. **Filtros SVG de Luz y Resplandor (`#celestial-glow` & `#ribbon-glow`)**:
   - Capa de filtros nativos `<feGaussianBlur stdDeviation="3.6"/>` con `<feMerge>` para conferir a los nodos y cintas un halo estelar luminoso.
   - Conmutador en la barra de herramientas ("Luz & Glow") con persistencia en `mutationStore.ts`.
5. **Paleta "Visual Cinnamon & Cosmos"**:
   - Incorporada en `colorService.ts`: Canela Ceilán (`#c2410c`), Azul Celestial Profundo (`#1e3a8a`), Oro Estelar (`#f59e0b`), Rosa Sakura (`#f43f5e`), Aurora Boreal (`#0d9488`), Amatista Cósmico (`#7c3aed`), con modos de fusión `multiply` y `screen`.
6. **Verificación Zero-Defect**:
   - 19/19 tests automatizados pasando en Bun (incluyendo validación matemática de cuerdas, espirales, órbitas y preservación en `exportService`).
   - `tsc -b` con 0 errores y compilación de producción con Vite superada.
   - `cargo check` en Tauri superado y socket escuchando en `http://127.0.0.1:5220`.


---

## Entrada 009 — Rebranding a Nectarine, Desahogo Visual & Ergonomía Respirable
- **Fecha y Hora**: 2026-11-01
- **Fase**: Identidad de Producto & Ergonomía Espaciosa
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Brechas (En respuesta al feedback del usuario)
1. **Identidad & Branding**: El usuario solicitó el nombre **Nectarine** y una iconografía sumamente cuidada de una nectarina (piel lisa sin vellosidad, degradado de rubí a melocotón dorado, tallo y hoja verde).
2. **Ruido en la Barra de Título**: Se detectó ruido visual redundante ("DuckDB Local" y "Atelier Gráfico & Analítico") que sobrecargaba la percepción.
3. **Agobio Visual en la Barra de Herramientas**: La acumulación de 19 botones y etiquetas de texto en una sola barra horizontal (`h-11`) provocaba agobio visual y falta de aire.
4. **Nombre de la Paleta**: El nombre "Visual Cinnamon & Cosmos" fue rechazado por el usuario.

### Resoluciones Aplicadas
1. **Iconografía Esculpida de Nectarine**:
   - Se diseñó un icono 3D de 1024x1024 de una nectarina jugosa con piel lisa brillante, hendidura orgánica, degradado de rubí a néctar dorado, tallo leñoso y hoja verde sobre squircle de porcelana marfil con bisel subpíxel.
   - Compilación nativa con `/usr/bin/iconutil` generando `icon.icns` para el bundle de escritorio [Nectarine.app](file:///Users/joe/Desktop/Nectarine.app) y el script ejecutable [Nectarine.command](file:///Users/joe/Desktop/Nectarine.command).
   - Glifo vectorial puro [NectarineLogo.tsx](file:///Users/joe/vectura/src/components/NectarineLogo.tsx) y [nectarine-logo.svg](file:///Users/joe/vectura/public/nectarine-logo.svg).
2. **Purga de Ruido en TitleBar**:
   - Se eliminaron por completo las insignias "DuckDB Local" y "Atelier Gráfico & Analítico".
   - La barra de título ahora es sobria y refinada: proxy icon de la nectarina, nombre "Nectarine", separador sutil y el dataset activo con telemetría de nodos en la esquina derecha.
3. **Desahogo Espacial & Ergonomía Respirable**:
   - **Barra de Herramientas (`Toolbar.tsx`)**: Altura aumentada a `h-12` (48px). En el selector de gráficos, ahora se muestran iconos limpios y **únicamente el gráfico seleccionado muestra su etiqueta de texto**, reduciendo el ancho del bloque en más del 50%.
   - Inclusión de divisores verticales sutiles (`h-5 w-px bg-[#e6dcce]`) que separan claramente las acciones de archivo, tipos de gráficos, herramientas de canvas y controles de estilo/exportación.
   - **Panel de Capas (`SemanticLayersPanel.tsx`)**: Ampliado a `w-72` con tarjetas redondeadas (`rounded-lg`), mayor espaciado interno y padding generoso.
   - **Barra de Inicio Rápido (`QuickStartBar.tsx`)**: Degradado suave de néctar rosado y ámbar con espaciado aireado.
4. **Renombrado de Paleta**:
   - Sustituida por **"Nectarine & Melocotón"** en `colorService.ts`, con colores frescos: Rubí Nectarina (`#e11d48`), Melocotón Cálido (`#f97316`), Néctar Dorado (`#f59e0b`), Azul Zafiro (`#1e3a8a`), Menta Fresca (`#0d9488`), Amatista (`#7c3aed`), Grosella (`#be123c`) y Hoja Verde (`#22c55e`).
5. **Verificación Zero-Defect**:
   - 19/19 tests automatizados pasando en Bun.
   - `tsc -b` con 0 errores y compilación limpia con Vite.
   - `cargo check` en `src-tauri` para el nuevo crate `nectarine v0.1.0` superado con éxito.

---

## Entrada 010 — Centro de Documentación Paso a Paso & Des-Vibecodificación con Diagramas Vectoriales
- **Fecha y Hora**: 2026-11-01
- **Fase**: Educación de Usuario, Manual Interactivo & Arquitectura Anti-Slop
- **Arquitecto**: Antigravity Principal Software Architect

### Motivación & Requerimientos del Usuario
El usuario solicitó erradicar cualquier vestigio de "código vibecodificado" (AI slop) y exigió una documentación completa, exhaustiva pero en un lenguaje sumamente comprensible, estructurada paso a paso, accesible desde la interfaz mediante un botón visible, con ejemplos prácticos y capturas visuales para explicar en profundidad cómo sacarle el máximo jugo a la herramienta.

### Resoluciones & Mejoras Técnicas Implementadas
1. **Módulo de Documentación Integral (`DocumentationModal.tsx`)**:
   - Estructurado en 7 capítulos monográficos con navegación lateral:
     * **Capítulo 1: Inicio Rápido**: Flujo de 3 pasos (Ingesta local en RAM -> Geometría D3 -> Edición Bézier y exportación).
     * **Capítulo 2: Catálogo de las 9 Geometrías**: Explicación técnica y conceptual de cuándo utilizar Cuerdas Radiales, Espiral Áurea, Mapa Celestial, Voronoi, Ondas, Dispersión y Burbujas.
     * **Capítulo 3: Edición Plástica & Ética de Datos**: Cómo manipular puntos con manetas de Bézier sin falsear información, cómo opera el anclaje (`pin`), el rastro fantasma proyectado hacia la coordenada matemática original y el monitor de distorsión porcentual ($\Delta\%$).
     * **Capítulo 4: Iluminación, Resplandor & Fusión**: Explicación del filtro SVG compuesto `<feGaussianBlur>` + `<feMerge>` (Glow) y el modo de fusión `multiply` para superposición serigráfica.
     * **Capítulo 5: Capas Semánticas & Anotaciones Atadas**: Agrupaciones automáticas por dimensiones categóricas y callouts vinculados al `node_id` que viajan con los datos.
     * **Capítulo 6: Exportación e Imprenta**: Rutina quirúrgica de purga SVG en `exportService.ts` que elimina gizmos, cajas y pines, entregando un archivo estándar para Illustrator o Figma.
     * **Capítulo 7: Atajos de Teclado**: Hoja de trucos con tabla de atajos rápidos (`V`, `M`, `B`, `A`, `?`, `Esc`, Doble Clic, Rueda de ratón, Alt + Arrastre).
2. **Capturas Esquemáticas Vectoriales Incrustadas (Zero-Pixelation)**:
   - En lugar de capturas rasterizadas pesadas o propensas a romperse, se diseñaron componentes SVG puros integrados directamente en el manual:
     * `PipelineDiagram`: Flujo interactivo de 4 estaciones (DuckDB -> D3 -> Bézier -> Purga).
     * `GeometryCard`: 4 tarjetas visuales con mini-ilustraciones SVG de cuerdas radiales con cintas Bézier, espiral áurea con círculos concéntricos, carta celestial con órbitas y constelaciones, y mosaico/ondas fluidas.
     * `GhostTraceDiagram`: Captura esquemática del principio ético mostrando el dato matemático en azul, la línea guía discontinua, el nodo arrastrado con maneta de Bézier y la insignia de distorsión $\Delta +28\%$.
     * `Annotation Visual Diagram`: Muestra de un nodo vinculado a una tarjeta flotante mediante una flecha arqueada continua.
     * `Before / After Purge Visual`: Comparador visual que contrasta el árbol de trabajo en pantalla (con cajas de selección y tiradores) frente al SVG purgado entregado a disco.
3. **Puntos de Entrada y Ergonomía en la Interfaz**:
   - Botón `[?] Manual` en la barra de título (`TitleBar.tsx`) con insignia de atajo `<kbd>?</kbd>`.
   - Botón `Manual` en la barra de herramientas (`Toolbar.tsx`) con icono `BookOpen`.
   - Enlace `Consultar manual de taller` en la franja de inicio rápido (`QuickStartBar.tsx`).
   - Atajo de teclado global: Presionar <kbd>?</kbd> (Shift + /) abre o cierra el modal instantáneamente. Tecla <kbd>Esc</kbd> cierra el modal.
4. **Verificación Zero-Defect**:
   - `bun test`: 19/19 tests unitarios aprobados en 174ms.
   - `tsc -b`: 0 advertencias y 0 errores de tipado estricto.
   - `vite build`: Build de producción generado en 2.32s.
   - `curl -I http://127.0.0.1:5220`: Servidor activo y respondiendo `HTTP/1.1 200 OK`.

---

## Entrada 011 — Unificación de Acceso al Manual & Expansión Enciclopédica Masterclass
- **Fecha y Hora**: 2026-11-01
- **Fase**: Optimización de Espacio en Toolbar & Documentación Exhaustiva
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Brechas (En respuesta al feedback del usuario)
1. **Desperdicio de Espacio por Botones Duplicados**: Existían dos botones de manual simultáneos: uno en la barra de título (`TitleBar.tsx`) y otro redundante en la barra de herramientas (`Toolbar.tsx`), compitiendo por espacio horizontal crítico.
2. **Profundidad Insuficiente en el Manual**: El manual previo carecía de explicaciones matemáticas profundas, detalles sobre formatos de archivo, preparación de esquemas, física de fuerzas, calibración perceptual de radios y consejos de producción gráfica real para imprenta y Figma.

### Resoluciones Aplicadas
1. **Unificación de Punto de Entrada Único**:
   - Se purgó definitivamente el botón redundante de `Toolbar.tsx` y su prop en `ToolbarProps` y `App.tsx`.
   - Se mantiene un único botón limpio y natural en el ángulo superior derecho de la barra de título (`TitleBar.tsx`): `[?] Manual` con insignia `<kbd>?</kbd>`, accesible también vía atajo global de teclado.
2. **Expansión a 9 Capítulos Monográficos de Alta Densidad Técnica (`DocumentationModal.tsx`)**:
   - **Capítulo 1: Inicio Rápido & Filosofía**: Por qué Nectarine es superior al workflow fragmentado D3 -> Illustrator; flujo en 4 estaciones y tutorial guiado paso a paso con datos de muestra.
   - **Capítulo 2: Ingesta & Motor DuckDB WASM**: Arquitectura 100% local en RAM; diferencias y estructura para CSV (delimitadores, comas decimales), JSON (arrays de objetos) y Parquet (compresión Snappy columnar); clasificación tripartita de columnas (métricas, dimensiones categóricas, variables temporales); y transformaciones sin SQL en el panel de Filtros.
   - **Capítulo 3: Enciclopedia de las 9 Geometrías**: Análisis exhaustivo con fórmulas matemáticas, pros, contras, casos de uso y miniaturas SVG para Cuerdas Radiales (trigonometría polar y `<textPath>`), Espiral Áurea ($r=a+b\theta$), Mapa Celestial (órbitas keplerianas), Voronoi (Delaunay), Red de Fuerza (física de partículas Coulomb/Hooke), Ondas (Streamgraph con baselining central) y Dispersión/Burbujas (corrección perceptual $\sqrt{r}$ de Flannery).
   - **Capítulo 4: Edición & Ética de Datos**: Postulado ético de Tufte y Cairo; anclaje `isPinned`; proyección en tiempo real del rastro fantasma cian (`#0284c7`); cálculo de distorsión $\Delta\%$; y manipulación de manetas tangentes de Bézier.
   - **Capítulo 5: Iluminación & Fusión Serigráfica**: Pipeline de filtros SVG `<feGaussianBlur>` + `<feMerge>` (Glow) y modo `mix-blend-mode: multiply` que emula tinta sobre papel sin ensuciar capas.
   - **Capítulo 6: Capas Semánticas, Lazo & Anotaciones Atadas**: Agrupaciones dimensionales en vez de vectores huérfanos; lazo contextual; y anclaje persistente de callouts al `node.id`.
   - **Capítulo 7: Exportación e Imprenta**: Desglose paso a paso de la purga en `exportService.ts`; preservación de gradientes y textos; y recomendaciones técnicas para Adobe Illustrator, Figma y perfiles CMYK.
   - **Capítulo 8: Rendimiento, Guardarraíl >10k Nodos & FAQ**: Interceptor de sobrecarga en el DOM; modo simplificado; resolución de geometrías incompatibles; y reseteo total de mutaciones.
   - **Capítulo 9: Hoja de Trucos de Teclado**: Tabla de referencia rápida para operar con velocidad (<kbd>V</kbd>, <kbd>M</kbd>, <kbd>B</kbd>, <kbd>A</kbd>, <kbd>?</kbd>, <kbd>Esc</kbd>, Doble clic, Rueda, <kbd>Alt</kbd> + Arrastre).
3. **Verificación Zero-Defect**:
   - `bun test`: 19/19 tests unitarios aprobados en 190ms.
   - `tsc -b`: 0 errores.
   - `vite build`: Build de producción generado en 2.31s.
   - `cargo check`: Crate `nectarine v0.1.0` compilado con éxito.
   - Socket `http://127.0.0.1:5220`: Respondiendo `HTTP/1.1 200 OK`.

---

## Entrada 012 — Desglose Íntegro Individual de las 9 Geometrías Maestras
- **Fecha y Hora**: 2026-11-01
- **Fase**: Rigor Editorial en Documentación & Completitud Exhaustiva
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Brechas (En respuesta al feedback del usuario)
El usuario detectó con precisión que el manual anunciaba "9 geometrías" pero agrupaba varias en una sola ficha (Dispersión, Burbujas y Barras estaban comprimidas en una única tarjeta), resultando en solo 6 o 7 tarjetas visibles y transmitiendo una sensación de incompletitud.

### Resoluciones Aplicadas
1. **Desglose Individual de las 9 de 9 Geometrías (`DocumentationModal.tsx`)**:
   - Se crearon **9 fichas independientes numeradas estrictamente del 1 al 9**, cada una con:
     * **1. Dispersión (Scatter Plot)**: Escalas lineales continuas, correlación de Pearson y detección de patrones bivariados. Miniatura SVG con ejes, puntos y línea de tendencia.
     * **2. Burbujas Multivariables (Bubble Chart)**: Codificación de 3 dimensiones métricas con calibración de área de Flannery ($\sqrt{v}$) para evitar distorsión perceptual. Miniatura SVG con burbujas de radio calibrado y modo multiply.
     * **3. Barras Categóricas (Bar Chart)**: Escala discreta `scaleBand` con padding del 25% para rankings ordinales. Miniatura SVG con 4 barras táctiles redondeadas.
     * **4. Mosaico de Voronoi (Delaunay Tessellation)**: Partición geométrica continua del plano sin huecos ni solapamientos. Miniatura SVG con celdas poligonales contiguas y centroides.
     * **5. Red de Fuerza (Force-Directed Graph)**: Simulación de física de partículas de Coulomb (repulsión electrostática) y Hooke (tensión elástica). Miniatura SVG con nodo central y enlaces articulados.
     * **6. Ondas Continuas (Streamgraph / Waves)**: Cintas orgánicas Bézier apiladas alrededor de un eje central ondulante con baselining *Silhouette*. Miniatura SVG con 3 corrientes sinusoidales.
     * **7. Cuerdas Radiales (Radial Chord Diagrams)**: Geometría polar trigonométrica con cintas Bézier hacia el centro y rotulación perimetral en arco `<textPath>`. Miniatura SVG circular con cintas cruzadas.
     * **8. Espiral Áurea de Arquímedes (Golden Spiral)**: Trayectoria polar paramétrica continua a lo largo de 2.8 ciclos con 3 anillos concéntricos guía (33%, 66%, 100%). Miniatura SVG espiral con esferas crecientes.
     * **9. Mapa Celestial & Astrolabio (Keplerian Constellations)**: 3 planos orbitales elípticos inclinados con estrellas de magnitud lumínica y enlaces de constelación punteados. Miniatura SVG astronómica con elipses keplerianas.
2. **Selector Interactivo por Categoría**:
   - Se incorporó un control segmentado en la cabecera del Capítulo 3: `[Todas (9)]`, `[Cartesianas (3)]`, `[Redes & Partición (3)]` y `[Visual Cinnamon (3)]`, con contador explícito `9 de 9 disponibles`.
3. **Secciones de 'Ideal para' y 'Evitar cuando'**:
   - Cada una de las 9 geometrías incluye ahora directrices claras de cuándo utilizarla y en qué escenarios evitarla para prevenir gráficos ineficaces o saturados.
4. **Verificación Zero-Defect**:
   - `bun test`: 19/19 tests unitarios aprobados en 215ms.
   - `tsc -b`: 0 errores.
   - `vite build`: Build de producción generado en 2.39s.
   - `cargo check`: Superado limpiamente para `nectarine v0.1.0`.
   - Socket `http://127.0.0.1:5220`: Respondiendo `HTTP/1.1 200 OK`.

---

## Entrada 013 — Purga de Datos de Muestra, Lienzo con Dropzone & Agrupación Dinámica Multicolumna
- **Fecha y Hora**: 2026-11-01
- **Fase**: Higiene de Datos, Desacoplamiento & Experiencia de Usuario en Capas
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Brechas (En respuesta al feedback del usuario)
1. **Confusión por Datos Ficticios**: El arranque automático cargando `paises_y_desarrollo.csv` y la presencia de banners de inicio rápido creaban la falsa impresión de que Nectarine estaba hardcodeado para estadísticas socioeconómicas o ventas de gadgets, restando profesionalismo a la aplicación.
2. **Duda sobre Agrupación de Múltiples Columnas**: El usuario señaló con agudeza: *"no entiendo porque los 'grupos' cuando subo un archivo que tiene varias columnas solo toman una de ellas"*. Anteriormente, `dataStore.ts` seleccionaba de forma ciega la primera columna de texto para `mappings.category` y el panel lateral de capas no ofrecía ningún selector ni explicación para que el usuario pudiera conmutar libremente qué columna definía los grupos y el teñido de los nodos.
3. **Residuos de Clases Oscuras**: Modales como `DataProfilerModal` y `DataLasso` conservaban clases `dark:bg-slate-900` incompatibles con el arquetipo cálido marfil de Nectarine.

### Resoluciones Aplicadas
1. **Purga Radical de Datasets de Muestra**:
   - Se eliminó el componente `QuickStartBar.tsx`.
   - Se eliminaron los métodos `loadDefaultDataset` y `loadSalesDataset` en `duckdbService.ts`.
   - `dataStore.ts` arranca ahora en estado inmaculado (`datasetName: ''`, `rawRows: []`, `baseNodes: []`).
   - Se actualizó `TitleBar.tsx` para reflejar con elegancia "Sin archivo cargado" y telemetría en "Listo".
2. **Lienzo Limpio con Zona Interactiva de Ingestión (Dropzone)**:
   - Al abrir la aplicación sin archivo, el lienzo exhibe una tarjeta de taller con el logotipo esculpido de Nectarine, invitando al usuario a arrastrar y soltar cualquier archivo `.csv`, `.json` o `.parquet` o pulsar el botón para seleccionarlo nativamente desde su Mac.
   - Insignia de privacidad de datos: "Privacidad total: tus datos nunca salen de tu Mac".
3. **Selector Dinámico Multicolumna & Subgrupos en Capas Semánticas (`SemanticLayersPanel.tsx`)**:
   - Se añadió un control desplegable prominente: **"Agrupar por columna"**, listando todas las columnas del dataset junto a su tipo y recuento de valores distintos (`distinctCount`). Al cambiarlo, se actualiza `mappings.category` e inmediatamente se recalcula la disposición de nodos, teñido cromático y ejes en tiempo real.
   - Se añadió un selector secundario opcional: **"Sub-agrupar por"**, permitiendo construir una jerarquía anidada de 2 niveles (e.g. `Continente` -> `Sector Económico`) para selección granular en lote.
   - Las carpetas inician colapsadas por defecto, evitando saturar la vista vertical cuando una dimensión posee decenas de valores.
4. **Erradicación Total de Estilos Obsoletos**:
   - Se refactorizaron completamente `DataProfilerModal.tsx` y `DataLasso.tsx` al estándar Warm Swiss Editorial con fondos `#fffdfa`, bordes `#e6dcce` y acentos `#e11d48`.
5. **Verificación Zero-Defect**:
   - `bun test`: 19/19 tests unitarios aprobados en 170ms.
   - `tsc -b`: 0 errores.
   - `vite build`: Build de producción generado en 2.25s.
   - `cargo check`: Aprobado limpiamente en 0.51s.
   - Socket `http://127.0.0.1:5220`: Respondiendo `HTTP/1.1 200 OK`.
