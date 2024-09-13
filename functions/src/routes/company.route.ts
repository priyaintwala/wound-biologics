import express, { Router } from "express";
import { CompanyController } from "../controllers/company.controller.js";
import {
    isSystemAdminOrCompanyAdmin,
    verifyRole,
} from "../middlewares/auth.middleware.js";
import { Roles } from "../constants/enums.js";
import { comapanyUserSchema } from "../schemas/zod.schema.js";
import { validateData } from "../middlewares/validation.middleware.js";

const companyRouter: Router = express.Router();
const companyController: CompanyController = new CompanyController();

companyRouter.post(
    "/",
    verifyRole([Roles.SYSTEM_ADMIN]),
    companyController.createCompany
);
companyRouter.put(
    "/:companyId",
    verifyRole([Roles.SYSTEM_ADMIN]),
    companyController.updateCompany
);
companyRouter.delete(
    "/:companyId",
    verifyRole([Roles.SYSTEM_ADMIN]),
    companyController.deleteCompany
);
companyRouter.param("companyId", isSystemAdminOrCompanyAdmin);
companyRouter.get("/:companyId", companyController.getCompany);
companyRouter.post(
    "/:companyId/users",
    validateData(comapanyUserSchema),
    companyController.createCompanyUser
);
companyRouter.put(
    "/:companyId/users/:userId",
    companyController.updateCompanyUser
);
companyRouter.delete(
    "/:companyId/users/:userId",
    companyController.deleteCompanyUser
);

export default companyRouter;
