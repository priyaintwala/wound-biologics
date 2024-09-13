import express, { Router } from "express";
import { RoleController } from "../controllers/role.controller.js";

const roleRouter: Router = express.Router();
const roleController: RoleController = new RoleController();

roleRouter.post("/", roleController.createRole);
roleRouter.put("/:id", roleController.updateRole);
roleRouter.put("/:id/status", roleController.updateRoleStatus);
roleRouter.delete("/:id", roleController.deleteRole);

export default roleRouter;
