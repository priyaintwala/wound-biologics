import { NextFunction, Response } from "express";
import { AuditLog } from "../models/auditLog.js";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";
import AuditLogService from "../services/audit-log.service.js";
import { FieldValue } from "firebase-admin/firestore";
import CustomResponse from "../models/customResponse.js";

export const auditLoggerInterceptResponse = async (
    req: ExtendedExpressRequest,
    res: Response,
    next: NextFunction
) => {
    const originalJson = res.json;
    //Overide the res.json method with a custom implementation
    res.json = function (response: {
        customResponse: CustomResponse;
        audit: {
            action: string;
            email: string;
        };
    }) {
        if (response.audit) {
            const auditLog: AuditLog = {
                url: req.originalUrl,
                userId: req.user?.id || null,
                ip: req.headers["x-forwarded-for"] ?? null,
                method: req.method,
                params: req.params,
                statusCode: res.statusCode,
                action: response.audit.action ?? null,
                email: response.audit.email ?? null,
                time: FieldValue.serverTimestamp(),
            };
            const auditLogService = new AuditLogService();
            auditLogService.addAuditLog(auditLog);
            return originalJson.call(this, response.customResponse);
        } else {
            return originalJson.call(this, response);
        }
    };
    next();
};
