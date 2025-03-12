import { useEffect, useState } from "react";
import { Order, NewOrder } from "../tables/order-table";
import { useKysely } from "kysely-expo";
import { Database } from "./main";
import { View, StyleSheet, Text, Button } from "react-native";

const ordersMockData: NewOrder[] = [
    {
        orderId: "64ca3c5e1bedad3dd78600c5",
        teamId: "64be8f736f6fda6391290d36",
        createdBy: "64c3cb0e6f6fda6391290dd4",
        responsibleUserId: "64c3cb0e6f6fda6391290dd4",
        patientId: "64c54d33fedfe97c01438860",
        patientName: "Jensen, Sebastian",
        createdAt: "2023-08-02T16:43:10.108Z",
        shippedAt: "0001-01-01T00:00:00Z",
        deliveredAt: "2023-08-31T08:13:38.357Z",
        orderNumber: "64ca3c5e1bedad3dd78600c5",
        status: "Geliefert",
        externalDoctorId: "",
        externalNursingId: "",
        prescriptionExists: false,
        prescriptionPhotoUploaded: false,
        items: JSON.stringify([
            {
                productId: "5",
                itemNumber: "3",
                description: "Silkofoam 5 x 5 cm",
                additional: "",
                size: "5 x 5 cm",
                packageSize: "328",
                pzn: "12347973",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 1
            },
            {
                productId: "380",
                itemNumber: "388",
                description: "Mepilex® Border Flex Lite,Schaumv., 4 x 5cm",
                additional: "",
                size: "4x5",
                packageSize: "328",
                pzn: "16226491",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 1
            }
        ]),
        addresses: JSON.stringify([
            {
                isDelivery: true,
                isInvoice: true,
                origin: "",
                addressee: "Jensen",
                addressee2: "",
                street: "Sünderup",
                number: "54",
                addition: "",
                postCode: "24943",
                city: "Flensburg"
            }
        ]),
        comment: "",
        trackingLinks: JSON.stringify([
            "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?runtime=standalone&idc=00340434697530652443"
        ]),
        deliveryNoticeIds: JSON.stringify(["27"]),
        archived: false,
        inactive: false,
        wundexId: 0,
        acribaId: 0
    },
    {
        orderId: "664de84dee46d77e65b5ee4c",
        teamId: "64bea10e6f6fda6391290d3c",
        createdBy: "64bfb37e6f6fda6391290dce",
        responsibleUserId: "64bfb37e6f6fda6391290dce",
        patientId: "64d2136353ce31813c1271f4",
        patientName: "Ceylan, Elif",
        createdAt: "2024-05-22T12:45:29.115Z",
        shippedAt: "2024-05-24T10:02:30.911Z",
        deliveredAt: "2024-05-25T12:02:11.72Z",
        orderNumber: "664de84dee46d77e65b5ee4c",
        status: "Geliefert",
        externalDoctorId: "64d1fe3b5cd1fdf1f267634a",
        externalNursingId: "64d1fbe55cd1fdf1f2675f9c",
        prescriptionExists: false,
        prescriptionPhotoUploaded: false,
        items: JSON.stringify([
            {
                productId: "62",
                itemNumber: "60",
                description: "Muko Pre S 8-fach steril 25x2 St 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "50",
                pzn: "04453230",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 1
            },
            {
                productId: "9",
                itemNumber: "7",
                description: "Silkofoam B 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "10",
                pzn: "12348033",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 1
            }
        ]),
        addresses: JSON.stringify([
            {
                isDelivery: true,
                isInvoice: false,
                origin: "Sonstige",
                addressee: "Elif Ceylan",
                addressee2: "",
                street: "Bielefelder Straße ",
                number: "124",
                addition: "",
                postCode: "44625",
                city: "Herne"
            },
            {
                isDelivery: false,
                isInvoice: true,
                origin: "Sonstige",
                addressee: "Elif Ceylan",
                addressee2: "",
                street: "Bielefelder Straße ",
                number: "124",
                addition: "",
                postCode: "44625",
                city: "Herne"
            }
        ]),
        comment:
            "RA bitte an den HA schicken: \n\nDr. med. Vladimir Dridger\nUnser-Fritz-Straße 156\n44653 Herne\nTelefax: 02325 / 50445",
        trackingLinks: JSON.stringify([
            "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?runtime=standalone&idc=00340434697533443536"
        ]),
        deliveryNoticeIds: JSON.stringify(["160167"]),
        archived: false,
        inactive: false,
        wundexId: 92250,
        acribaId: 0
    },
    {
        orderId: "660549f88a49dd334e5132ec",
        teamId: "64bea10e6f6fda6391290d3c",
        createdBy: "64ba868a09b89a1b44af5d37",
        responsibleUserId: "64bfb37e6f6fda6391290dce",
        patientId: "64d2148153ce31813c12730d",
        patientName: "Dieckmann, Klaus",
        createdAt: "2024-03-28T10:46:34.766Z",
        shippedAt: "2024-03-28T13:02:04.655Z",
        deliveredAt: "2024-03-30T12:01:48.39Z",
        orderNumber: "660549f88a49dd334e5132ec",
        status: "Geliefert",
        externalDoctorId: "65164ced405c0a971de5de29",
        externalNursingId: "64d1fd14e8fb556f23ea778d",
        prescriptionExists: false,
        prescriptionPhotoUploaded: false,
        items: JSON.stringify([
            {
                productId: "1809",
                itemNumber: "1782",
                description: "Zetuvit Plus Silicone Border Oval 13 x 15,5 cm",
                additional: "",
                size: "13 cm x 15,5 cm",
                packageSize: "10",
                pzn: "17278745",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 1
            },
            {
                productId: "1801",
                itemNumber: "1774",
                description: "Zetuvit Plus Silicone Border 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "10",
                pzn: "17278662",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 2
            },
            {
                productId: "62",
                itemNumber: "60",
                description: "Muko Pre S 8-fach steril 25x2 St 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "50",
                pzn: "04453230",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 1
            }
        ]),
        addresses: JSON.stringify([
            {
                isDelivery: true,
                isInvoice: false,
                origin: "Patient",
                addressee: "Klaus Dieckmann",
                addressee2: "",
                street: "Weidengrund",
                number: "20",
                addition: "",
                postCode: "44797",
                city: "Bochum"
            },
            {
                isDelivery: false,
                isInvoice: true,
                origin: "Patient",
                addressee: "Klaus Dieckmann",
                addressee2: "",
                street: "Weidengrund",
                number: "20",
                addition: "",
                postCode: "44797",
                city: "Bochum"
            }
        ]),
        comment: "",
        trackingLinks: JSON.stringify([
            "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?runtime=standalone&idc=00340434697533071944"
        ]),
        deliveryNoticeIds: JSON.stringify(["138104"]),
        archived: false,
        inactive: false,
        wundexId: 75176,
        acribaId: 0
    },
    {
        orderId: "66164184778df0c911f00067",
        teamId: "64bea10e6f6fda6391290d3c",
        createdBy: "64ba868a09b89a1b44af5d37",
        responsibleUserId: "64bfb37e6f6fda6391290dce",
        patientId: "64d2148153ce31813c12730d",
        patientName: "Dieckmann, Klaus",
        createdAt: "2024-04-10T07:37:04.039Z",
        shippedAt: "2024-04-10T12:02:21.391Z",
        deliveredAt: "2024-04-11T13:01:57.528Z",
        orderNumber: "66164184778df0c911f00067",
        status: "Geliefert",
        externalDoctorId: "65164ced405c0a971de5de29",
        externalNursingId: "64d1fd12e8fb556f23ea771f",
        prescriptionExists: false,
        prescriptionPhotoUploaded: false,
        items: JSON.stringify([
            {
                productId: "1801",
                itemNumber: "1774",
                description: "Zetuvit Plus Silicone Border 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "10",
                pzn: "17278662",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 3
            }
        ]),
        addresses: JSON.stringify([
            {
                isDelivery: true,
                isInvoice: false,
                origin: "Patient",
                addressee: "Klaus Dieckmann",
                addressee2: "",
                street: "Weidengrund",
                number: "20",
                addition: "",
                postCode: "44797",
                city: "Bochum"
            },
            {
                isDelivery: false,
                isInvoice: true,
                origin: "Patient",
                addressee: "Klaus Dieckmann",
                addressee2: "",
                street: "Weidengrund",
                number: "20",
                addition: "",
                postCode: "44797",
                city: "Bochum"
            }
        ]),
        comment: "",
        trackingLinks: JSON.stringify([
            "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?runtime=standalone&idc=00340434697533147946"
        ]),
        deliveryNoticeIds: JSON.stringify(["142288"]),
        archived: false,
        inactive: false,
        wundexId: 78359,
        acribaId: 0
    },
    {
        orderId: "662618861aaeb58405a4ef40",
        teamId: "64bea10e6f6fda6391290d3c",
        createdBy: "64ba868a09b89a1b44af5d37",
        responsibleUserId: "64bfb37e6f6fda6391290dce",
        patientId: "64d2148153ce31813c12730d",
        patientName: "Dieckmann, Klaus",
        createdAt: "2024-04-22T07:59:07.429Z",
        shippedAt: "2024-04-22T09:32:19.948Z",
        deliveredAt: "2024-04-23T11:02:10.497Z",
        orderNumber: "662618861aaeb58405a4ef40",
        status: "Geliefert",
        externalDoctorId: "65164ced405c0a971de5de29",
        externalNursingId: "64d1fd12e8fb556f23ea771f",
        prescriptionExists: false,
        prescriptionPhotoUploaded: false,
        items: JSON.stringify([
            {
                productId: "1801",
                itemNumber: "1774",
                description: "Zetuvit Plus Silicone Border 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "10",
                pzn: "17278662",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 3
            },
            {
                productId: "62",
                itemNumber: "60",
                description: "Muko Pre S 8-fach steril 25x2 St 10 x 10 cm",
                additional: "",
                size: "10 cm x 10 cm",
                packageSize: "50",
                pzn: "04453230",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 3
            },
            {
                productId: "136",
                itemNumber: "135",
                description: "Fixomull Skin sensitive 5 m x 10 cm",
                additional: "",
                size: "5 m x 10 cm",
                packageSize: "1",
                pzn: "15190934",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 2
            },
            {
                productId: "969",
                itemNumber: "984",
                description: "Freka NaCl 0,9% Drainjet 60 ml",
                additional: "",
                size: "10 x 60 ml",
                packageSize: "10",
                pzn: "03031679",
                categoryId: "",
                category: "",
                type: "",
                isLocked: false,
                discontinued: false,
                quantity: 3
            }
        ]),
        addresses: JSON.stringify([
            {
                isDelivery: true,
                isInvoice: false,
                origin: "Patient",
                addressee: "Klaus Dieckmann",
                addressee2: "",
                street: "Weidengrund",
                number: "20",
                addition: "",
                postCode: "44797",
                city: "Bochum"
            },
            {
                isDelivery: false,
                isInvoice: true,
                origin: "Patient",
                addressee: "Klaus Dieckmann",
                addressee2: "",
                street: "Weidengrund",
                number: "20",
                addition: "",
                postCode: "44797",
                city: "Bochum"
            }
        ]),
        comment: "",
        trackingLinks: JSON.stringify([
            "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?runtime=standalone&idc=00340434697533219957"
        ]),
        deliveryNoticeIds: JSON.stringify(["146873"]),
        archived: false,
        inactive: false,
        wundexId: 82183,
        acribaId: 0
    }
];

export const SciendisTestScreen: React.FC = () => {
    const kysely = useKysely<Database>();
    const [orders, setOrders] = useState<Order[]>([]);

    // useEffect(() => {
    //     console.log("Orders", orders);
    //     kysely
    //         .insertInto("orders")
    //         .values(ordersMockData)
    //         .onConflict(oc =>
    //             oc.column("orderId").doUpdateSet({
    //                 orderId: eb => eb.ref("excluded.orderId")
    //             })
    //         )
    //         .execute()
    //         .then(() => {
    //             kysely
    //                 .selectFrom("orders")
    //                 .selectAll()

    //                 .orderBy("createdAt", "desc")
    //                 .execute()
    //                 .then(res => setOrders(res));
    //         })
    //         .catch(console.error);
    // }, []);

    const handleSelectPatients = async () => {
        const patients = await kysely
            .selectFrom("patients")
            .selectAll()
            // .where(eb =>
            //     eb.and([
            //         eb("created", "!=", true).or(eb("staged", "!=", true)),
            //         eb("archived", "=", true)
            //     ])
            // )
            .where(eb =>
                eb.or([
                    eb("created", "is", null).or("created", "!=", true),
                    eb("staged", "is", null).or("staged", "!=", true)
                ])
            )
            .where("archived", "=", true)
            .execute();

        console.log(patients);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Orders</Text>

            <Button title="Patients" onPress={handleSelectPatients} />
            {orders.map(order => (
                <View key={order.orderId}>
                    <Text>{order.createdAt.toISOString()}</Text>
                    <Text>{order.shippedAt.toISOString()}</Text>
                    <Text>{order.deliveredAt.toISOString()}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: "#fff",
        justifyContent: "center"
    },

    title: {
        color: "#000"
    }
});
