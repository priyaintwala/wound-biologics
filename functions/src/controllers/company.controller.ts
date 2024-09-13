import { Request, Response } from "express";
import CompanyService from "../services/comapny.services.js";
import { User } from "../models/user.js";
import CustomResponse from "../models/customResponse.js";
import UserService from "../services/user.service.js";
import { UserMapper } from "../mappers/user.mapper.js";
import asyncHandler from "../utils/catchAsync.util.js";
import { Company } from "../models/company.js";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";

export class CompanyController {
    private companyService: CompanyService;
    private userService: UserService;

    constructor() {
        this.companyService = new CompanyService();
        this.userService = new UserService();
    }

    createCompany = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const company = req.body;
        company.id = await this.companyService.createCompany(company);
        const customResponse = new CustomResponse(true, "Company created", {
            id: company.id,
        });
        return res.status(200).json({
            customResponse,
            audit: {
                action: "company.create",
            },
        });
    });

    getCompany = asyncHandler(async (req: Request, res: Response) => {
        const company: Company = await this.companyService.getCompnayById(
            req.params.companyId
        );
        return res.status(200).json(new CustomResponse(true, null, company));
    });

    updateCompany = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const company = req.body;
        company.id = req.params.companyId;
        await this.companyService.updateCompany(company);
        const customResponse = new CustomResponse(true, "Company updated", {});
        return res.status(200).json({
            customResponse,
            audit: {
                action: "company.update",
            },
        });
    });

    deleteCompany = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const companyId = req.params.companyId;
        await this.companyService.deleteCompany(companyId);
        const customResponse = new CustomResponse(true, "Company deleted", {});
        return res.status(200).json({
            customResponse,
            audit: {
                action: "company.delete",
            },
        });
    });

    createCompanyUser = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            console.log(req.body);
            const user: User = req.body;
            user.companyId = req.params.companyId;
            const { id, password } = await this.userService.createUser(
                user,
                req.isSuperTest
            );
            user.id = id;
            await this.userService.sendCredsEmailToUser({
                firstname: user.firstname,
                lastname: user.lastname,
                toEmailAddress: user.email,
                password,
            });
            const userMapper = new UserMapper();
            const userResponse = userMapper.generateUserResponse(user);
            const customResponse = new CustomResponse(
                true,
                "Company user created",
                {
                    user: userResponse,
                }
            );
            return res.status(200).json({
                customResponse,
                audit: {
                    action: "company-user.create",
                },
            });
        }
    );

    updateCompanyUser = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const user: User = req.body;
        user.id = req.params.userId;
        user.companyId = req.params.companyId;
        await this.userService.updateUser(user);
        const customResponse = new CustomResponse(
            true,
            "Company user updated",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "company-user.update",
            },
        });
    });

    deleteCompanyUser = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.id = req.params.userId;
        user.companyId = req.params.companyId;
        await this.userService.deleteUser(user.id);
        const customResponse = new CustomResponse(
            true,
            "Company user deleted",
            { user }
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "company-user.delete",
            },
        });
    });
}
