import {
  Kysely,
  DatabaseIntrospector,
  DialectAdapter,
  Driver,
  QueryCompiler,
  DatabaseConnection,
  SqliteIntrospector,
  SqliteQueryCompiler,
  SqliteAdapter,
  QueryResult,
  Dialect,
  CompiledQuery,
} from "kysely";
import * as SQLite from "expo-sqlite";
import { ExpoDialectConfig } from "./types/expo-dialect-config";

import { deserialize, serialize } from "./converter";
import { firstElementOrNull } from "./helpers";

/**
 * Expo dialect for Kysely.
 */
export class ExpoDialect implements Dialect {
  config: ExpoDialectConfig;

  constructor(config: ExpoDialectConfig) {
    this.config = config;
  }

  createDriver(): ExpoDriver {
    return new ExpoDriver(this.config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createAdapter(): DialectAdapter {
    return new SqliteAdapter();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new SqliteIntrospector(db);
  }
}

/**
 * Expo driver for Kysely.
 */
export class ExpoDriver implements Driver {
  readonly #connectionMutex = new ConnectionMutex();
  readonly #connection: ExpoConnection;

  constructor(config: ExpoDialectConfig) {
    this.#connection = new ExpoConnection(config);
  }

  async releaseConnection(): Promise<void> {
    this.#connectionMutex.unlock();
  }

  async init(): Promise<void> {}

  async acquireConnection(): Promise<ExpoConnection> {
    await this.#connectionMutex.lock();
    return this.#connection;
  }

  async beginTransaction(connection: ExpoConnection): Promise<void> {
    await connection.directQuery("begin transaction");
  }

  async commitTransaction(connection: ExpoConnection): Promise<void> {
    await connection.directQuery("commit");
  }

  async rollbackTransaction(connection: ExpoConnection): Promise<void> {
    await connection.directQuery("rollback");
  }

  async destroy(): Promise<void> {
    this.#connection.closeConnection();
  }

  async getDatabaseRuntimeVersion() {
    try {
      const res = await this.#connection.directQuery(
        "select sqlite_version() as version;",
      );

      return res.rows[0].version;
    } catch (e) {
      console.error(e);
      return "unknown";
    }
  }
}

/**
 * Expo connection for Kysely.
 */
class ExpoConnection implements DatabaseConnection {
  sqlite: SQLite.SQLiteDatabase;
  debug: boolean;
  config: ExpoDialectConfig;

  constructor(config: ExpoDialectConfig) {
    this.sqlite = SQLite.openDatabase(config.database);
    this.debug = config.debug ?? false;

    if (!config.disableForeignKeys) {
      this.directQuery("PRAGMA foreign_keys = ON;");
    }

    if (!config.disableWal) {
      this.directQuery("PRAGMA journal_mode = WAL;");
    }

    this.config = config;
  }

  async closeConnection(): Promise<void> {
    return this.sqlite.closeAsync();
  }

  isError(
    rs: SQLite.ResultSetError | SQLite.ResultSet,
  ): rs is SQLite.ResultSetError {
    return "error" in rs;
  }

  isResult(
    rs: SQLite.ResultSetError | SQLite.ResultSet,
  ): rs is SQLite.ResultSet {
    return "rows" in rs;
  }

  async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
    let { sql, parameters, query } = compiledQuery;

    // Kysely uses varchar(255) as the default string type which not supported by STRICT mode.
    if (
      query.kind === "CreateTableNode" &&
      !sql.includes("kysely_migration") &&
      !sql.includes("kysely_migration_lock") &&
      !sql.includes("STRICT") &&
      !this.config.disableStrictModeCreateTable
    ) {
      sql += " STRICT";
    }

    const readonly =
      query.kind === "SelectQueryNode" || query.kind === "RawNode";

    const transformedParameters = serialize([...parameters]);

    if (this.debug) {
      console.debug(`${query.kind}${readonly ? " (readonly)" : ""}: ${sql}`);
    }

    const res = firstElementOrNull(
      await this.sqlite.execAsync(
        [{ sql: sql, args: transformedParameters }],
        readonly,
      ),
    );

    if (this.isError(res)) {
      throw new Error(res.error.message);
    } else if (this.isResult(res)) {
      if (readonly) {
        return this.config.autoAffinityConversion
          ? deserialize(res.rows)
          : (res as unknown as QueryResult<R>);
      } else {
        const queryResult = {
          numUpdatedOrDeletedRows: BigInt(res.rowsAffected),
          numAffectedRows: BigInt(res.rowsAffected),
          insertId: res.insertId ? BigInt(res.insertId) : undefined,
          rows: res.rows as unknown as R[],
        } satisfies QueryResult<R>;

        if (this.debug) console.log("queryResult", queryResult);

        return queryResult;
      }
    } else {
      throw new Error("Unknown result type");
    }
  }

  async directQuery(query: string): Promise<SQLite.ResultSet> {
    const res = firstElementOrNull(
      await this.sqlite.execAsync([{ sql: query, args: [] }], false),
    );

    if (this.isError(res)) {
      throw new Error(res.error.message);
    }

    return res as SQLite.ResultSet;
  }

  streamQuery<R>(
    compiledQuery: CompiledQuery,
    chunkSize?: number,
  ): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("Sqlite driver doesn't support streaming");
  }
}

class ConnectionMutex {
  #promise?: Promise<void>;
  #resolve?: () => void;

  async lock(): Promise<void> {
    while (this.#promise) {
      await this.#promise;
    }

    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }

  unlock(): void {
    const resolve = this.#resolve;

    this.#promise = undefined;
    this.#resolve = undefined;

    resolve?.();
  }
}
