import { Response, Request } from "express";
import CustomResponse from "../models/customResponse.js";
import asyncHandler from "../utils/catchAsync.util.js";
import UserService from "../services/user.service.js";
import { User } from "../models/user.js";
import { Roles } from "../constants/enums.js";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";
import { UserMapper } from "../mappers/user.mapper.js";
// import { UserMapper } from "../mappers/user.mapper.js";
// import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";

export class SalesExecutiveController {
    private salesExecutiveService: UserService;

    constructor() {
        this.salesExecutiveService = new UserService();
    }

    createSalesExecutive = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            const user: User = req.body;
            if (req.user.role === Roles.DISTRIBUTOR) {
                console.log("roles distributor");
                user.distributorId = req.user.id;
            }
            user.role = Roles.SALESEXECUTIVE;
            const { id, password } =
                await this.salesExecutiveService.createUser(user);
            await this.salesExecutiveService.sendCredsEmailToUser({
                firstname: user.firstname,
                lastname: user.lastname,
                toEmailAddress: user.email,
                password,
            });
            return res.status(200).json(
                new CustomResponse(
                    true,
                    "salesExecutive created successfully",
                    {
                        id,
                    }
                )
            );
        }
    );

    getSalesExecutive = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            let user: User | User[];
            console.log(
                typeof req.query.distributorId,
                "distributionId by query"
            );
            if (req.user.role == Roles.SYSTEM_ADMIN) {
                // console.log(typeof(req.query.distributorId));
                user = await this.salesExecutiveService.getUserById(
                    req.query.salesExecutiveId.toString()
                );
            } else if (req.user.role == Roles.DISTRIBUTOR) {
                if (req.query.salesExecutiveId) {
                    user = await this.salesExecutiveService.getUserById(
                        req.query.salesExecutiveId.toString()
                    );
                    if (
                        Array.isArray(user) &&
                        user.length > 0 &&
                        user[0].distributorId !== req.user.id
                    ) {
                        return res
                            .status(401)
                            .json(new CustomResponse(false, "Unauthorized"));
                    } else if (
                        !Array.isArray(user) &&
                        user.distributorId !== req.user.id
                    ) {
                        return res
                            .status(401)
                            .json(new CustomResponse(false, "Unauthorized"));
                    }
                } else {
                    // If no salesExecutiveId is provided, return an error response
                    return res
                        .status(400)
                        .json(
                            new CustomResponse(
                                false,
                                "Sales Executive ID is required"
                            )
                        );
                }
                // user = await this.salesExecutiveService.getUserById(
                //     req.query.salesExecutiveId.toString()
                // );
                // if (user.distributorId == req.query.distributionId) {
                //     return user;
                // } else {
                //     return res
                //         .status(401)
                //         .json(new CustomResponse(false, "Unauthorized"));
                // }
                user = await this.salesExecutiveService.getUserByDistributorId(
                    req.user.id
                );
            }

            if (req.query.salesExecutiveId) {
                user = await this.salesExecutiveService.getUserById(
                    req.params.id
                );
            } else {
                user = await this.salesExecutiveService.getUserByDistributorId(
                    req.user.id
                );
            }
            const userMapper = new UserMapper();
            const userResponse = Array.isArray(user)
                ? user.map((u) => userMapper.generateUserResponse(u))
                : userMapper.generateUserResponse(user);
            return res
                .status(200)
                .json(new CustomResponse(true, null, userResponse));
        }
    );

    // getSalesExecutive = asyncHandler(async (req: ExtendedExpressRequest, res: Response) => {
    //     let user: User | User[];

    //     if (req.user.role === Roles.SYSTEM_ADMIN) {
    //       // If the user is a system admin, fetch the sales executive details based on the provided salesExecutiveId
    //       if (req.query.salesExecutiveId) {
    //         user = await this.salesExecutiveService.getUserById(req.query.salesExecutiveId.toString());
    //       } else {
    //         // If no salesExecutiveId is provided, return an error response
    //         return res.status(400).json(new CustomResponse(false, "Sales Executive ID is required"));
    //       }
    //     } else if (req.user.role === Roles.DISTRIBUTOR) {
    //       // If the user is a distributor, fetch the sales executive details and check if the sales executive belongs to the distributor
    //       if (req.query.salesExecutiveId) {
    //         user = await this.salesExecutiveService.getUserById(req.query.salesExecutiveId.toString());
    //         if (Array.isArray(user) && user.length > 0 && user[0].distributorId !== req.user.id) {
    //           return res.status(401).json(new CustomResponse(false, "Unauthorized"));
    //         } else if (!Array.isArray(user) && user.distributorId !== req.user.id) {
    //           return res.status(401).json(new CustomResponse(false, "Unauthorized"));
    //         }
    //       } else {
    //         // If no salesExecutiveId is provided, return an error response
    //         return res.status(400).json(new CustomResponse(false, "Sales Executive ID is required"));
    //       }
    //     } else if (req.user.role === Roles.SALES_EXECUTIVE) {
    //       // If the user is a sales executive, fetch their own details
    //       user = await this.salesExecutiveService.getUserById(req.user.id);
    //     } else if (req.user.role === Roles.CLINIC_GROUP) {
    //       // If the user is a clinic group, fetch the sales executive details based on the provided clinicGroupId
    //       if (req.query.clinicGroupId) {
    //         // Implement the logic to fetch sales executives based on the clinicGroupId
    //       } else {
    //         return res.status(400).json(new CustomResponse(false, "Clinic Group ID is required"));
    //       }
    //     } else if (req.user.role === Roles.CLINICIAN) {
    //       // If the user is a clinician, fetch the sales executive details based on the provided clinicianId
    //       if (req.query.clinicianId) {
    //         // Implement the logic to fetch sales executives based on the clinicianId
    //       } else {
    //         return res.status(400).json(new CustomResponse(false, "Clinician ID is required"));
    //       }
    //     } else {
    //       // If the user role is not recognized, return an error response
    //       return res.status(400).json(new CustomResponse(false, "Invalid user role"));
    //     }

    //     const userMapper = new UserMapper();
    //     const userResponse = Array.isArray(user) ? user.map((u) => userMapper.generateUserResponse(u)) : userMapper.generateUserResponse(user);
    //     return res.status(200).json(new CustomResponse(true, null, userResponse));
    //   });
    // getAllUserByDistributorId = asyncHandler(async (req: Request, res: Response) => {
    //     const user: User = await this.salesExecutiveService.getUserByDistributorId(req.params.distributorId);
    //     const userMapper = new UserMapper();
    //     const userResponse = userMapper.generateUserResponse(user);
    //     return res
    //         .status(200)
    //         .json(new CustomResponse(true, null, userResponse));
    // });

    // getUserByDistributorId = asyncHandler(async (req: Request, res: Response) => {
    //     const user: User = await this.salesExecutiveService.getUserById(req.params.salesExecutiveId);
    //     const userMapper = new UserMapper();
    //     const userResponse = userMapper.generateUserResponse(user);
    //     return res
    //         .status(200)
    //         .json(new CustomResponse(true, null, userResponse));
    // });

    updateSalesExecutiveUser = asyncHandler(
        async (req: Request, res: Response) => {
            console.log(req.body);
            const user: User = req.body;
            user.id = req.params.salesExecutiveId;

            await this.salesExecutiveService.updateUser(user);
            const customResponse = new CustomResponse(
                true,
                "User updated succesfully",
                user
            );
            return res.status(200).json({
                customResponse,
                audit: {
                    action: "user.update",
                },
            });
        }
    );

    deleteSalesExecutiveUser = asyncHandler(
        async (req: Request, res: Response) => {
            console.log(req.body, "delete");
            await this.salesExecutiveService.deleteUser(
                req.params.salesExecutiveId
            );
            const customResponse = new CustomResponse(
                true,
                "User deleted succesfully",
                {}
            );
            return res.status(200).json({
                customResponse,
                audit: {
                    action: "user.delete",
                },
            });
        }
    );

    createClinicGroup = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.distributorId = req.params.distributorId;
        user.salesExecutiveId = req.params.salesExecutiveId;
        user.role = Roles.CLINICGROUP;
        const { id, password } =
            await this.salesExecutiveService.createUser(user);
        await this.salesExecutiveService.sendCredsEmailToUser({
            firstname: user.firstname,
            lastname: user.lastname,
            toEmailAddress: user.email,
            password,
        });
        return res.status(200).json(
            new CustomResponse(
                true,
                `clinicGroup created successfully in distributor ${req.params.distributorId} and salesExecutive ${req.params.salesExecutiveId}`,
                {
                    id,
                }
            )
        );
    });

    createClinicians = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.distributorId = req.params.distributorId;
        user.salesExecutiveId = req.params.salesExecutiveId;
        user.clinicGroupId = req.params.clinicGroupId;
        user.role = Roles.CLINICIANS;
        const { id, password } =
            await this.salesExecutiveService.createUser(user);
        await this.salesExecutiveService.sendCredsEmailToUser({
            firstname: user.firstname,
            lastname: user.lastname,
            toEmailAddress: user.email,
            password,
        });
        return res.status(200).json(
            new CustomResponse(
                true,
                `clinicGroup created successfully in distributor ${req.params.distributorId} and salesExecutive ${req.params.salesExecutiveId}`,
                {
                    id,
                }
            )
        );
    });
}
