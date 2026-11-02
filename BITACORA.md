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


---

## Entrada 014 — Diagnóstico y Reparación Integral de Lanzadores macOS (Nectarine.app & Nectarine.command)
- **Fecha y Hora**: 2026-11-02 13:35
- **Fase**: Resiliencia Operativa, Firma de Código & UX de Escritorio
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Fallas (Causas Raíz Identificadas)
1. **Firma de Código Dañada en `Nectarine.app`**:
   - `codesign -v "/Users/joe/Desktop/Nectarine.app"` fallaba con `a sealed resource is missing or invalid: file modified: .../Contents/Resources/applet.icns`.
   - Al haberse modificado el archivo de icono sin regenerar el sello de firma ad-hoc, Gatekeeper y el subsistema de seguridad de macOS bloqueaban la ejecución del bundle desde Finder.
2. **AppleScript Frágil & Conflicto con Terminal TCC**:
   - `main.scpt` contenía `tell application "Terminal" do script "cd \"$HOME/vectura\" && bun run dev" activate end tell`.
   - En macOS moderno, el envío de AppleEvents a `Terminal.app` requiere permisos explícitos de Automatización TCC. Si no fueron concedidos o el diálogo fue cancelado, el applet fallaba silenciosamente.
   - Además, ejecutar `bun run dev` directamente en una sesión de Terminal provocaba que, si el servidor ya estaba escuchando en el puerto dedicado `5220` (`strictPort: true`), Vite abortara inmediatamente arrojando `Error: Port 5220 is already in use`.
3. **Ausencia de Apertura Automática de la Interfaz (UI)**:
   - Ni `Nectarine.app` ni `Nectarine.command` invocaban la apertura del navegador o cliente web (`open "http://127.0.0.1:5220"`). Aunque el proceso de Vite iniciara en terminal, el usuario nunca veía la aplicación abrirse en pantalla.
4. **Residuos de Nombres Antiguos en Scripts de Lanzamiento**:
   - `run.sh` y `launch-desktop.sh` conservaban cadenas y rutas de registro obsoletas (`[Cinnamon]`, `/tmp/cinnamon.log`).

### Resoluciones Aplicadas
1. **Desacople Total de Terminal en `Nectarine.app`**:
   - Se recompiló `Contents/Resources/Scripts/main.scpt` con `osacompile` para que invoque asíncronamente `launch-desktop.sh` sin requerir permisos AppleEvents ni abrir pestañas de Terminal:
     ```applescript
     set userHome to POSIX path of (path to home folder)
     set launchScript to userHome & "vectura/launch-desktop.sh"
     do shell script "/bin/bash " & quoted form of launchScript & " > /dev/null 2>&1 &"
     ```
2. **Saneamiento y Resellado de Firma de Código**:
   - Se eliminaron atributos extendidos restrictivos (`xattr -cr "/Users/joe/Desktop/Nectarine.app"`).
   - Se firmó ad-hoc en profundidad con `codesign --force --deep --sign - "/Users/joe/Desktop/Nectarine.app"`.
   - Se validó con `codesign -vvv --deep`: salida `valid on disk` y `satisfies its Designated Requirement`.
3. **Resiliencia Operativa y Auto-Recuperación de Socket en `run.sh`**:
   - Se actualizó `run.sh` para detectar si el puerto `5220` responde `HTTP 200 OK` (retorno inmediato sin relanzar procesos duplicados).
   - Si el puerto está retenido por un proceso no responsivo o zombie, lo libera automáticamente antes de iniciar una nueva instancia limpia con `nohup ... </dev/null >/tmp/nectarine.log 2>&1 &`.
4. **Actualización de `launch-desktop.sh` y `Nectarine.command`**:
   - `launch-desktop.sh` actualizado a la marca Nectarine, garantizando la apertura instantánea de `http://127.0.0.1:5220` en el navegador nativo y notificación de sistema macOS.
   - `Nectarine.command` actualizado para delegar en `launch-desktop.sh`, garantizando paridad de comportamiento robusto.
5. **Batería de Verificación Zero-Defect**:
   - Prueba de arranque en frío (tras liberar puerto `5220`): `open /Users/joe/Desktop/Nectarine.app` levantó el servidor y respondió `HTTP 200 OK` en <2s.
   - Prueba de arranque en caliente: respuesta inmediata `HTTP 200 OK` sin errores de puerto ocupado.
   - `bun test`: 19/19 tests pasados (100%).
   - `tsc -b`: 0 errores de tipado.
   - `vite build`: Build de producción validado en 2.26s.


---

## Entrada 015 — Reparación Integral de Herramientas de Lienzo & Purga de Anotación Ficticia
- **Fecha y Hora**: 2026-11-02 13:56
- **Fase**: Interacción Directa con el Lienzo, Ergonomía de Herramientas & Fidelidad Semántica
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Fallas (En respuesta al feedback del usuario)
1. **Comentario Fantasma Intrusivo**:
   - `useLayerStore.ts` iniciaba con un elemento predeterminado en `annotations`: `"Punto de Referencia: Mayor PIB y Esperanza de Vida"` anclado a `node-0`. Aunque el usuario cargara un archivo de música, sensores o ventas, esa tarjeta aparecía de forma espuria sobre el primer nodo estorbando la vista.
2. **Herramienta Mano ("la mani") Inexistente en Barra de Herramientas**:
   - En `Toolbar.tsx` solo existían cuatro botones (`select`, `move`, `bezier`, `annotate`). El paneo del lienzo requería pulsar la rueda central del ratón o la tecla `Alt`, lo cual confundía a los usuarios que buscaban la clásica herramienta de Mano para desplazar el lienzo.
3. **Arrastre ("arrastre") Desincronizado del Cursor por Zoom**:
   - En `CanvasNode.tsx`, el cálculo de desplazamiento `dx = e.clientX - dragStartRef.clientX` no compensaba el factor de escala `zoom`. Si el usuario aplicaba zoom in o zoom out, el nodo se movía a una velocidad distinta al cursor del ratón (desbordamiento visual).
4. **Herramienta Comentario Inoperante al Clic**:
   - Al activar la herramienta de Anotar (`activeTool === 'annotate'`), hacer clic sobre un nodo solo ejecutaba `selectNode()`, sin invocar la creación de notas ni desplegar ningún diálogo para escribir texto.
5. **Herramienta Curvar Bézier Rota (Salto a Infinito)**:
   - Al arrastrar las manetas `cp1` o `cp2`, se calculaba `newCp1x = e.clientX - currentX`, restando coordenadas globales de la ventana (`e.clientX`) a coordenadas relativas del SVG (`currentX`). Esto provocaba que al primer movimiento la maneta saltara de inmediato a cientos de píxeles fuera de pantalla.

### Resoluciones Aplicadas
1. **Purga Definitiva de Anotaciones Muestra**:
   - `layerStore.ts` inicia con `annotations: []`.
   - `loadDataset()` en `dataStore.ts` invoca automáticamente `useLayerStore.getState().clearAnnotations()` y `resetAllMutations()` para garantizar que al abrir un nuevo dataset el lienzo esté inmaculado.
2. **Incorporación de la Herramienta de Mano (`pan`)**:
   - Añadida al store `mutationStore.ts`: `activeTool: 'pan' | 'select' | 'move' | 'bezier' | 'annotate'`.
   - Botón de Mano (`Hand`) añadido al inicio del grupo de herramientas en `Toolbar.tsx` con atajo `[Tecla H]` y cursores dinámicos `cursor-grab` y `cursor-grabbing`.
   - En `Canvas.tsx`, con la herramienta Mano activa, arrastrar con clic primario desplaza suavemente el lienzo por toda el área de trabajo.
3. **Arrastre de Nodos Fiel 1:1 con Compensación de Zoom**:
   - `CanvasNode.tsx` recibe la propiedad `zoom`.
   - El delta se divide por el factor de escala: `dx = (e.clientX - dragStart.clientX) / zoom`, logrando adherencia subpíxel al cursor a cualquier nivel de aumento (0.3x - 5x).
4. **Flujo Interactivo de Anotaciones al Clic**:
   - Con `activeTool === 'annotate'`, el cursor cambia a `cursor-crosshair`.
   - Al pulsar sobre cualquier nodo, se despliega un diálogo nativo contextual para ingresar la nota explicativa.
   - La tarjeta se crea de inmediato con su flecha curva y cuenta ahora con un botón de borrado directo (`×`) en la esquina superior derecha, además de permitir edición con doble clic.
   - El arrastre de la tarjeta de anotación también fue inmunizado contra discrepancias de zoom.
5. **Cálculo de Manetas Bézier en Delta Relativo**:
   - Se refactorizó el arrastre de manetas en `CanvasNode.tsx` registrando la posición inicial del puntero y sumando el delta normalizado: `cp1x = initialCp1x + (deltaX / zoom)`. La maneta sigue con exactitud milimétrica el cursor.
6. **Atajos de Teclado Globales en `App.tsx`**:
   - `H`: Mano (pan)
   - `V`: Selección (select)
   - `M`: Mover / Arrastre (move)
   - `B`: Curvar Bézier (bezier)
   - `A`: Anotar / Comentario (annotate)
7. **Batería Zero-Defect**:
   - Suite nueva creada: `tests/toolsAndAnnotations.test.ts` validando el ciclo de vida de herramientas y limpieza de anotaciones.
   - `bun test`: 23/23 tests pasados (100%).
   - `tsc -b`: 0 errores de tipado.
   - `vite build`: Build de producción generado limpiamente en 2.17s.


---

## Entrada 016 — Motor de Filtrado Multicolumna Compuesto (Multi-Condition Engine)
- **Fecha y Hora**: 2026-11-02 14:08
- **Fase**: Transformación Analítica No-SQL, Filtrado Dinámico & Experiencia de Usuario
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Brechas (En respuesta al feedback del usuario)
1. **Limitación a Filtro de Columna Única**:
   - `DataProfilerModal.tsx` solo disponía de tres controles (`filterCol`, `filterOp`, `filterVal`), permitiendo evaluar únicamente una condición sobre una sola columna a la vez. Al aplicar un nuevo filtro se sobrescribía el anterior sin posibilidad de componer restricciones lógicas entre múltiples variables (e.g. `Continente = 'Europa'` Y `PIB > 25000` Y `Esperanza_Vida >= 80`).
2. **Falta de Operadores Relacionales**:
   - Solo se soportaban `>`, `<`, `=`, `!=`. Faltaban operadores fundamentales como `>=` (mayor o igual) y `<=` (menor o igual).
3. **Ausencia de Telemetría Predictiva en Filtros**:
   - El usuario no podía conocer cuántas filas resultarían del filtro antes de aplicarlo, obligando a cerrar el modal a ciegas para ver el resultado.

### Resoluciones Aplicadas
1. **Motor de Filtrado Compuesto en `profiler.ts`**:
   - Se diseñó e implementó la interfaz `FilterCondition`:
     ```typescript
     export interface FilterCondition {
       id: string;
       column: string;
       operator: '>' | '<' | '>=' | '<=' | '=' | '!=' | 'contains';
       value: any;
     }
     ```
   - Se añadió el método `transformMultiFilter(rows, conditions, conjunction: 'AND' | 'OR')`, con evaluación automática de tipos numéricos y textuales (soporte para mayúsculas/minúsculas y subcadenas).
2. **Gestión de Estado en `dataStore.ts`**:
   - `activeFilters: FilterCondition[]` y `filterConjunction: 'AND' | 'OR'` agregados al estado reactivo.
   - Acción `applyMultiFilter(conditions, conjunction)` con recálculo dinámico de layout SVG.
   - `resetTransforms()` y `loadDataset()` limpian todos los filtros activos automáticamente.
3. **Rediseño Integral de la Pestaña "Filtrar Datos" en `DataProfilerModal.tsx`**:
   - **Selector de Conjunción Booleana**: Segmented control conmutable entre `Todas (Y / AND)` y `Cualquiera (O / OR)`.
   - **Telemetría en Tiempo Real**: Badge reactivo que calcula y muestra al instante el número y porcentaje de filas coincidentes (`X de Y filas coinciden (Z%)`).
   - **Filas Dinámicas de Condiciones**: Cada regla cuenta con su identificador numérico (`#1`, `#2`), selector de columna, selector de operador contextual según el tipo de dato, campo de valor con sugerencia de muestra (`placeholder`) y botón de eliminación individual (`Trash2`).
   - **Botón "+ Añadir otra condición"**: Permite agregar tantas restricciones sobre columnas distintas como el usuario requiera.
   - **Botón "Limpiar Filtros"** y **"Aplicar Filtros (N)"**: Con cierre automático y actualización inmediata del lienzo.
4. **Badge Visual en la Barra de Herramientas (`Toolbar.tsx`)**:
   - El botón "Filtros" ahora refleja visualmente el número de filtros activos con un badge numérico ámbar cuando existen reglas aplicadas.
5. **Batería Zero-Defect**:
   - 3 nuevos tests unitarios en `tests/profiler.test.ts` evaluando conjunciones AND, OR y operador `contains`.
   - `bun test`: 26/26 tests pasados (100%).
   - `tsc -b`: 0 errores de tipado.
   - `vite build`: Build de producción validado en 2.41s.

---

## Entrada 017 — Separación de Herramientas (Seleccionar vs Mover), Caja de Selección Elástica (Marquee) y Deformación Bézier Orgánica Cerrada con Guía Visual
- **Fecha y Hora**: 2026-11-02 14:18
- **Fase**: Interacción Vectorial, UX Editorial & Motor Bézier
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico de Brechas (En respuesta al feedback del usuario)
1. **Confusión y Fusión entre Seleccionar y Arrastrar**:
   - En `CanvasNode.tsx`, el gestor de eventos contenía la condición unificada `if (activeTool === 'move' || activeTool === 'select') { setIsDragging(true); ... }`. En consecuencia, al hacer clic sobre un nodo con la herramienta Selección, este se desplazaba inmediatamente si el usuario movía el puntero aunque solo quisiera seleccionarlo.
   - La herramienta Selección carecía además de selección múltiple por arrastre sobre el fondo del lienzo (caja elástica o *marquee box*).
2. **Deficiencias en la Herramienta de Curvar Bézier**:
   - **Falta de Guía Visual Inmediata**: Al activar el botón de curvar en la barra, el usuario no recibía ninguna instrucción de que debía hacer clic en un nodo para desplegar sus manetas de control.
   - **Geometría Abierta Truncada**: La función previa `buildCubicBezierPath` generaba una curva cúbica abierta `M -r 0 C cp1 cp2 r 0` que provocaba que el nodo pareciera rebanado por la mitad con un corte horizontal plano en la base en lugar de deformarse armónicamente como un cuerpo cerrado orgánico.
   - **Manetas Diminutas y sin Identificación**: Las manetas tenían un radio pequeño (5px) y carecían de etiquetas contextuales, dificultando discernir qué parte del vector se estaba modificando.

### Resoluciones Aplicadas
1. **Separación Funcional Rigurosa en `CanvasNode.tsx`**:
   - **Herramienta Selección (`select`)**: Exclusivamente gestiona la selección del nodo (individual o múltiple con Shift/Cmd). Queda terminantemente deshabilitado el arrastre accidental mientras esta herramienta esté activa.
   - **Herramienta Mover (`move`)**: Gestiona el arrastre y traslación posicional con escala compensada por zoom (1:1), moviendo simultáneamente todos los nodos seleccionados si el nodo pulsado forma parte de un grupo.
2. **Caja Elástica de Selección Múltiple (Marquee Box) en `Canvas.tsx`**:
   - Al arrastrar el puntero sobre el fondo del lienzo con la herramienta Selección activa, se dibuja un rectángulo elástico punteado con relleno translúcido rosáceo (`fill="rgba(225, 29, 72, 0.08)"`, `stroke="#e11d48"`).
   - Todos los nodos cuyas coordenadas matemáticas queden comprendidas dentro de la caja se seleccionan de inmediato de forma reactiva (`selectAll`).
3. **Rediseño del Motor Bézier a Curvas Orgánicas Cerradas en `bezierMath.ts`**:
   - Nueva función `buildClosedOrganicBezierPath(radius, cp1, cp2)`: Genera un trayecto cerrado continuo compuesto por dos arcos cúbicos continuos tangentes en los extremos izquierdo y derecho (`M left C topCp1 topCp2 right C bottomCp1 bottomCp2 left Z`). Esto produce una deformación armónica, suave y completamente cerrada, sin bases aplanadas.
   - Nueva función `generateOrganicBezierHandles(radius)`: Establece puntos de anclaje iniciales verticales polarizados en `(0, -radius * 1.33)` para el lóbulo superior y `(0, radius * 1.33)` para el lóbulo inferior.
4. **Manetas Ergonómicas de Alta Visibilidad & Botón de Reseteo Rápido**:
   - **Hit Target Ampliado a 15px**: Área de contacto transparente ampliada para facilitar el arrastre sin precisión milimétrica.
   - **Etiquetas de Color Diferenciadas**:
     - **Curva 1** (azul celeste `#0284c7`): Controla el lóbulo superior del vector.
     - **Curva 2** (rosa carmesí `#e11d48`): Controla el lóbulo inferior del vector.
   - **Botón de Restablecimiento Inmediato (`↺`)**: Aparece flotando junto al nodo si tiene curvatura personalizada, permitiendo con un solo clic restaurar la forma circular perfecta mediante `resetBezierHandles(node.id)`.
5. **Banner Flotante de Guía Visual en el Lienzo**:
   - Cuando se selecciona la herramienta Bézier, aparece en la parte superior central del lienzo un banner translúcido con animación suave informando al usuario: *"Modo Curvar Bézier: Haz clic en cualquier elemento para activar sus manetas y arrastra Curva 1 (azul) o Curva 2 (rosa) para deformarlo orgánicamente."*
6. **Batería Zero-Defect**:
   - Nuevos tests unitarios en `tests/toolsAndAnnotations.test.ts` para verificar `buildClosedOrganicBezierPath`, `generateOrganicBezierHandles`, `resetBezierHandles` y la separación de herramientas.
   - `bun test`: 29/29 tests pasados (100%).
   - `bun run verify` (`tsc -b && vite build`): 0 errores de tipado, compilación limpia.
   - Socket HTTP 200 en puerto 5220 verificado.
   - Firma de código en `/Users/joe/Desktop/Nectarine.app` verificada como válida.

---

## Entrada 018 — Vanguardia del Atelier: Motor de Reconciliación en Caliente, Estudio de Glifos Morfológicos, Texturas de Taller y Copia Directa a Figma
- **Fecha y Hora**: 2026-11-02 14:35
- **Fase**: Fase 6: Reconciliación Inteligente, Texturas Físicas & Flujo Editorial de Élite
- **Arquitecto**: Antigravity Principal Software Architect

### Contexto y Visión
Para elevar a Nectarine al estándar de un software de culto entre diseñadores de información y periodistas de datos (superando la brecha destructiva de Adobe Illustrator y Figma), se implementaron las 4 capacidades estratégicas fundamentales:

1. **Motor de Reconciliación en Vivo (Live Data Hot-Reload with Entity Diffing)**:
   - Se construyó el servicio `reconciler.ts` con el algoritmo `DatasetReconciler`.
   - Cuando se importa o arrastra un nuevo archivo de datos con información actualizada o corregida, el motor descubre la clave primaria compartida (`id`, `pais`, `codigo`, `name` o columna con alta cardinalidad) y realiza un emparejamiento determinista entidad por entidad.
   - **Preservación Total de Mutaciones Artísticas**: Todas las posiciones desplazadas (`customX, customY`), manetas de curvatura Bézier (`cp1x, cp1y, cp2x, cp2y`), colores de relleno (`customFill`), escalas y notas explicativas (`tetheredAnnotations`) se transfieren íntegramente a los nuevos nodos de datos.
   - Telemetría reactiva en pantalla mediante un banner superior que informa: *"Hot-Reload Activo: Se reconciliaron X entidades preservando todas sus mutaciones artísticas (clave: 'col') • Y nuevas • Z retiradas"*.
2. **Estudio de Glifos Morfológicos (Morphological Glyph Engine)**:
   - Los datos dejan de estar encasillados en círculos. En `glyphMath.ts` se implementaron generadores matemáticos puros para 5 morfologías de alta precisión editorial:
     - `circle`: Círculo matemático clásico continuo.
     - `petal`: Pétalo botánico fluido de curvatura asimétrica suave.
     - `star`: Estrella áurea paramétrica de 5 puntas.
     - `diamond`: Rombo editorial suizo angulado de precisión.
     - `seed`: Semilla orgánica Bézier de doble cúspide.
   - Selector en la barra de herramientas (`Toolbar.tsx`) para la morfología global del dataset y selector individual en el panel inspector (`NodeInspector.tsx`).
3. **Texturas de Taller Editorial & Grano Risográfico (Studio Finishes)**:
   - Servicio `textureService.ts` y filtros SVG vectoriales en tiempo real dentro del lienzo:
     - `clean`: Vectorial puro afilado.
     - `risograph`: Textura de micro-ruido denso simulando tinta y grano de risografía/serigrafía (`<feTurbulence baseFrequency="0.72">` + `<feColorMatrix>` + `<feBlend mode="multiply">`).
     - `halftone`: Trama de semitonos litográfica con matriz de puntos de imprenta.
     - `paper`: Rugosidad táctil de papel de algodón prensado en frío con iluminación rasante (`<feDiffuseLighting>`).
   - Conmutable en vivo desde el menú de la barra de herramientas.
4. **Copia Directa al Portapapeles para Figma e Illustrator (<kbd>⌘C</kbd>)**:
   - En `exportService.ts` se implementó `copyToClipboard(cleanSvg)`, compatible con Clipboard API multiformato (`image/svg+xml` y `text/plain`).
   - Botón "Copiar a Figma" en la barra de herramientas con indicador de éxito visual (badge de confirmación) y atajo de teclado global <kbd>⌘C</kbd> / <kbd>Ctrl+C</kbd>. Al pulsar <kbd>⌘V</kbd> dentro de Figma o Illustrator, se pegan instantáneamente vectores y trazados nativos editables.
5. **Batería Zero-Defect**:
   - 5 nuevos tests unitarios en `tests/reconcilerAndStudio.test.ts`.
   - `bun test`: 34/34 tests pasados (100%).
   - `bun run verify` (`tsc -b && vite build`): 0 errores de tipado, compilación limpia en 2.30s.
   - Liveness socket HTTP 200 en puerto 5220 verificado.
   - Firma de código en `Nectarine.app` verificada como válida.


---

## Entrada 019 — Reorganización Ergonómica: Paleta Vertical Clásica & Barra Superior Desahogada
- **Fecha y Hora**: 2026-11-02 14:50
- **Fase**: Fase 6: Ergonomía de Estudio & Alineación Visual Human-Craft
- **Arquitecto**: Antigravity Principal Software Architect

### Contexto y Necesidad
Al incorporar nuevas capacidades avanzadas (hot-reload, glifos, texturas y copiar a Figma), la barra superior acumulaba demasiados elementos en una sola línea horizontal. Un intento previo de colocar un dock flotante en el fondo del lienzo resultó molesto porque cubría las marcas de datos y competía con los controles de zoom. Tras una consulta de opciones con el usuario, se seleccionó el estándar clásico y universal de las aplicaciones de diseño vectorial (Adobe Illustrator, Photoshop, Figma): **una tira lateral vertical delgada a la izquierda del lienzo**, liberando por completo la barra superior.

### Arquitectura de la Solución
1. **Componente `VerticalToolbox.tsx` (Tira Lateral de 48px)**:
   - Ubicado exactamente entre `<SemanticLayersPanel />` y `<Canvas />`.
   - Ancho exacto `w-12` (48px), fondo cálido `#f8f5ee` y borde derecho `#e6dcce`.
   - Aloja exclusivamente las 5 herramientas de interacción del lienzo con iconos limpios, indicador de tecla de atajo en subíndice discreto y estados activos claros (carmesí `#e11d48` con texto blanco):
     - **Seleccionar** (`select`, <kbd>V</kbd>): Clic en nodos o arrastre en fondo para caja elástica (Marquee).
     - **Mover y Arrastrar** (`move`, <kbd>M</kbd>): Desplazamiento de nodos con escala 1:1.
     - **Curvar Bézier** (`bezier`, <kbd>B</kbd>): Despliegue de manetas orgánicas de deformación.
     - **Anotación Conectada** (`annotate`, <kbd>A</kbd>): Creación de notas atadas a datos.
     - **Mano / Encuadre** (`pan`, <kbd>H</kbd>): Desplazamiento del lienzo sin tocar las marcas.
   - **Botón de Restablecimiento Inmediato (`↺`)**: Aparece bajo un separador solo cuando existen mutaciones manuales registradas en `mutationStore`, permitiendo volver a la verdad matemática con un clic.
2. **Desahogo Total de la Barra Superior (`Toolbar.tsx`)**:
   - Se retiraron las herramientas de interacción manual de la barra superior.
   - La barra queda dividida armónicamente en 3 secciones:
     - **Izquierda (Datos y Archivos)**: Subir Archivo, Hot-Reload y Filtros multicolumna.
     - **Centro (Arquitectura Gráfica)**: Los 9 tipos de gráficos (Dispersión, Burbujas, Cuerdas, Espiral, Celestial, Barras, Mosaico, Red, Ondas) en un control segmentado accesible a un solo clic sin dropdowns ni menús desplegables.
     - **Derecha (Estilo Editorial & Salida)**: Luz & Glow, Selector de Paletas, Glifos Morfológicos, Acabados de Imprenta, Copiar a Figma y Exportar SVG.
3. **Lienzo Libre y Despejado (`Canvas.tsx`)**:
   - Sin ningún dock flotante inferior cubriendo la visualización de datos.

### Batería Zero-Defect
- `bun test`: 34/34 tests pasados (100%).
- `bun run verify` (`tsc -b && vite build`): 0 errores de tipado, compilación de producción limpia.
- Socket HTTP 200 en puerto 5220 verificado.
- Firma de código en `/Users/joe/Desktop/Nectarine.app` verificada como válida con Designated Requirement.


---

## Entrada 020 — Auditoría Visual Forense (Visión Computacional) & Rediseño de Arquitectura Pro
- **Fecha y Hora**: 2026-11-02 15:05
- **Fase**: Fase 6: Auditoría Visual & Rediseño Arquitectónico de Calibre Humano
- **Arquitecto**: Antigravity Principal Software Architect

### Diagnóstico con Visión Computacional (Captura Real Renderizada)
Tras la queja del usuario sobre el aspecto de la interfaz, se ejecutó un script con Playwright para capturar y renderizar la pantalla en resolución estándar de escritorio (1440x900). La inspección visual forense reveló cuatro fallos críticos graves:
1. **Desbordamiento Horizontal Brutal en Barra Superior**: Tres menús desplegables nativos gigantescos (*Nectarine & Melocotón*, *Círculo Clásico*, *Vectorial Puro*) ocupaban más de 450px en la barra superior. Esto empujaba los botones más críticos del producto (**Copiar a Figma** y **Exportar SVG**) completamente fuera del viewport visible, quedando ocultos e inaccesibles.
2. **Invisibilidad de Gráficos**: En el control segmentado de gráficos, mientras 'Dispersión' mostraba un rótulo rojo brillante, los otros 8 gráficos se renderizaban como puntos grises apagados (`opacity-40`), prácticamente invisibles e indistinguibles.
3. **Disposición 'Sándwich' Inversa de la Caja de Herramientas**: La tira de herramientas de 48px había quedado encajada entre el panel de Capas (288px) y el lienzo, creando una grieta visual extraña en medio de la pantalla. Además, los botones tenían letras minúsculas superpuestas en las esquinas que parecían artefactos rotos.
4. **Colapso del Lateral Derecho y Asimetría del Lienzo**: Cuando no había ningún nodo seleccionado, `NodeInspector.tsx` retornaba `null`, dejando todo el lateral derecho como un vacío en blanco y empujando el lienzo asimétricamente a la derecha.

### Solución Arquitectónica Implementada
1. **Inspector Permanente Dual (`NodeInspector.tsx`, 288px)**:
   - **Modo Global ('Estudio & Estilo')**: Cuando no hay ningún nodo seleccionado, el panel derecho permanece activo y muestra:
     - **Paleta Cromática**: Tarjetas interactivas con tiras de muestras reales de los 5 colores para cada una de las 5 paletas editoriales.
     - **Morfología Maestra de Glifos**: Cuadrícula de botones táctiles con icono SVG de cada forma (*Círculo, Pétalo, Estrella, Rombo, Semilla*).
     - **Acabado de Taller / Textura**: Selector de 4 estilos (*Vectorial Puro, Grano Risográfico, Trama Semitonos, Papel de Algodón*) con descripción técnica.
     - **Resplandor Estelar (Glow)**: Conmutador táctil con indicador de estado ámbar.
     - **Telemetría del Dataset**: Resumen con nombre de archivo, recuento de filas y vectores en lienzo con tipografía monoespaciada tabular.
   - **Modo Elemento ('Inspector de Vector')**: Al hacer clic en cualquier dato, conmuta al inspector de nodo con color individual, glifo específico, control de escala 1:1, botón de anclaje ético y telemetría de distorsión empírica.
2. **Barra Superior Esbelta y Equilibrada (`Toolbar.tsx`, 48px)**:
   - Se erradicaron los tres menús anchos de la barra superior al mudarlos al inspector derecho.
   - **Izquierda**: *Subir Archivo*, *Hot-Reload* reconciliador y *Filtros*.
   - **Centro**: Los 9 gráficos se muestran con icono y rótulo legible (*Dispersión, Burbujas, Cuerdas, Espiral, Celestial, Barras, Mosaico, Red, Ondas*).
   - **Derecha**: *Copiar a Figma* (<kbd>⌘C</kbd>) y *Exportar SVG* con 100% de visibilidad garantizada y amplio margen de seguridad.
3. **Tira de Herramientas en el Extremo Exterior Izquierdo (`VerticalToolbox.tsx`, 48px)**:
   - Se movió al borde absoluto izquierdo de la ventana (`w-12`), replicando el arquetipo clásico de Adobe Illustrator y Photoshop: `[Tira de Herramientas] -> [Capas (256px)] -> [Lienzo] -> [Inspector (288px)]`.
   - Se eliminaron las letras superpuestas en las esquinas de los iconos, usando tooltips estándar nativos y rim-light sutil en el botón activo.

### Batería Zero-Defect
- `bun test`: 34/34 tests pasados (100%).
- `bun run verify` (`tsc -b && vite build`): 0 errores, compilación de producción limpia en 2.32s.
- Verificación visual con Playwright: capturas PNG (`screenshot_v3_perfect.png`) confirmaron composición equilibrada, cero desbordamientos y legibilidad cristalina.
- Socket HTTP 200 en puerto 5220 y sellado de código en `/Users/joe/Desktop/Nectarine.app` verificados.


---

## Entrada 021 — Blindaje para Evaluadores de Élite: Demos 1-Clic, Tooltips Hover & Pila Undo/Redo (⌘Z)
- **Fecha y Hora**: 2026-11-02 15:20
- **Fase**: Fase 6: Pulido de Excelencia & Cero Fricción para Visualizadores de Élite
- **Arquitecto**: Antigravity Principal Software Architect

### Contexto y Necesidad
Con el objetivo de compartir Nectarine Studio con visualizadores de datos de renombre internacional (periodistas visuales, autores y diseñadores de información), se implementaron las 3 características imprescindibles para garantizar una primera impresión de clase mundial sin fricciones ni frustraciones:

### Implementación Detallada
1. **Datasets de Demostración Curados en 1 Clic (`demoDatasets.ts` & `Canvas.tsx`)**:
   - En la tarjeta central del lienzo vacío se incorporó una sección dedicada: *"¿Quieres probar la app de inmediato? Carga una demo:"*.
   - **Demo 1: Desarrollo Humano & Economía Global**: 14 naciones con métricas de PIB per cápita, esperanza de vida, población e índice de felicidad. Activa inmediatamente el gráfico de Dispersión con 5 regiones en capas.
   - **Demo 2: Cosmos & Exoplanetas Descubiertos**: 12 mundos interestelares con distancia en años luz, masa, clase estelar y temperatura. Activa la arquitectura Celestial / Espiral áurea.
   - Permite que cualquier evaluador comience a interactuar con las 9 geometrías en menos de 2 segundos sin tener que buscar o formatear un CSV.
2. **Tooltips de Precisión al Pasar el Cursor (`CanvasNode.tsx`)**:
   - Detección de puntero reactiva con `onPointerEnter` y `onPointerLeave` vinculada a `hoveredNodeId`.
   - Renderizado dinámico de un tooltip vectorial flotante con fondo obsidiana `#2c1a0e`, bisel blanco traslúcido, sombra difusa y flecha indicadora.
   - Muestra el nombre de la entidad en negrita y su categoría junto a la métrica X formateada con separador de miles.
   - Marcado con `data-editor-ui="true"` para garantizar purga automática al exportar a SVG o copiar a Figma.
   - Inyección de etiqueta accesible `<title>` nativa para compatibilidad total con lectores de pantalla.
3. **Motor Completo de Deshacer / Rehacer (Undo / Redo con <kbd>⌘Z</kbd> & <kbd>⌘⇧Z</kbd>)**:
   - En `mutationStore.ts` se implementó una pila de historial inmutable (`undoStack` y `redoStack`) con un límite de 40 estados.
   - Instantáneas automáticas (`recordSnapshot`) antes de cada mutación: arrastre de nodos, manetas Bézier, cambios de color, morfología de glifos, escala o anclaje ético.
   - Listener de teclado global en `App.tsx` que intercepta <kbd>⌘Z</kbd> (Deshacer) y <kbd>⌘⇧Z</kbd> / <kbd>⌘Y</kbd> (Rehacer), respetando inputs de texto activos.

### Batería Zero-Defect
- `bun test`: 36/36 tests pasados (100%), incluyendo 2 nuevos tests unitarios para la pila de historial <kbd>⌘Z</kbd> y los datasets demo.
- `bun run verify` (`tsc -b && vite build`): 0 errores de tipado, compilación en 2.23s.
- Verificación con Playwright: capturas PNG confirmaron el renderizado impecable de las tarjetas demo y el tooltip flotante al posar el cursor sobre un nodo.
- Socket HTTP 200 en puerto 5220 y sellado de código en `/Users/joe/Desktop/Nectarine.app` verificados.
