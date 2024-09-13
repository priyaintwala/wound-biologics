import express, { Router } from "express";
import { ClinicGroupController } from "../controllers/clinic-group.controller.js";
// import {
//     isSystemAdminOrClinicGroup
// } from "../middlewares/auth.middleware.js";

const clinicGroupRouter: Router = express.Router();
const clinicGroupController: ClinicGroupController =
    new ClinicGroupController();

// clinicGroupRouter.param("clinicGroupId",isSystemAdminOrClinicGroup);

clinicGroupRouter.post("/:distributorId/user/?:salesExecutiveId", clinicGroupController.createClinicGroup);

clinicGroupRouter.post("/:distributorId/user/:salesExecutiveId/:clinicGroupId", clinicGroupController.createClinicians);

export default clinicGroupRouter;
