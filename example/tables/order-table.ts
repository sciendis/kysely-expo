import { ColumnType, Insertable, JSONColumnType, Selectable, Updateable } from "kysely";

export enum OrderState {
    DRAFT = "Entwurf",
    RECEIVED = "In Bearbeitung",
    SHIPPED = "Versandt",
    DELIVERED = "Geliefert"
}

export interface ProductTable {
    productId: string;
    itemNumber: string;
    description: string | null;
    additional: string | null;
    size: string | null;
    packageSize: string | null;
    pzn: string;
    category: string | null;
    categoryId: string | null;
    isLocked: boolean | null;
    discontinued: boolean | null;
    type: string | null;
}

export type Product = Selectable<ProductTable>;
export type NewProduct = Insertable<ProductTable>;

export interface OrderTable {
    orderId: string;
    responsibleUserId: string;
    externalDoctorId: string;
    externalNursingId: string;
    patientId: string;
    status: OrderState | string;
    createdAt: ColumnType<Date, string, string>;
    patientName: string;
    prescriptionExists: boolean;
    prescriptionPhotoUploaded: boolean;
    addresses: JSONColumnType<OrderAddress[]>;
    items: JSONColumnType<OrderItem[]>;
    comment: string;
    archived: boolean | null;
    inactive: boolean | null;
    teamId: string | null;
    createdBy: string | null;
    shippedAt: ColumnType<Date, string, string> | null;
    deliveredAt: ColumnType<Date, string, string> | null;
    trackingLinks: JSONColumnType<string[]> | null;
    deliveryNoticeIds: JSONColumnType<string[]> | null;
    signature: string | null;
    orderNumber: string | null;
    wundexId: number | null;
    acribaId: number | null;
    staged: boolean | null;
}

export interface OrderAddress {
    isDelivery: boolean | null;
    isInvoice: boolean | null;
    origin: string;
    addressee: string | null;
    addressee2: string | null;
    street: string | null;
    number: string | null;
    addition: string | null;
    postCode: string | null;
    city: string | null;
}
export interface OrderItem extends Product {
    quantity: number;
}

export type Order = Selectable<OrderTable>;
export type NewOrder = Insertable<OrderTable>;
export type UpdateOrder = Updateable<OrderTable>;
