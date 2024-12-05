import { SQLiteOpenOptions } from "expo-sqlite";

import { ColumnNameBasedConverter } from "./column-name-based-converter";
import { OnError } from "./error-type";

export type ExpoDialectConfig = {
    // Name of the database file.
    database: string;
    sQLiteOpenOptions?: SQLiteOpenOptions;
    // Disable foreign key constraints. i.e. insert a row with a non-existing foreign key.
    disableForeignKeys?: boolean;
    // Disable STRICT mode when creating tables.
    disableStrictModeCreateTable?: boolean;
    debug?: boolean;
    autoAffinityConversion?: boolean;
    columnNameBasedConversion?: ColumnNameBasedConverter[];
    onError?: OnError;
};
