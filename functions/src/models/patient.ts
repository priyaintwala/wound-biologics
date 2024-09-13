import { FieldValue } from "firebase-admin/firestore";

export interface Patient {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    companyId: string;
    address: object;
    dateOfBirth: string;
    isActive: true;
    createdAt: FieldValue;
}
