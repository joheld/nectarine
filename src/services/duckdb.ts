import * as duckdb from '@duckdb/duckdb-wasm';

class DuckDBManager {
  private db: duckdb.AsyncDuckDB | null = null;
  private conn: duckdb.AsyncDuckDBConnection | null = null;
  private initPromise: Promise<duckdb.AsyncDuckDB> | null = null;

  public async getDB(): Promise<duckdb.AsyncDuckDB> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const workerUrl = '/duckdb/duckdb-browser-eh.worker.js';
        const wasmUrl = '/duckdb/duckdb-eh.wasm';

        const worker = new Worker(workerUrl, { type: 'module' });
        const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
        const db = new duckdb.AsyncDuckDB(logger, worker);

        await db.instantiate(wasmUrl);
        this.db = db;
        this.conn = await db.connect();
        return db;
      } catch (localErr) {
        console.warn('Local DuckDB WASM load failed, falling back to CDN bundles:', localErr);
        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

        const worker_url = URL.createObjectURL(
          new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
        );
        const worker = new Worker(worker_url);
        const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
        const db = new duckdb.AsyncDuckDB(logger, worker);

        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        URL.revokeObjectURL(worker_url);

        this.db = db;
        this.conn = await db.connect();
        return db;
      }
    })();

    return this.initPromise;
  }

  public async getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
    await this.getDB();
    if (!this.conn) {
      if (!this.db) throw new Error('DuckDB initialization failed');
      this.conn = await this.db.connect();
    }
    return this.conn;
  }

  public async ingestCSV(filename: string, text: string): Promise<Record<string, any>[]> {
    const db = await this.getDB();
    const conn = await this.getConnection();

    await db.registerFileText(filename, text);
    await conn.query(`DROP TABLE IF EXISTS dataset;`);
    await conn.query(`CREATE TABLE dataset AS SELECT * FROM read_csv_auto('${filename}');`);

    return this.query('SELECT * FROM dataset LIMIT 15000;');
  }

  public async ingestJSON(filename: string, text: string): Promise<Record<string, any>[]> {
    const db = await this.getDB();
    const conn = await this.getConnection();

    await db.registerFileText(filename, text);
    await conn.query(`DROP TABLE IF EXISTS dataset;`);
    await conn.query(`CREATE TABLE dataset AS SELECT * FROM read_json_auto('${filename}');`);

    return this.query('SELECT * FROM dataset LIMIT 15000;');
  }

  public async ingestParquet(filename: string, buffer: Uint8Array): Promise<Record<string, any>[]> {
    const db = await this.getDB();
    const conn = await this.getConnection();

    await db.registerFileBuffer(filename, buffer);
    await conn.query(`DROP TABLE IF EXISTS dataset;`);
    await conn.query(`CREATE TABLE dataset AS SELECT * FROM read_parquet('${filename}');`);

    return this.query('SELECT * FROM dataset LIMIT 15000;');
  }

  public async query(sql: string): Promise<Record<string, any>[]> {
    const conn = await this.getConnection();
    const result = await conn.query(sql);

    const rows: Record<string, any>[] = [];
    const fields = result.schema.fields.map((f) => f.name);

    for (let i = 0; i < result.numRows; i++) {
      const row: Record<string, any> = {};
      for (const field of fields) {
        const val = result.getChild(field)?.get(i);
        row[field] = typeof val === 'bigint' ? Number(val) : val;
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * Sample 1: Países y Economía
   */
  public async loadDefaultDataset(): Promise<Record<string, any>[]> {
    const sampleCSV = `pais,region,ingreso_anual,esperanza_vida,co2_por_persona,habitantes_millones
Suiza,Europa,87500,83.8,4.2,8.7
Noruega,Europa,82100,83.2,7.3,5.4
Singapur,Asia,72800,83.6,8.5,5.9
Estados Unidos,América,70200,77.3,14.4,333.3
Dinamarca,Europa,67800,81.4,5.1,5.9
Países Bajos,Europa,58200,81.7,8.2,17.7
Alemania,Europa,51200,80.9,7.9,83.2
Japón,Asia,39300,84.6,8.6,125.1
Reino Unido,Europa,46500,81.2,5.2,67.3
Francia,Europa,43600,82.5,4.6,67.9
Corea del Sur,Asia,35000,83.5,11.8,51.7
Italia,Europa,35600,82.9,5.3,58.9
España,Europa,30100,83.3,5.1,47.4
Chile,América,15400,79.5,4.3,19.5
Costa Rica,América,12500,80.4,1.6,5.2
Uruguay,América,17300,78.2,2.0,3.4
Botsuana,África,7700,61.1,3.2,2.6
Ruanda,África,960,66.1,0.1,13.8
Ghana,África,2440,63.8,0.6,33.5
Vietnam,Asia,4160,73.6,3.0,98.2
India,Asia,2380,70.2,1.9,1417.2
Brasil,América,8920,72.8,2.1,215.3
México,América,11090,70.2,3.6,128.5
Canadá,América,52700,82.7,14.3,38.9
Australia,Oceanía,64500,83.2,15.1,25.7
Nueva Zelanda,Oceanía,48800,82.5,6.6,5.1
Finlandia,Europa,53600,82.0,6.8,5.5
Suecia,Europa,56400,83.2,3.4,10.5
Austria,Europa,53300,81.6,7.1,8.9
Irlanda,Europa,104000,82.1,7.2,5.1`;

    return this.ingestCSV('paises_y_desarrollo.csv', sampleCSV);
  }

  /**
   * Sample 2: Ventas de Productos
   */
  public async loadSalesDataset(): Promise<Record<string, any>[]> {
    const sampleCSV = `producto,categoria,precio,unidades_vendidas,satisfaccion
Laptop Pro,Computación,1450,320,4.8
Monitor 4K,Periféricos,480,850,4.6
Teclado Mecánico,Periféricos,120,2400,4.9
Mouse Inalámbrico,Periféricos,75,3100,4.5
Tablet Touch,Móvil,650,1100,4.3
Teléfono Max,Móvil,980,1850,4.7
Auriculares ANC,Audio,250,2900,4.8
Parlante Portátil,Audio,110,1950,4.4
Cámara 4K,Video,850,420,4.5
Micrófono Estudio,Audio,160,1350,4.7
Mochila Tech,Accesorios,85,2200,4.8
Hub USB-C,Accesorios,45,4100,4.2`;

    return this.ingestCSV('ventas_tecnologia.csv', sampleCSV);
  }
}

export const duckdbService = new DuckDBManager();
