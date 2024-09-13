import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateData } from "../middlewares/validation.middleware.js";
import {
    emailSchema,
    otpSchema,
    resetPasswordSchema,
    userLoginSchema,
} from "../schemas/zod.schema.js";

const authRouter: Router = express.Router();
const authController: AuthController = new AuthController();

// authRouter.post("/register", authController.register);
authRouter.post("/login", validateData(userLoginSchema), authController.login);
// authRouter.post(
//     "/forgot-password",
//     validateData(forgotPasswordSchema),
//     authController.forgotPassword
// );

authRouter.post(
    "/verify-email",
    validateData(emailSchema),
    authController.verifyEmail
);
authRouter.post("/send-otp", validateData(emailSchema), authController.sendOtp);
authRouter.post(
    "/verify-otp",
    validateData(otpSchema),
    authController.verifyOtp
);

authRouter.post(
    "/reset-password",
    validateData(resetPasswordSchema),
    authController.resetPassword
);

export default authRouter;
