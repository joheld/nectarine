# 🍑 Nectarine — macOS Local Data & Vector Art Studio

> **Nectarine** es una estación de trabajo editorial y taller de arte vectorial interactivo para macOS. Combina la potencia del análisis de datos local en memoria (**DuckDB-WASM** y **Apache Arrow**) con el refinamiento visual de la infografía artística de autor (**D3**, **Bézier Curves** y **Visual Cinnamon**).

Diseñado bajo la filosofía **Human-Craft & Cero AI Slop**, con una paleta cálida editorial en tonos néctar, melocotón y crema marfil, controles segmentados de alta densidad y una barra de herramientas vertical clásica de 48px.

---

## 🌟 Características Principales

### 1. Ingestión Local de Alto Rendimiento (Zero-Cloud & Zero-Server)
- **Motor DuckDB-WASM embebido:** Procesa archivos locales en formato **CSV**, **JSON** y **Parquet** directamente en el navegador del cliente mediante transferencias Zero-Copy con **Apache Arrow**.
- **Privacidad Absoluta:** Ningún dato sale de tu equipo. Análisis y cómputo 100% locales en la CPU.
- **Asistente Estructural & Guardarraíl:** Profiler automático de columnas, tipos, conteos de nulos y cardinalidad. Alerta reactiva ante conjuntos de datos mayores a 10,000 nodos.
- **Filtrado Multicolumna Dinámico:** Reglas de filtrado múltiple con conjunciones lógicas conmutables (`AND` / `OR`) y operadores numéricos y de texto (`contiene`, `>`, `<`, `=`, etc.).

### 2. Las 9 Geometrías Maestras de Visualización
1. **Dispersión Cartesiana (Scatter Plot):** Correlación dimensional bidimensional con escalas D3 puras.
2. **Burbujas Métricas (Bubble Chart):** Empaquetado circular multivariante con codificación por radio y color.
3. **Barras Categóricas (Bar Chart):** Distribución vertical de frecuencias con etiquetas nítidas.
4. **Mosaico de Voronoi (Voronoi Tessellation):** Partición poligonal del espacio basada en proximidad euclidiana continua.
5. **Red de Fuerza (Force-Directed Graph):** Simulación física de partículas con fuerzas de repulsión de muchos cuerpos y atracción elástica.
6. **Ondas Armónicas (Streamgraph / Waves):** Flujo orgánico apilado con curvas continuas.
7. **Cuerdas Radiales (Visual Cinnamon Chords):** Diagrama circular de cuerdas con cintas fluidas y rutas de texto curvadas.
8. **Espiral Áurea (Visual Cinnamon Golden Spiral):** Distribución matemática armónica basada en la proporción áurea ($\Phi$).
9. **Mapa Celestial & Constelaciones (Celestial Orbits):** Proyección esférica de órbitas y vínculos estelares.

### 3. Guardián Ético y Arquitectura de Estado Dual
- **Separación Matemática vs Arte:** `dataStore.ts` preserva inalteradas las coordenadas empíricas originales, mientras `mutationStore.ts` registra traslaciones manuales, deformaciones Bézier y sobreescrituras cromáticas.
- **Monitor de Distorsión ($\Delta \%$):** Monitorea en tiempo real cuánto se desvía un nodo manipulado respecto a su coordenada real.
- **Rastros Fantasma (Ghost Tracer):** Líneas punteadas proyectadas hacia la posición empírica verdadera para garantizar rigor científico en publicaciones periodísticas.

### 4. Herramientas Editoriales & Acabados de Imprenta
- **Caja de Herramientas Vertical:** Selección (`V`), Mover (`M`), Deformación Bézier Orgánica (`B`), Anotaciones Atadas (`A`), y Herramienta de Mano (`H`).
- **Glifos Morfológicos Editoriales:** Variantes tipográficas para nodos (`circle`, `petal`, `star`, `diamond`, `seed`) asignables por subgrupo o categoría.
- **Texturas Analógicas de Taller:** Grano Risográfico, Trama Halftone y Papel de Algodón con filtros SVG nativos `<feTurbulence>` y `<feDisplacementMap>`.
- **Interoperabilidad Instantánea:**
  - **Copiar a Figma / Illustrator (<kbd>⌘C</kbd>):** Copia el vector procesado directamente al portapapeles del sistema para pegarlo en tu herramienta de diseño favorita.
  - **Exportación SVG Pura:** Rutina automática de saneamiento que purga gizmos, anillos de selección, manetas y pines, exportando código SVG limpio y estándar.

---

## 🛠️ Tecnologías

| Capa | Tecnologías |
| :--- | :--- |
| **Núcleo & Runtime** | [Bun](https://bun.com), Node.js, [Tauri v2](https://tauri.app) |
| **Frontend & UI** | React 19, TypeScript 5.7, [Vite 6](https://vitejs.dev), [Tailwind CSS 3.4](https://tailwindcss.com) |
| **Motor Analítico** | [@duckdb/duckdb-wasm](https://duckdb.org/docs/api/wasm/overview.html), [Apache Arrow](https://arrow.apache.org/) |
| **Motor Matemático** | [D3.js](https://d3js.org) (Scales, Shapes, Voronoi, Force, Chord) |
| **Estado Reactivo** | [Zustand](https://github.com/pmndrs/zustand) |
| **Iconografía** | [Lucide React](https://lucide.dev) |
| **Batería de Pruebas** | Bun Test (37 pruebas unitarias de integración, matemáticas y ética vectorial) |

---

## 💻 Instalación y Uso Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/joheld/nectarine.git
cd nectarine

# 2. Instalar dependencias con Bun
bun install

# 3. Iniciar el servidor de desarrollo en el puerto 5220
bun run dev

# 4. Ejecutar la suite completa de pruebas
bun test

# 5. Compilar para producción
bun run build
```

---

## ⌨️ Atajos de Teclado del Taller

| Atajo | Acción |
| :--- | :--- |
| <kbd>V</kbd> | Herramienta de Selección (Nodos / Marquee rectangular) |
| <kbd>M</kbd> | Herramienta de Mover (Desplazamiento 1:1 con zoom compensado) |
| <kbd>B</kbd> | Herramienta Bézier (Curvas orgánicas cerradas y manetas) |
| <kbd>A</kbd> | Herramienta de Anotación (Callouts atados a nodos) |
| <kbd>H</kbd> | Herramienta de Mano / Paneo libre del lienzo |
| <kbd>⌘C</kbd> | Copiar SVG puro al portapapeles para Figma / Illustrator |
| <kbd>⌘Z</kbd> / <kbd>⌘⇧Z</kbd> | Deshacer / Rehacer mutaciones de lienzo |
| <kbd>?</kbd> | Abrir Centro de Documentación & Masterclass |
| <kbd>ESC</kbd> | Cerrar modales o deseleccionar elementos |

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
