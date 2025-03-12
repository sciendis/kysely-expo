import { Kysely, Migrator, sql } from "kysely";
import { ExpoMigrationProvider, SQLiteType } from "kysely-expo";

import { Database } from "../screens/main";

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
                                .addColumn("id", "integer", col => col.primaryKey().autoIncrement())
                                .addColumn("name", SQLiteType.String, col => col.notNull().unique())
                                .addColumn("created_at", SQLiteType.DateTime, col => col.notNull())
                                .addColumn("is_active", SQLiteType.Boolean, col => col.notNull())
                                .ifNotExists()
                                .execute();

                            // Seed brands

                            const brands = [
                                { name: "Apple", created_at: new Date(), is_active: true },
                                { name: "Samsung", created_at: new Date(), is_active: true },
                                { name: "Google", created_at: new Date(), is_active: true }
                            ];

                            await db.insertInto("brands").values(brands).execute();

                            await db.schema
                                .createTable("phones")
                                .addColumn("id", "integer", col => col.primaryKey().autoIncrement())
                                .addColumn("brand_id", "integer", col =>
                                    col.notNull().references("brands.id").onDelete("cascade")
                                )
                                .addColumn("name", SQLiteType.String, col => col.notNull().unique())
                                .addColumn("created_at", SQLiteType.DateTime, col => col.notNull())
                                .addColumn("is_active", SQLiteType.Boolean, col => col.notNull())
                                .addColumn("meta_json", SQLiteType.Json, col => col.notNull())
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
                                        bar: 1
                                    }
                                },
                                {
                                    brand_id: 1,
                                    name: "iPhone 12 Pro",
                                    created_at: new Date(),
                                    is_active: true,
                                    meta_json: {
                                        foo: "bar",
                                        bar: 1
                                    }
                                },
                                {
                                    brand_id: 2,
                                    name: "Galaxy S21",
                                    created_at: new Date(),
                                    is_active: true,
                                    meta_json: {
                                        foo: "bar",
                                        bar: 1
                                    }
                                },
                                {
                                    brand_id: 2,
                                    name: "Galaxy S21+",
                                    created_at: new Date(),
                                    is_active: true,
                                    meta_json: {
                                        foo: "bar",
                                        bar: 1
                                    }
                                },

                                {
                                    brand_id: 3,
                                    name: "Pixel 5",
                                    created_at: new Date(),
                                    is_active: true,
                                    meta_json: {
                                        foo: "bar",
                                        bar: 1
                                    }
                                },
                                {
                                    brand_id: 3,
                                    name: "Pixel 4a 5G",
                                    created_at: new Date(),
                                    is_active: true,
                                    meta_json: {
                                        foo: "bar",
                                        bar: 1
                                    }
                                }
                            ];

                            await db.insertInto("phones").values(phones).execute();

                            sql`commit;`;
                        } catch (error) {
                            console.error("rolling back:", error);
                            sql`rollback;`;

                            throw error;
                        }
                    }
                },
                "2": {
                    up: async (db: Kysely<Database>) => {
                        console.log("running migration 2");

                        await db.schema
                            .createTable("files")
                            .addColumn("id", SQLiteType.Integer, col =>
                                col.primaryKey().notNull().autoIncrement()
                            )
                            .addColumn("name", SQLiteType.String, col => col.notNull().unique())
                            .addColumn("mime_type", SQLiteType.String, col => col.notNull())
                            .addColumn("contents", SQLiteType.Blob, col => col.notNull())
                            .execute();
                    }
                },
                "3": {
                    up: async (db: Kysely<Database>) => {
                        console.log("running migration 3");

                        await db.schema
                            .createTable("type_tests")
                            .addColumn("id", SQLiteType.Integer, col =>
                                col.primaryKey().notNull().autoIncrement()
                            )
                            .addColumn("array_type", SQLiteType.Json, col => col.notNull())
                            .addColumn("record_type", SQLiteType.Json, col => col.notNull())
                            .addColumn("object_type", SQLiteType.Json, col => col.notNull())
                            .execute();
                    }
                },
                "4": {
                    up: async (db: Kysely<Database>) => {
                        console.log("running migration 4");

                        try {
                            sql`begin transaction;`;
                            await db.schema
                                .createTable("products")
                                .addColumn("productId", SQLiteType.String, col =>
                                    col.primaryKey().notNull()
                                )
                                .addColumn("itemNumber", SQLiteType.String, col => col.notNull())
                                .addColumn("description", SQLiteType.String)
                                .addColumn("additional", SQLiteType.String)
                                .addColumn("size", SQLiteType.String)
                                .addColumn("packageSize", SQLiteType.String)
                                .addColumn("pzn", SQLiteType.String)
                                .addColumn("category", SQLiteType.String)
                                .addColumn("categoryId", SQLiteType.String)
                                .addColumn("isLocked", SQLiteType.Boolean)
                                .addColumn("discontinued", SQLiteType.Boolean)
                                .addColumn("type", SQLiteType.String)
                                .ifNotExists()
                                .execute();

                            await db.schema
                                .createTable("orders")
                                .addColumn("orderId", SQLiteType.String, col =>
                                    col.primaryKey().notNull()
                                )
                                .addColumn("responsibleUserId", SQLiteType.String, col =>
                                    col.notNull()
                                )
                                .addColumn("externalDoctorId", SQLiteType.String, col =>
                                    col.notNull()
                                )
                                .addColumn("externalNursingId", SQLiteType.String, col =>
                                    col.notNull()
                                )
                                .addColumn("patientId", SQLiteType.String, col => col.notNull())
                                .addColumn("status", SQLiteType.String)
                                .addColumn("createdAt", SQLiteType.String)
                                .addColumn("patientName", SQLiteType.String)
                                .addColumn("prescriptionExists", SQLiteType.Boolean)
                                .addColumn("prescriptionPhotoUploaded", SQLiteType.Boolean)
                                .addColumn("addresses", SQLiteType.String)
                                .addColumn("items", SQLiteType.String)
                                .addColumn("comment", SQLiteType.String)
                                .addColumn("archived", SQLiteType.Boolean)
                                .addColumn("teamId", SQLiteType.String)
                                .addColumn("createdBy", SQLiteType.String)
                                .addColumn("shippedAt", SQLiteType.String)
                                .addColumn("deliveredAt", SQLiteType.String)
                                .addColumn("trackingLinks", SQLiteType.String)
                                .addColumn("signature", SQLiteType.String)
                                .addColumn("orderNumber", SQLiteType.String)
                                .addColumn("wundexId", SQLiteType.Integer)
                                .addColumn("staged", SQLiteType.Boolean)
                                .ifNotExists()
                                .execute();

                            await db.schema
                                .alterTable("orders")
                                .addColumn("deliveryNoticeIds", SQLiteType.String)
                                .execute();

                            await db.schema
                                .alterTable("orders")
                                .addColumn("inactive", SQLiteType.Boolean)
                                .execute();

                            await db.schema
                                .alterTable("orders")
                                .addColumn("acribaId", SQLiteType.String)
                                .execute();

                            await db.schema
                                .createTable("patients")
                                .addColumn("patientId", SQLiteType.String, col =>
                                    col.primaryKey().notNull()
                                )
                                .addColumn("name", SQLiteType.String, col => col.notNull())
                                .addColumn("created", SQLiteType.Boolean)
                                .addColumn("staged", SQLiteType.Boolean)
                                .addColumn("deleted", SQLiteType.Boolean)
                                .addColumn("archived", SQLiteType.Boolean, col => col.notNull())
                                .execute();

                            await db
                                .insertInto("patients")
                                .values([
                                    {
                                        patientId: "abc1",
                                        name: "ABC",
                                        created: true,
                                        staged: false,
                                        deleted: null,
                                        archived: false
                                    },
                                    {
                                        patientId: "abc2",
                                        name: "DEF",
                                        created: false,
                                        staged: false,
                                        deleted: null,
                                        archived: false
                                    },
                                    {
                                        patientId: "abc3",
                                        name: "GHI",
                                        created: null,
                                        staged: null,
                                        deleted: null,
                                        archived: true
                                    }
                                ])
                                .execute();
                            sql`commit;`;
                        } catch (error) {
                            console.error("rolling back:", error);
                            sql`rollback;`;

                            throw error;
                        }
                    }
                }
            }
        })
    });
