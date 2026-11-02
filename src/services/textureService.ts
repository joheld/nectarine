import { StudioFinish } from '../engine/types';

export interface StudioFinishOption {
  id: StudioFinish;
  label: string;
  description: string;
  iconName: string;
}

export const STUDIO_FINISHES: StudioFinishOption[] = [
  {
    id: 'clean',
    label: 'Vectorial Puro',
    description: 'Trazados digitales perfectos de contorno afilado y sin texturas añadidas',
    iconName: 'Sparkles',
  },
  {
    id: 'risograph',
    label: 'Grano Risográfico',
    description: 'Textura analógica de tinta densa y grano de serigrafía editorial con micro-ruido',
    iconName: 'Waves',
  },
  {
    id: 'halftone',
    label: 'Trama de Semitonos (Halftone)',
    description: 'Patrón de imprenta litográfica y fotomecánica de prensa tradicional',
    iconName: 'Grid',
  },
  {
    id: 'paper',
    label: 'Papel de Algodón',
    description: 'Rugosidad táctil de grabado prensado en frío con micro-relieve de fibra',
    iconName: 'Layers',
  },
];

class TextureService {
  private activeFinish: StudioFinish = 'clean';
  private listeners: ((finish: StudioFinish) => void)[] = [];

  public getActiveFinish(): StudioFinish {
    return this.activeFinish;
  }

  public setFinish(finish: StudioFinish): void {
    this.activeFinish = finish;
    this.listeners.forEach((listener) => listener(finish));
  }

  public subscribe(listener: (finish: StudioFinish) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getFilterId(finish: StudioFinish = this.activeFinish): string | undefined {
    switch (finish) {
      case 'risograph':
        return 'url(#studio-finish-risograph)';
      case 'paper':
        return 'url(#studio-finish-paper)';
      default:
        return undefined;
    }
  }
}

export const textureService = new TextureService();
