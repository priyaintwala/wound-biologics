import { FieldValue } from "firebase-admin/firestore";

export interface AuditLog {
    userId: string;
    email: string;
    url: string;
    ip: string | string[];
    method: string;
    params: object;
    statusCode: number;
    action: string;
    time: FieldValue;
}
