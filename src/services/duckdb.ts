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
        // Attempt local offline bundle loading first
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
        // Fallback to official CDN bundle
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

  /**
   * Ingests CSV content into an in-memory table named 'dataset'
   */
  public async ingestCSV(filename: string, text: string): Promise<Record<string, any>[]> {
    const db = await this.getDB();
    const conn = await this.getConnection();

    await db.registerFileText(filename, text);
    await conn.query(`DROP TABLE IF EXISTS dataset;`);
    await conn.query(`CREATE TABLE dataset AS SELECT * FROM read_csv_auto('${filename}');`);

    return this.query('SELECT * FROM dataset LIMIT 15000;');
  }

  /**
   * Ingests JSON text content
   */
  public async ingestJSON(filename: string, text: string): Promise<Record<string, any>[]> {
    const db = await this.getDB();
    const conn = await this.getConnection();

    await db.registerFileText(filename, text);
    await conn.query(`DROP TABLE IF EXISTS dataset;`);
    await conn.query(`CREATE TABLE dataset AS SELECT * FROM read_json_auto('${filename}');`);

    return this.query('SELECT * FROM dataset LIMIT 15000;');
  }

  /**
   * Ingests Parquet binary buffer
   */
  public async ingestParquet(filename: string, buffer: Uint8Array): Promise<Record<string, any>[]> {
    const db = await this.getDB();
    const conn = await this.getConnection();

    await db.registerFileBuffer(filename, buffer);
    await conn.query(`DROP TABLE IF EXISTS dataset;`);
    await conn.query(`CREATE TABLE dataset AS SELECT * FROM read_parquet('${filename}');`);

    return this.query('SELECT * FROM dataset LIMIT 15000;');
  }

  /**
   * Executes arbitrary SQL query and returns JS objects
   */
  public async query(sql: string): Promise<Record<string, any>[]> {
    const conn = await this.getConnection();
    const result = await conn.query(sql);

    // Convert Arrow table to JSON rows
    const rows: Record<string, any>[] = [];
    const fields = result.schema.fields.map((f) => f.name);

    for (let i = 0; i < result.numRows; i++) {
      const row: Record<string, any> = {};
      for (const field of fields) {
        const val = result.getChild(field)?.get(i);
        // Handle BigInt / timestamps serializable to number/string
        row[field] = typeof val === 'bigint' ? Number(val) : val;
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * Generates a rich default sample dataset with realistic multi-dimensional analytics
   */
  public async loadDefaultDataset(): Promise<Record<string, any>[]> {
    const sampleCSV = `country,region,gdp_per_capita,life_expectancy,carbon_emissions,population_millions,innovation_index
Switzerland,Western Europe,87500,83.8,4.2,8.7,65.8
Norway,Nordic,82100,83.2,7.3,5.4,56.4
Singapore,Southeast Asia,72800,83.6,8.5,5.9,61.5
United States,North America,70200,77.3,14.4,333.3,61.8
Denmark,Nordic,67800,81.4,5.1,5.9,59.3
Netherlands,Western Europe,58200,81.7,8.2,17.7,58.7
Germany,Western Europe,51200,80.9,7.9,83.2,57.2
Japan,East Asia,39300,84.6,8.6,125.1,53.8
United Kingdom,Western Europe,46500,81.2,5.2,67.3,59.8
France,Western Europe,43600,82.5,4.6,67.9,54.2
South Korea,East Asia,35000,83.5,11.8,51.7,59.3
Italy,Southern Europe,35600,82.9,5.3,58.9,46.1
Spain,Southern Europe,30100,83.3,5.1,47.4,45.8
Chile,South America,15400,79.5,4.3,19.5,33.8
Costa Rica,Central America,12500,80.4,1.6,5.2,31.2
Uruguay,South America,17300,78.2,2.0,3.4,30.5
Botswana,Sub-Saharan Africa,7700,61.1,3.2,2.6,23.1
Rwanda,Sub-Saharan Africa,960,66.1,0.1,13.8,21.5
Ghana,Sub-Saharan Africa,2440,63.8,0.6,33.5,19.8
Vietnam,Southeast Asia,4160,73.6,3.0,98.2,38.3
India,South Asia,2380,70.2,1.9,1417.2,36.6
Brazil,South America,8920,72.8,2.1,215.3,32.5
Mexico,North America,11090,70.2,3.6,128.5,31.0
Canada,North America,52700,82.7,14.3,38.9,53.1
Australia,Oceania,64500,83.2,15.1,25.7,51.5
New Zealand,Oceania,48800,82.5,6.6,5.1,47.0
Finland,Nordic,53600,82.0,6.8,5.5,58.4
Sweden,Nordic,56400,83.2,3.4,10.5,61.6
Austria,Western Europe,53300,81.6,7.1,8.9,53.9
Ireland,Western Europe,104000,82.1,7.2,5.1,50.7`;

    return this.ingestCSV('world_development.csv', sampleCSV);
  }
}

export const duckdbService = new DuckDBManager();
