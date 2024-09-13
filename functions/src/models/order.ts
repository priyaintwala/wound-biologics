import { FieldValue } from "firebase-admin/firestore";
import { orderStatus } from "./orderStatus.js";

export interface Order {
    id: string;
    companyId: string;
    patientId: string;
    items: {
        productId: string;
        quantity: string;
    }[];
    totalSaleAmount: string;
    orderDate: FieldValue;
    updatedDate: FieldValue;
    status: string;
    shippingAddress: {
        street: string;
        city: string;
    };
    orderStatusHistory: orderStatus[];
}
