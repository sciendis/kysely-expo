import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useKysely } from "kysely-expo";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { BrandTable } from "../tables/brand-table";
import { FileTable } from "../tables/file-table";
import { PhoneTable } from "../tables/phone-table";
import { TypeTestsTable } from "../tables/type-tests-tables";
import { base64ToBlob } from "../utils";
import { PatientTable } from "../tables/patients-table";
import { OrderTable, ProductTable } from "../tables/order-table";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    handleInsert,
    handleSelect,
    handleDelete,
    handleUpdate,
    handleSelectFiles,
    handleTest,
    handleDeleteBrand,
    handleSelectStream
} from "../utils/dbActions";
export interface Database {
    type_tests: TypeTestsTable;
    brands: BrandTable;
    phones: PhoneTable;
    files: FileTable;
    products: ProductTable;
    orders: OrderTable;
    patients: PatientTable;
}

export default function MainScreen() {
    const safeAreaInsets = useSafeAreaInsets();
    const database = useKysely<Database>();
    const [consoleText, setConsoleText] = useState("");

    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        const asset = result.assets[0];

        console.log("Reading path", asset.uri);

        const binary = base64ToBlob(
            await FileSystem.readAsStringAsync(asset.uri, {
                encoding: "base64"
            })
        );

        await database
            .insertInto("files")
            .values({
                contents: binary,
                mime_type: asset.mimeType ?? "unknown",
                name: asset.fileName ?? "unknown.ext"
            })
            .execute();
    };

    const handleTransaction = async () => {
        // remove all phones with the name "iPhone Transaction"
        await database.deleteFrom("phones").where("name", "=", "iPhone Transaction").execute();

        await database.transaction().execute(async trx => {
            await trx
                .insertInto("phones")
                .values({
                    name: "iPhone Transaction",
                    brand_id: 1,
                    created_at: new Date(),
                    is_active: false,
                    meta_json: {
                        foo: "bar",
                        bar: 1
                    }
                })
                .execute();

            await trx
                .insertInto("phones")
                .values({
                    name: "iPhone Transaction",
                    brand_id: 1,
                    created_at: new Date(),
                    is_active: false,
                    meta_json: {
                        foo: "bar",
                        bar: 1
                    }
                })
                .execute();
        });
    };

    return (
        <ScrollView
            style={{
                flex: 1,
                paddingTop: safeAreaInsets.top,
                paddingBottom: safeAreaInsets.bottom,
                backgroundColor: "black"
            }}
        >
            <StatusBar style="auto" />
            <View style={{ ...styles.container, paddingTop: 50 }}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{
                            display: "flex",
                            borderColor: "white",
                            borderWidth: 1,
                            borderRadius: 5
                        }}
                    >
                        <TextInput
                            multiline
                            value={consoleText}
                            style={{
                                padding: 10,
                                color: "white",
                                width: "100%",
                                fontWeight: "bold"
                            }}
                        />
                    </ScrollView>
                </View>
                <View style={{ flex: 1 }}>
                    <View
                        style={{
                            justifyContent: "center",
                            flexDirection: "row",

                            alignItems: "center"
                        }}
                    ></View>

                    <Button title="Insert" onPress={() => handleInsert(database, setConsoleText)} />
                    <Button title="Select" onPress={() => handleSelect(database, setConsoleText)} />
                    {/*<Button title="Delete" onPress={() => handleDelete(database, setConsoleText)} />
                    <Button
                        title="Delete Cascade"
                        onPress={() => handleDeleteBrand(database, setConsoleText)}
                    />
                    <Button title="Update" onPress={() => handleUpdate(database, setConsoleText)} />
                    <Button title="Transaction" onPress={handleTransaction} />
                    <Button title="Store File" onPress={handlePickImage} />
                    <Button
                        title="Select Files"
                        onPress={() => handleSelectFiles(database, setConsoleText)}
                    />
                    <Button
                        title="Select Stream"
                        onPress={() => handleSelectStream(database, setConsoleText)}
                    />
                    <Button
                        title="Run Tests"
                        onPress={() => handleTest(database, setConsoleText)}
                    /> */}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30
    },

    text: {
        paddingHorizontal: 5,
        color: "#fff"
    },

    consoleText: {
        paddingHorizontal: 5,
        color: "#39FF14"
    }
});
