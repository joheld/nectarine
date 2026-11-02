/**
 * Curated High-Craft Demo Datasets for Nectarine Studio
 * Designed to showcase all 9 chart architectures immediately to visual designers.
 */

export interface DemoDatasetInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  recommendedChart: 'scatter' | 'bubble' | 'chord' | 'spiral' | 'celestial';
  rows: Record<string, any>[];
}

export const DEMO_DATASETS: DemoDatasetInfo[] = [
  {
    id: 'paises-desarrollo',
    name: 'desarrollo_global.csv',
    title: 'Desarrollo Humano & Economía Global',
    description: '14 naciones representativas con PIB per cápita, esperanza de vida, población e índice de felicidad.',
    recommendedChart: 'scatter',
    rows: [
      { pais: 'Noruega', pib: 89000, esperanza_vida: 83.2, region: 'Europa', poblacion: 5.4, felicidad: 7.39 },
      { pais: 'Japón', pib: 42000, esperanza_vida: 84.6, region: 'Asia', poblacion: 125.7, felicidad: 6.13 },
      { pais: 'EE.UU.', pib: 76000, esperanza_vida: 77.3, region: 'América', poblacion: 331.9, felicidad: 6.89 },
      { pais: 'Alemania', pib: 51000, esperanza_vida: 81.0, region: 'Europa', poblacion: 83.2, felicidad: 7.03 },
      { pais: 'Brasil', pib: 8900, esperanza_vida: 75.9, region: 'América', poblacion: 214.3, felicidad: 6.12 },
      { pais: 'Nigeria', pib: 2100, esperanza_vida: 54.7, region: 'África', poblacion: 218.5, felicidad: 4.55 },
      { pais: 'Australia', pib: 65000, esperanza_vida: 83.4, region: 'Oceanía', poblacion: 25.7, felicidad: 7.16 },
      { pais: 'Canadá', pib: 52000, esperanza_vida: 82.2, region: 'América', poblacion: 38.2, felicidad: 7.02 },
      { pais: 'Singapur', pib: 82000, esperanza_vida: 83.9, region: 'Asia', poblacion: 5.6, felicidad: 6.58 },
      { pais: 'Chile', pib: 16000, esperanza_vida: 80.2, region: 'América', poblacion: 19.5, felicidad: 6.17 },
      { pais: 'Kenia', pib: 2000, esperanza_vida: 66.7, region: 'África', poblacion: 53.0, felicidad: 4.54 },
      { pais: 'Corea del Sur', pib: 35000, esperanza_vida: 83.5, region: 'Asia', poblacion: 51.7, felicidad: 5.95 },
      { pais: 'Islandia', pib: 73000, esperanza_vida: 83.0, region: 'Europa', poblacion: 0.37, felicidad: 7.55 },
      { pais: 'México', pib: 11000, esperanza_vida: 75.1, region: 'América', poblacion: 128.9, felicidad: 6.33 },
    ],
  },
  {
    id: 'cosmos-exoplanetas',
    name: 'catalogo_exoplanetas.csv',
    title: 'Cosmos & Exoplanetas Descubiertos',
    description: '12 mundos interestelares con distancia en años luz, masa planetaria, clase estelar y habitabilidad.',
    recommendedChart: 'celestial',
    rows: [
      { planeta: 'Próxima Centauri b', distancia_al: 4.2, masa_tierra: 1.17, clase_estrella: 'Enana Roja', temperatura_k: 234, habitabilidad: 0.85 },
      { planeta: 'TRAPPIST-1e', distancia_al: 39.5, masa_tierra: 0.69, clase_estrella: 'Enana Ultrafría', temperatura_k: 251, habitabilidad: 0.95 },
      { planeta: 'Kepler-452b', distancia_al: 1402, masa_tierra: 5.0, clase_estrella: 'Tipo Solar (G2V)', temperatura_k: 265, habitabilidad: 0.83 },
      { planeta: 'Kepler-186f', distancia_al: 582, masa_tierra: 1.4, clase_estrella: 'Enana Naranja', temperatura_k: 188, habitabilidad: 0.64 },
      { planeta: 'LHS 1140 b', distancia_al: 40.7, masa_tierra: 6.98, clase_estrella: 'Enana Roja', temperatura_k: 230, habitabilidad: 0.76 },
      { planeta: 'TOI-700 d', distancia_al: 101.4, masa_tierra: 1.72, clase_estrella: 'Enana Roja', temperatura_k: 269, habitabilidad: 0.88 },
      { planeta: 'Gliese 667 Cc', distancia_al: 23.6, masa_tierra: 3.8, clase_estrella: 'Sistema Múltiple', temperatura_k: 277, habitabilidad: 0.80 },
      { planeta: 'K2-18b', distancia_al: 124, masa_tierra: 8.6, clase_estrella: 'Enana Roja', temperatura_k: 279, habitabilidad: 0.73 },
      { planeta: 'HD 209458 b', distancia_al: 159, masa_tierra: 220, clase_estrella: 'Gigante Amarilla', temperatura_k: 1130, habitabilidad: 0.05 },
      { planeta: 'WASP-12b', distancia_al: 1410, masa_tierra: 440, clase_estrella: 'Enana Amarilla', temperatura_k: 2500, habitabilidad: 0.01 },
      { planeta: 'Kepler-22b', distancia_al: 620, masa_tierra: 2.4, clase_estrella: 'Tipo Solar (G5V)', temperatura_k: 262, habitabilidad: 0.71 },
      { planeta: 'Ross 128 b', distancia_al: 11.0, masa_tierra: 1.4, clase_estrella: 'Enana Roja Tranquila', temperatura_k: 280, habitabilidad: 0.86 },
    ],
  },
];
