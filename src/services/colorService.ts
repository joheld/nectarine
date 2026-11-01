export interface EditorialPalette {
  id: string;
  name: string;
  subtitle: string;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'color-dodge';
  colors: string[];
  backgroundLight: string;
  backgroundDark: string;
}

export const EDITORIAL_PALETTES: EditorialPalette[] = [
  {
    id: 'visual-cinnamon',
    name: 'Visual Cinnamon & Cosmos',
    subtitle: 'Inspirada en las obras cósmicas y florales de Nadieh Bremer',
    blendMode: 'multiply',
    colors: [
      '#c2410c', // Canela Ceilán
      '#1e3a8a', // Azul Celestial Profundo
      '#f59e0b', // Oro Estelar
      '#f43f5e', // Rosa Sakura
      '#0d9488', // Aurora Boreal
      '#7c3aed', // Amatista Cósmico
      '#0284c7', // Celeste Puro
      '#b45309', // Caramelo Tostado
    ],
    backgroundLight: '#fffdf9',
    backgroundDark: '#0b0f19',
  },
  {
    id: 'editorial-swiss',
    name: 'Suiza Clásica',
    subtitle: 'Diseño editorial limpio con alto contraste',
    blendMode: 'normal',
    colors: [
      '#e63946', // Vermellón
      '#1d3557', // Azul Marino
      '#2a9d8f', // Turquesa Pino
      '#e76f51', // Terracota
      '#457b9d', // Acero Suave
      '#7b2cbf', // Violeta Real
    ],
    backgroundLight: '#ffffff',
    backgroundDark: '#0e1117',
  },
  {
    id: 'risograph',
    name: 'Taller Risografía',
    subtitle: 'Tintas orgánicas semitranslúcidas tipo imprenta',
    blendMode: 'multiply',
    colors: [
      '#ff2a85', // Rosa Flúor
      '#0078bf', // Azul Riso
      '#f59e0b', // Amarillo Dorado
      '#10b981', // Menta
      '#f97316', // Naranja Vivo
      '#8b5cf6', // Lavanda
    ],
    backgroundLight: '#fafafa',
    backgroundDark: '#0d1017',
  },
  {
    id: 'nordic-minimal',
    name: 'Nórdico Calmo',
    subtitle: 'Tonos naturales y relajantes para lectura prolongada',
    blendMode: 'normal',
    colors: [
      '#3b82f6', // Azul Cielo
      '#14b8a6', // Jade
      '#84cc16', // Lima Suave
      '#f43f5e', // Coral
      '#a855f7', // Amatista
      '#64748b', // Pizarra
    ],
    backgroundLight: '#f8fafc',
    backgroundDark: '#0f172a',
  },
  {
    id: 'monospaced-amber',
    name: 'Laboratorio',
    subtitle: 'Paleta técnica de alta visibilidad',
    blendMode: 'normal',
    colors: [
      '#d97706', // Ámbar
      '#059669', // Esmeralda
      '#2563eb', // Cobalto
      '#dc2626', // Rubí
      '#7c3aed', // Púrpura
      '#0891b2', // Cian
    ],
    backgroundLight: '#ffffff',
    backgroundDark: '#0a0d0a',
  },
];

class ColorService {
  private currentPalette: EditorialPalette = EDITORIAL_PALETTES[0];

  public getPalette(): EditorialPalette {
    return this.currentPalette;
  }

  public setPalette(paletteId: string): EditorialPalette {
    const found = EDITORIAL_PALETTES.find((p) => p.id === paletteId);
    if (found) {
      this.currentPalette = found;
    }
    return this.currentPalette;
  }

  public getColorForCategory(category: string, indexOffset = 0): string {
    const colors = this.currentPalette.colors;
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = (hash << 5) - hash + category.charCodeAt(i);
      hash |= 0;
    }
    const idx = (Math.abs(hash) + indexOffset) % colors.length;
    return colors[idx];
  }

  public getBlendMode(): string {
    return this.currentPalette.blendMode;
  }
}

export const colorService = new ColorService();
