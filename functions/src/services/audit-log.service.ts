import { firebaseDB } from "../config/firebase.config.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { AuditLog } from "../models/auditLog.js";

const auditLogCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.AUDIT_LOGS
);

export default class AuditLogService {
    constructor() {}

    addAuditLog = async (auditLog: AuditLog) => {
        const res = await auditLogCollection.add(auditLog);
        return res.id;
    };

    getAuditLogs = async () => {
        const snapshot = await auditLogCollection.get();
        const data: AuditLog[] = [];
        snapshot.forEach((doc) => {
            data.push(doc.data() as AuditLog);
        });
        return data;
    };

    getAuditLogsById = async (companyId: string, userId: string) => {
        let snapshot;
        const data: AuditLog[] = [];
        if (userId) {
            snapshot = await auditLogCollection
                .where("params.companyId", "==", companyId)
                .where("userId", "==", userId)
                .get();
        }
        snapshot = await auditLogCollection
            .where("params.companyId", "==", companyId)
            .get();

        snapshot.forEach((doc) => {
            data.push(doc.data() as AuditLog);
        });
        return data;
    };

    getAuditLogsAction = async (action: string) => {
        const snapshot = await auditLogCollection
            .where("action", "==", action)
            .get();
        const data: AuditLog[] = [];
        snapshot.forEach((doc) => {
            data.push(doc.data() as AuditLog);
        });
        return data;
    };

    getAuditLogsActionById = async (
        action: string,
        companyId: string,
        userId: string
    ) => {
        let snapshot;
        const data: AuditLog[] = [];
        if (userId) {
            snapshot = await auditLogCollection
                .where("action", "==", action)
                .where("params.companyId", "==", companyId)
                .where("userId", "==", userId)
                .get();
        }
        snapshot = await auditLogCollection
            .where("action", "==", action)
            .where("params.companyId", "==", companyId)
            .get();

        snapshot.forEach((doc) => {
            data.push(doc.data() as AuditLog);
        });
        return data;
    };
}
