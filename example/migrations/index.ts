import { Kysely, Migrator, sql } from "kysely";

import { ExpoMigrationProvider } from "kysely-expo";
import { Database } from "../screens/main";
import { SQLiteTypes } from "kysely-expo/src/types/sqlite-types";

export const getMigrator = (database: Kysely<Database>) =>
  new Migrator({
    db: database,
    provider: new ExpoMigrationProvider({
      migrations: {
        "1": {
          up: async (db: Kysely<Database>) => {
            console.log("running migration 1");

            try {
              sql`begin transaction;`;

              await db.schema
                .createTable("brands")
                .addColumn("id", "integer", (col) =>
                  col.primaryKey().autoIncrement(),
                )
                .addColumn("name", SQLiteTypes.String, (col) =>
                  col.notNull().unique(),
                )
                .addColumn("created_at", SQLiteTypes.DateTime, (col) =>
                  col.notNull(),
                )
                .addColumn("is_active", SQLiteTypes.Boolean, (col) =>
                  col.notNull(),
                )
                .ifNotExists()
                .execute();

              // Seed brands

              const brands = [
                { name: "Apple", created_at: new Date(), is_active: true },
                { name: "Samsung", created_at: new Date(), is_active: true },
                { name: "Google", created_at: new Date(), is_active: true },
              ];

              await db.insertInto("brands").values(brands).execute();

              await db.schema
                .createTable("phones")
                .addColumn("id", "integer", (col) =>
                  col.primaryKey().autoIncrement(),
                )
                .addColumn("brand_id", "integer", (col) =>
                  col.notNull().references("brands.id"),
                )
                .addColumn("name", SQLiteTypes.String, (col) =>
                  col.notNull().unique(),
                )
                .addColumn("created_at", SQLiteTypes.DateTime, (col) =>
                  col.notNull(),
                )
                .addColumn("is_active", SQLiteTypes.Boolean, (col) =>
                  col.notNull(),
                )
                .addColumn("meta_json", SQLiteTypes.Json, (col) =>
                  col.notNull(),
                )
                .execute();

              // Seed phones

              const phones = [
                {
                  brand_id: 1,
                  name: "iPhone 12",
                  created_at: new Date(),
                  is_active: true,
                  meta_json: {
                    foo: "bar",
                    bar: 1,
                  },
                },
                {
                  brand_id: 1,
                  name: "iPhone 12 Pro",
                  created_at: new Date(),
                  is_active: true,
                  meta_json: {
                    foo: "bar",
                    bar: 1,
                  },
                },
                {
                  brand_id: 2,
                  name: "Galaxy S21",
                  created_at: new Date(),
                  is_active: true,
                  meta_json: {
                    foo: "bar",
                    bar: 1,
                  },
                },
                {
                  brand_id: 2,
                  name: "Galaxy S21+",
                  created_at: new Date(),
                  is_active: true,
                  meta_json: {
                    foo: "bar",
                    bar: 1,
                  },
                },

                {
                  brand_id: 3,
                  name: "Pixel 5",
                  created_at: new Date(),
                  is_active: true,
                  meta_json: {
                    foo: "bar",
                    bar: 1,
                  },
                },
                {
                  brand_id: 3,
                  name: "Pixel 4a 5G",
                  created_at: new Date(),
                  is_active: true,
                  meta_json: {
                    foo: "bar",
                    bar: 1,
                  },
                },
              ];

              await db.insertInto("phones").values(phones).execute();

              sql`commit;`;
            } catch (error) {
              console.error("rolling back:", error);
              sql`rollback;`;

              throw error;
            }
          },
        },
      },
    }),
  });