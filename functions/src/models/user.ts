import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { Roles } from "../constants/enums.js";
import { Otp } from "./otp.js";
export interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    password: {
        hash: string;
        salt: string;
    };
    email: string;
    role: Roles;
    roleId: string;
    companyId: string;
    distributorId: string;
    salesExecutiveId: string;
    clinicGroupId:string;
    clinicianId:string;
    isActive: true;
    resetPasswordToken: {
        hash: string;
        salt: string;
        expiredTime: Timestamp;
    };
    currentOtp: Otp,
    createdAt: FieldValue;
    isLocked: boolean;
    invalidAttempt: {
        count: number;
        lastAttemptTime: FieldValue;
    };
}

export type UserResponse = Omit<
    User,
    "password" | "resetPasswordToken" | "createdAt"
>;
