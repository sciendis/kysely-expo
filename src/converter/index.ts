import {
  isStringBoolean,
  isStringIso8601,
  isStringJson,
  isUint8Array,
} from "../helpers";

export type SQLiteValue = string | number | null | boolean | Uint8Array;

const serialize = (parameters: unknown[]): SQLiteValue[] => {
  return parameters.map((parameter) => {
    if (parameter instanceof Date) {
      return parameter.toISOString();
    } else if (isUint8Array(parameter)) {
      return parameter as Uint8Array;
    } else if (parameter === null || parameter === undefined) {
      return null;
    } else if (typeof parameter === "object") {
      return JSON.stringify(parameter);
    } else if (typeof parameter === "boolean") {
      return parameter ? "true" : "false"; // SQLite booleans must be stored a strings.
    } else if (typeof parameter === "string") {
      return parameter as string;
    } else {
      console.warn("unknown type", typeof parameter);
      return parameter as string; // this might be sketch.
    }
  });
};

const deserialize = <T>(rows: any[]): any[] => {
  const typeMapping = typeIntrospection(rows[0]);

  const processed = rows.map((row) => {
    for (const key in row) {
      const value = row[key];

      if (value === null || value === undefined) {
        continue;
      }

      const type = typeMapping.get(key);

      if (type === "datetime") {
        row[key] = new Date(value);
      } else if (type === "boolean") {
        row[key] = value === "true" ? true : false;
      } else if (type === "object") {
        row[key] = JSON.parse(value);
      } else if (type === "null") {
        row[key] = null;
      } else if (type === "number") {
        row[key] = Number(value);
      } else if (type === "string") {
        row[key] = String(value);
      } else if (type === "blob") {
        row[key] = value as Uint8Array;
      } else {
        throw new Error("unknown type: " + type);
      }
    }

    return row;
  });

  return processed;
};

type ValidTypes =
  | "invalid"
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "null"
  | "blob"
  | "datetime";

// Reverse SQLite affinity mapping.
// https://www.sqlite.org/datatype3.html#affinity_name_examples
const typeIntrospection = (map: object): Map<string, ValidTypes> => {
  if (map === null || map === undefined) {
    return new Map();
  }

  const typeMapping = new Map<string, ValidTypes>();

  Object.keys(map).forEach((key) => {
    //@ts-ignore - the type must be discovered dynamically.
    const value = map[key];

    if (typeof value === "string") {
      if (isStringIso8601(value)) {
        typeMapping.set(key, "datetime");
      } else if (isStringBoolean(value)) {
        typeMapping.set(key, "boolean");
      } else if (isStringJson(value)) {
        typeMapping.set(key, "object");
      } else {
        typeMapping.set(key, "string");
      }
    } else if (typeof value === "number") {
      typeMapping.set(key, "number");
    } else if (typeof value === "boolean") {
      typeMapping.set(key, "boolean");
    } else if (isUint8Array(value)) {
      typeMapping.set(key, "blob");
    } else if (typeof value === "object") {
      typeMapping.set(key, "object");
    } else if (typeof value === "undefined" || value === null) {
      typeMapping.set(key, "null");
    } else {
      throw new Error("Unknown type:" + typeof value);
    }
  });

  const numKeys = Object.keys(map).length;
  if (numKeys !== typeMapping.size) {
    throw new Error("numKeys != typeMapping.length");
  }

  return typeMapping;
};

export { serialize, deserialize };
