import { FieldValue } from "firebase-admin/firestore";

export interface orderStatus {
    id: string;
    status: string;
    timestamp: FieldValue;
    notes: string;
}
