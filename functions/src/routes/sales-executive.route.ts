import express, { Router } from "express";
import { SalesExecutiveController } from "../controllers/sales-executive.controller.js";
import { isSystemAdminOrDistributor } from "../middlewares/auth.middleware.js";
// import { isDistributor } from "../middlewares/auth.middleware.js";

const salesExecutiveRouter: Router = express.Router();
const salesExecutiveController: SalesExecutiveController =
    new SalesExecutiveController();


// salesExecutiveRouter.param("salesExecutiveId",isSystemAdminOrSalesExecutive);
// salesExecutiveRouter.param("distributorId",isSystemAdminOrDistributor);
salesExecutiveRouter.use(isSystemAdminOrDistributor);
salesExecutiveRouter.post("/",salesExecutiveController.createSalesExecutive);
salesExecutiveRouter.get("/",salesExecutiveController.getSalesExecutive);
// salesExecutiveRouter.put("/:salesExecutiveId",salesExecutiveController.)
// salesExecutiveRouter.get("/:distributorId/user",salesExecutiveController.getAllUserByDistributorId);
// salesExecutiveRouter.param("salesExecutiveId",isVerifyDistributorId);
// salesExecutiveRouter.get("/:distributorId/user/:salesExecutiveId",salesExecutiveController.getUserByDistributorId);
salesExecutiveRouter.put("/:distributorId/user/:salesExecutiveId",salesExecutiveController.updateSalesExecutiveUser);
salesExecutiveRouter.delete("/:distributorId/user/:salesExecutiveId",salesExecutiveController.deleteSalesExecutiveUser);

export default salesExecutiveRouter;
