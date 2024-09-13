import { Request, Response } from "express";
import OrderService from "../services/order.service.js";
import CustomResponse from "../models/customResponse.js";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";
import asyncHandler from "../utils/catchAsync.util.js";

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    getOrders = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            const filterParams = req.query;
            const orders = await this.orderService.getOrders("", filterParams);
            return res.status(200).json(
                new CustomResponse(true, "", {
                    orders,
                    length: orders.length,
                })
            );
        }
    );

    getOrderById = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            const { id } = req.params;
            const order = await this.orderService.getOrderById(id);
            return res.status(200).json(new CustomResponse(true, "", order));
        }
    );

    createOrder = asyncHandler(async (req: Request, res: Response) => {
        const order = req.body;
        order.id = await this.orderService.createOrder(order);
        const customResponse = new CustomResponse(
            true,
            "order created succesfully",
            {
                id: order.id,
            }
        );

        return res.status(200).json({
            customResponse,
            audit: {
                action: "order.create",
            },
        });
    });

    updateOrder = asyncHandler(async (req: Request, res: Response) => {
        const order = req.body;
        //Step1: Check logged in user's Role is company Admin
        // if(req.user.role===Roles.COMPANY_ADMIN)
        //Step2: Get companyid of this order's patient id.
        //Step3: compare logged in user's companyid and patient's company id
        order.id = req.params.id;
        await this.orderService.updateOrder(order);
        const customResponse = new CustomResponse(
            true,
            "order updated succesfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "order.update",
            },
        });
    });

    deleteOrder = asyncHandler(async (req: Request, res: Response) => {
        await this.orderService.deleteOrder(req.params.id);
        const customResponse = new CustomResponse(
            true,
            "order deleted succesfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "order.delete",
            },
        });
    });
}
