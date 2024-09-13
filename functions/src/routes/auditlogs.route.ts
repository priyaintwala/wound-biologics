import express, { Router } from "express";
import { isSystemAdminOrCompanyAdmin } from "../middlewares/auth.middleware.js";
import { AuditLogsController } from "../controllers/auditlogs.controller.js";

const auditLogsRouter: Router = express.Router();
const auditLogController:AuditLogsController = new AuditLogsController();

auditLogsRouter.param("companyId", isSystemAdminOrCompanyAdmin);
auditLogsRouter.get("/:companyId?/:userId?",auditLogController.getAuditLogs);
auditLogsRouter.get("/:action/:companyId?/:userId?",auditLogController.getAuditLogsByAction);

export default auditLogsRouter;
