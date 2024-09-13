import { NextFunction, Request, Response } from "express";
import CustomError from "../models/customError.js";
import { AuthService } from "../services/auth.service.js";
import CustomResponse from "../models/customResponse.js";
import asyncHandler from "../utils/catchAsync.util.js";

export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }

    async register() {}

    login = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body;
                const { user, token } = await this.authService.login(
                    email,
                    password
                );

                const customResponse = new CustomResponse(
                    true,
                    "Login Successful",
                    {
                        user,
                        token,
                    }
                );
                return res.status(200).json({
                    customResponse,
                    audit: {
                        action: "login",
                        email,
                    },
                });
            } catch (err: any) {
                next(err);
            }
        }
    );

    forgotPassword = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email } = req.body;
                await this.authService.forgotPassword(email);
                const customResponse = new CustomResponse(
                    true,
                    "Mail sent successfully",
                    {}
                );
                return res.status(200).json({
                    customResponse,
                    audit: {
                        action: "forgot-password",
                        email,
                    },
                });
            } catch (err: any) {
                next(new CustomError(err.message, 401));
            }
        }
    );
    resetPassword = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, newPassword } = req.body;
                await this.authService.resetPassword(email, newPassword);
                const customResponse = new CustomResponse(
                    true,
                    "Password Updated successfully",
                    {}
                );
                return res.status(200).json({
                    customResponse,
                    audit: {
                        action: "reset-password",
                        email,
                    },
                });
            } catch (err: any) {
                next(new CustomError(err.message, 401));
            }
        }
    );

    verifyEmail = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email } = req.body;
                await this.authService.verifyEmail(email);
                const customResponse = new CustomResponse(
                    true,
                    "User registered",
                    {}
                );
                return res.status(200).json({
                    customResponse,
                });
            } catch (err: any) {
                next(err);
            }
        }
    );

    sendOtp = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email } = req.body;
                await this.authService.sendOtp(email);
                const customResponse = new CustomResponse(
                    true,
                    "Mail sent successfully",
                    {}
                );
                return res.status(200).json({
                    customResponse,
                    audit: {
                        action: "otp.send",
                        email,
                    },
                });
            } catch (err: any) {
                next(err);
            }
        }
    );

    verifyOtp = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { otp, email } = req.body;
                const { target } = req.query;
                await this.authService.verifyOtp(otp, email, target as string);
                const customResponse = new CustomResponse(
                    true,
                    "OTP validated successfully",
                    {}
                );
                return res.status(200).json({
                    customResponse,
                    audit: {
                        action: "otp.verify",
                        email,
                    },
                });
            } catch (err: any) {
                next(err);
            }
        }
    );
}
