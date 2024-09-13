import express, { Router } from "express";
import { CliniciansController } from "../controllers/clinician.controller.js";
// import {
//     verifyRole,
//     isSystemAdminOrDistributor
// } from "../middlewares/auth.middleware.js";
// import { Roles } from "../constants/enums.js";

const distributorRouter: Router = express.Router();
const cliniciansController: CliniciansController =
    new CliniciansController();

// distributorRouter.post("/", verifyRole([Roles.SYSTEM_ADMIN]), cliniciansController.createDistributor);
// distributorRouter.param("distributorId",isSystemAdminOrDistributor);
distributorRouter.post("/:distributorId/user", cliniciansController.createSalesExecutive);
distributorRouter.post("/:distributorId/user/?:salesExecutiveId", cliniciansController.createClinicGroup);
distributorRouter.post("/:distributorId/user/?:salesExecutiveId/?:clinicGroupId", cliniciansController.createClinicians);

export default distributorRouter;
