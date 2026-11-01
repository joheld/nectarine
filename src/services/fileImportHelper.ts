import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, readFile } from '@tauri-apps/plugin-fs';
import { duckdbService } from './duckdb';

export async function processDataFile(
  file: File | { name: string; path: string },
  onLoaded: (name: string, rows: Record<string, any>[]) => void
): Promise<void> {
  const filename = file.name;

  if ('path' in file && typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
    // Native Tauri FS read
    if (filename.endsWith('.parquet')) {
      const buffer = await readFile(file.path);
      const rows = await duckdbService.ingestParquet(filename, buffer);
      onLoaded(filename, rows);
    } else if (filename.endsWith('.json')) {
      const text = await readTextFile(file.path);
      const rows = await duckdbService.ingestJSON(filename, text);
      onLoaded(filename, rows);
    } else {
      const text = await readTextFile(file.path);
      const rows = await duckdbService.ingestCSV(filename, text);
      onLoaded(filename, rows);
    }
  } else if (file instanceof File) {
    // Web File API read
    if (filename.endsWith('.parquet')) {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const rows = await duckdbService.ingestParquet(filename, buffer);
      onLoaded(filename, rows);
    } else if (filename.endsWith('.json')) {
      const text = await file.text();
      const rows = await duckdbService.ingestJSON(filename, text);
      onLoaded(filename, rows);
    } else {
      const text = await file.text();
      const rows = await duckdbService.ingestCSV(filename, text);
      onLoaded(filename, rows);
    }
  }
}

export async function openNativeFileDialog(
  onLoaded: (name: string, rows: Record<string, any>[]) => void,
  fallbackInput?: HTMLInputElement | null
): Promise<void> {
  try {
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Archivos de Datos (CSV, JSON, Parquet)',
            extensions: ['csv', 'json', 'parquet'],
          },
        ],
      });

      if (selected && typeof selected === 'string') {
        const filename = selected.split('/').pop() || 'data';
        await processDataFile({ name: filename, path: selected }, onLoaded);
        return;
      }
    }
  } catch (err) {
    console.warn('Tauri native dialog unavailable, opening browser file picker:', err);
  }

  // Fallback to HTML input
  fallbackInput?.click();
}
