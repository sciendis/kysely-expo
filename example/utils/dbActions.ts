import { Kysely, sql } from "kysely";
import { Database } from "../screens/main";
import runner from "../tests";

const getRandomNumberBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

export const handleInsertPatient = async (database: Kysely<Database>) => {
    database
        .insertInto("patients")
        .values([
            {
                patientId: "abc1",
                name: "ABC",
                created: true,
                staged: false,
                deleted: null,
                archived: false,
                testNr: null
            }
        ])
        .execute()
        .then(result => {
            console.log(`Inserted record with primary key: ${result[0].insertId}`);
        }, console.error);
};
export const handleInsert = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const values = {
        name: "iPhone " + getRandomNumberBetween(3, 8),
        brand_id: 1,
        created_at: new Date(),
        is_active: false,
        meta_json: {
            foo: "bar",
            bar: 1
        }
    };

    database
        .insertInto("phones")
        .values(values)
        .execute()
        .then(result => {
            setConsoleText(`Inserted record with primary key: ${result[0].insertId}`);
        }, console.error);
};

export const handleSelect = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const phones = await database
        .selectFrom("phones")
        .innerJoin("brands", "phones.brand_id", "brands.id")
        .select([
            "phones.id",
            "phones.meta_json",
            sql<string>`upper(brands.name)`.as("brand"),
            "phones.name",
            "phones.created_at",
            "phones.is_active"
        ])
        .orderBy("phones.name", "asc")
        .execute();

    console.log(phones);

    const text = phones.map(phone => `${phone.name} ${phone.brand}`).join("\n");

    setConsoleText(text);
};

export const handleSelectStream = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const stream = await database
        .selectFrom("phones")
        .innerJoin("brands", "phones.brand_id", "brands.id")
        .select([
            "phones.meta_json",
            sql<string>`upper(brands.name)`.as("brand"),
            "phones.name",
            "phones.created_at",
            "phones.is_active"
        ])
        .orderBy("phones.name", "asc")
        .stream();

    for await (const phone of stream) {
        console.log(phone);
    }
};

export const handleDelete = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const record = await database.selectFrom("phones").select(["id"]).limit(1).executeTakeFirst();

    if (record !== undefined) {
        await database.deleteFrom("phones").where("id", "=", record.id).execute();

        setConsoleText(`Deleted record with primary key: ${record.id}`);
    } else {
        setConsoleText("No records to delete");
    }
};

// Test cascade delete
export const handleDeleteBrand = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const record = await database.selectFrom("brands").select(["id"]).limit(1).executeTakeFirst();

    if (record !== undefined) {
        await database.deleteFrom("brands").where("id", "=", record.id).execute();

        setConsoleText(`Deleted record with primary key: ${record.id}`);
    } else {
        setConsoleText("No records to delete");
    }
};

export const handleUpdate = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const record = await database
        .updateTable("phones")
        .set({ created_at: new Date() })
        .executeTakeFirst();

    setConsoleText(`Matching rows ${record?.numUpdatedRows}`);
};

export const handleTest = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const result = await runner(database);

    setConsoleText(
        result.map(result => `- ${result.description}: ${result.passed ? "✅" : "❌"}`).join("\n")
    );
};

export const handleSelectFiles = async (
    database: Kysely<Database>,
    setConsoleText: React.Dispatch<React.SetStateAction<string>>
) => {
    const files = await database
        .selectFrom("files")
        .select(["contents", "mime_type", "name", "id"])
        .execute();

    console.log(files);
};
