import express, { Router } from "express";
import { DistributorController } from "../controllers/distributor.controller.js";
import {
    verifyRole,
    // isSystemAdminOrDistributor
} from "../middlewares/auth.middleware.js";
import { Roles } from "../constants/enums.js";

const distributorRouter: Router = express.Router();
const distributorController: DistributorController =
    new DistributorController();

distributorRouter.use(verifyRole([Roles.SYSTEM_ADMIN]));
distributorRouter.post("/",  distributorController.createDistributor);
distributorRouter.get("/:id?",distributorController.getDistributor);
distributorRouter.put("/:id",distributorController.updateDistributor);
distributorRouter.delete("/:id",distributorController.deleteDistributor);

export default distributorRouter;
