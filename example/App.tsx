import * as FileSystem from "expo-file-system";
import { KyselyProvider, useKysely } from "kysely-expo";
import React, { useEffect } from "react";

import { getMigrator } from "./migrations";
import MainScreen, { Database } from "./screens/main";
import { SciendisTestScreen } from "./screens/SciendisTestScreen";

export default function App() {
    useEffect(() => {
        console.log(`${FileSystem.documentDirectory}/SQLite/`);
    }, []);
    return (
        <KyselyProvider<Database>
            database="orders.db"
            autoAffinityConversion={true}
            // columnNameBasedConversion={[
            //     {
            //         type: "datetime",
            //         match: column => column.endsWith("_at")
            //     },
            //     {
            //         type: "boolean",
            //         match: column => column.startsWith("is_") || column.startsWith("has_")
            //     },
            //     {
            //         type: "object",
            //         match: column => {
            //             const objectTypes = [
            //                 "meta_json",
            //                 "array_type",
            //                 "object_type",
            //                 "record_type"
            //             ];
            //             return objectTypes.some(type => column.includes(type));
            //         }
            //     }
            // ]}
            debug={true}
            onInit={database =>
                getMigrator(database).migrateToLatest().then(console.log, console.error)
            }
            onError={(message, exception) => {
                console.error(message, exception);
            }}
        >
            {/* <MainScreen /> */}
            <SciendisTestScreen />
        </KyselyProvider>
    );
}
