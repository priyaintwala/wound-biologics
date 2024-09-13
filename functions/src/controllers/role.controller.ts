import { Request, Response } from "express";
import { Role } from "../models/role.js";
import { RoleService } from "../services/role.service.js";
import asyncHandler from "../utils/catchAsync.util.js";

export class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    createRole = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const role: Role = req.body;
        await this.roleService.createRole(role);
        return res.status(200).json(role);
    });

    updateRole = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const role: Role = req.body;
        role.id = req.params.id;
        await this.roleService.updateRole(role);
        return res.status(200).json("Done");
    });

    updateRoleStatus = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const role: Role = req.body;
        role.id = req.params.id;
        role.isActive = req.body.isActive;
        await this.roleService.updateRoleStatus(role);
        return res.status(200).json("Done");
    });

    deleteRole = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const roleId = req.params.id;
        await this.roleService.deleteRole(roleId);
        return res.status(200).json("Done");
    });
}
