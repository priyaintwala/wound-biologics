import express, { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { isSystemAdminOrCompanyAdmin } from "../middlewares/auth.middleware.js";

const orderRouter: Router = express.Router();
const orderController: OrderController = new OrderController();

orderRouter.get("/", orderController.getOrders);
orderRouter.get("/:id", orderController.getOrderById);
orderRouter.post("/", orderController.createOrder);
//ToDo: Update middleware so that only that clinic's admin can update order.
orderRouter.put(
    "/:id",
    isSystemAdminOrCompanyAdmin,
    orderController.updateOrder
);
orderRouter.delete("/:id", orderController.deleteOrder);

export default orderRouter;
