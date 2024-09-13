import { Response, Request } from "express";
import CustomResponse from "../models/customResponse.js";
import asyncHandler from "../utils/catchAsync.util.js";
import UserService from "../services/user.service.js";
import { User } from "../models/user.js";
import { Roles } from "../constants/enums.js";
// import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";

export class CliniciansController {
    private cliniciansService: UserService;

    constructor() {
        this.cliniciansService = new UserService();
    }

    createDistributor = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.role = Roles.DISTRIBUTOR;
        const { id,password } = await this.cliniciansService.createUser(user);
        await this.cliniciansService.sendCredsEmailToUser({
            firstname: user.firstname,
            lastname: user.lastname,
            toEmailAddress: user.email,
            password,
        });
        return res.status(200).json(
            new CustomResponse(true, "Distributor created successfully", {
                id,
            })
        );
    });

    createSalesExecutive = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.distributorId = req.params.distributorId;
        const { id,password } = await this.cliniciansService.createUser(user);
        await this.cliniciansService.sendCredsEmailToUser({
            firstname: user.firstname,
            lastname: user.lastname,
            toEmailAddress: user.email,
            password,
        });
        return res.status(200).json(
            new CustomResponse(true, `salesExecutive created successfully in distributor ${req.params.distributorId}`, {
                id,
            })
        );
    });

    createClinicGroup = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.distributorId = req.params.distributorId;
        if(req.params.salesExecutiveId){
            user.salesExecutiveId = req.params.salesExecutiveId;
        }
        const { id,password } = await this.cliniciansService.createUser(user);
        await this.cliniciansService.sendCredsEmailToUser({
            firstname: user.firstname,
            lastname: user.lastname,
            toEmailAddress: user.email,
            password,
        });
        return res.status(200).json(
            new CustomResponse(true, `clinicGroup created successfully in distributor ${req.params.distributorId} and salesExecutive ${req.params.salesExecutiveId}`, {
                id,
            })
        );
    });

    createClinicians = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.distributorId = req.params.distributorId;
        if(req.params.salesExecutiveId){
            user.salesExecutiveId = req.params.salesExecutiveId;
        }
        if(req.params.cliniciansId){
            user.clinicGroupId = req.params.clinicGroupId;
        }
        const { id,password } = await this.cliniciansService.createUser(user);
        await this.cliniciansService.sendCredsEmailToUser({
            firstname: user.firstname,
            lastname: user.lastname,
            toEmailAddress: user.email,
            password,
        });
        return res.status(200).json(
            new CustomResponse(true, `clinicGroup created successfully in distributor ${req.params.distributorId} and salesExecutive ${req.params.salesExecutiveId}`, {
                id,
            })
        );
    });
}
