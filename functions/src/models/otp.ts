import { FieldValue, Timestamp } from "firebase-admin/firestore";

export interface Otp {
    email?: string;
    isVerified?: boolean;
    hash: string;
    salt: string;
    createdTime: FieldValue;
    expiredTime: Timestamp;
}
