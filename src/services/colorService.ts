export interface EditorialPalette {
  id: string;
  name: string;
  subtitle: string;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'color-dodge';
  colors: string[];
  background: string;
}

export const EDITORIAL_PALETTES: EditorialPalette[] = [
  {
    id: 'swiss-editorial',
    name: 'Swiss International',
    subtitle: 'High-contrast modernist print aesthetic',
    blendMode: 'multiply',
    colors: [
      '#e63946', // Swiss vermilion
      '#1d3557', // Deep prussian blue
      '#457b9d', // Steel slate
      '#2a9d8f', // Alpine pine
      '#f4a261', // Warm ochre
      '#e76f51', // Burnt terracotta
    ],
    background: '#0e1117',
  },
  {
    id: 'risograph',
    name: 'Risograph Workshop',
    subtitle: 'Vibrant overlapping semi-translucent inks',
    blendMode: 'multiply',
    colors: [
      '#ff2a85', // Riso Fluro Pink
      '#0078bf', // Medium Blue
      '#ffe800', // Yellow
      '#00a95c', // Spearmint
      '#ff6600', // Orange
      '#925bb0', // Orchid
    ],
    background: '#0d1017',
  },
  {
    id: 'cyber-slate',
    name: 'Cybernetic Slate',
    subtitle: 'Luminous phosphors on titanium alloy',
    blendMode: 'screen',
    colors: [
      '#00f0ff', // Electric Cyan
      '#7928ca', // Violet Laser
      '#00dfa2', // Neon Mint
      '#ff007f', // Deep Fuchsia
      '#f5a623', // Amber Ion
      '#50e3c2', // Ice Aurora
    ],
    background: '#0b0c10',
  },
  {
    id: 'monospaced-amber',
    name: 'Monospaced Terminal',
    subtitle: 'Phosphor cathode monitors and telemetry dials',
    blendMode: 'screen',
    colors: [
      '#ffb000', // Amber Phosphor
      '#33ff33', // P1 Green
      '#00ffff', // Cyan Telemetry
      '#ff3333', // Alert Red
      '#ffff33', // Solar Yellow
      '#3399ff', // Deep Radar
    ],
    background: '#0a0d0a',
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

  /**
   * Deterministically maps a category string to an editorial color
   */
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
