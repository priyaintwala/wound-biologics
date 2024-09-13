import { Response, Request } from "express";
import CustomResponse from "../models/customResponse.js";
import asyncHandler from "../utils/catchAsync.util.js";
import UserService from "../services/user.service.js";
import { User } from "../models/user.js";
import { Roles } from "../constants/enums.js";
import OrderService from "../services/order.service.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";

export class DistributorController {
    private distributorService: UserService;
    private orderService: OrderService;

    constructor() {
        this.distributorService = new UserService();
        this.orderService = new OrderService();
    }

    createDistributor = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.role = Roles.DISTRIBUTOR;
        const { id, password } = await this.distributorService.createUser(user);
        await this.distributorService.sendCredsEmailToUser({
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

    getDistributor = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            let user: User | User[];
            if (req.params.id) {
                user = await this.distributorService.getUserById(req.params.id);
            } else {
                user = await this.distributorService.getAllDistributor();
            }
            const userMapper = new UserMapper();
            // const userResponse = userMapper.generateUserResponse(user);
            // return res
            // .status(200)
            // .json(new CustomResponse(true, null, userResponse));
            const userResponse = Array.isArray(user)
                ? user.map((u) => userMapper.generateUserResponse(u))
                : userMapper.generateUserResponse(user);
            return res
                .status(200)
                .json(new CustomResponse(true, null, userResponse));
        }
    );

    updateDistributor = asyncHandler(async (req: Request, res: Response) => {
        const user: User = req.body;
        user.id = req.params.id;
        await this.distributorService.updateUser(user);
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
    });

    deleteDistributor = asyncHandler(async (req: Request, res: Response) => {
        await this.distributorService.deleteUser(req.params.id);
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
    });

    // createSalesExecutive = asyncHandler(async (req: Request, res: Response) => {
    //     const user: User = req.body;
    //     user.distributorId = req.params.distributorId;
    //     user.role = Roles.SALESEXECUTIVE;
    //     const { id,password } = await this.distributorService.createUser(user);
    //     await this.distributorService.sendCredsEmailToUser({
    //         firstname: user.firstname,
    //         lastname: user.lastname,
    //         toEmailAddress: user.email,
    //         password,
    //     });
    //     return res.status(200).json(
    //         new CustomResponse(true, `salesExecutive created successfully in distributor ${req.params.distributorId}`, {
    //             id,
    //         })
    //     );
    // });

    // getSalesExecutive = asyncHandler(async (req: Request, res: Response) => {
    //     const id = req.params.salesExecutiveId;
    //     const user: User = await this.distributorService.getUserBySalesExecutive(id);
    //     const userMapper = new UserMapper();
    //     const userResponse = userMapper.generateUserResponse(user);
    //     return res
    //         .status(200)
    //         .json(new CustomResponse(true, null, userResponse));
    // });

    // getClinicGroup = asyncHandler(async (req: Request, res: Response) => {
    //     const id = req.params.clinicGroupId;
    //     const user: User = await this.distributorService.getUserByClinicGroup(id);
    //     const userMapper = new UserMapper();
    //     const userResponse = userMapper.generateUserResponse(user);
    //     return res
    //         .status(200)
    //         .json(new CustomResponse(true, null, userResponse));
    // });

    // createClinicGroup = asyncHandler(async (req: Request, res: Response) => {
    //     const user: User = req.body;
    //     user.distributorId = req.params.distributorId;
    //     user.role = Roles.CLINICGROUP;
    //     const { id,password } = await this.distributorService.createUser(user);
    //     await this.distributorService.sendCredsEmailToUser({
    //         firstname: user.firstname,
    //         lastname: user.lastname,
    //         toEmailAddress: user.email,
    //         password,
    //     });
    //     return res.status(200).json(
    //         new CustomResponse(true, `clinicGroup created successfully in distributor ${req.params.distributorId} and salesExecutive ${req.params.salesExecutiveId}`, {
    //             id,
    //         })
    //     );
    // });

    // createClinicians = asyncHandler(async (req: Request, res: Response) => {
    //     const user: User = req.body;
    //     user.distributorId = req.params.distributorId;
    //     user.role = Roles.CLINICIANS;
    //     const { id,password } = await this.distributorService.createUser(user);
    //     await this.distributorService.sendCredsEmailToUser({
    //         firstname: user.firstname,
    //         lastname: user.lastname,
    //         toEmailAddress: user.email,
    //         password,
    //     });
    //     return res.status(200).json(
    //         new CustomResponse(true, `clinicGroup created successfully in distributor ${req.params.distributorId} and salesExecutive ${req.params.salesExecutiveId}`, {
    //             id,
    //         })
    //     );
    // });

    // getClinicians = asyncHandler(async (req: Request, res: Response) => {
    //     const id = req.params.clinicianId;
    //     const user: User = await this.distributorService.getUserByClinicians(id);
    //     const userMapper = new UserMapper();
    //     const userResponse = userMapper.generateUserResponse(user);
    //     return res
    //         .status(200)
    //         .json(new CustomResponse(true, null, userResponse));
    // });

    // //Still need changes
    // createOrder = asyncHandler(async (req: Request, res: Response) => {
    //     const order = req.body;
    //     order.id = await this.orderService.createOrder(order);

    //     const customResponse = new CustomResponse(
    //         true,
    //         "order created succesfully",
    //         {
    //             id: order.id,
    //         }
    //     );

    //     return res.status(200).json({
    //         customResponse,
    //         audit: {
    //             action: "order.create",
    //         },
    //     });
    // });
}
