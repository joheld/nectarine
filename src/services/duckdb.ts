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

  public async init(): Promise<void> {
    await this.getDB();
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
}

export const duckdbService = new DuckDBManager();
