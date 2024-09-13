import { NextFunction, Request, Response } from "express";
import CustomError from "../models/customError.js";
import { logger } from "firebase-functions";
import { ERROR_MESSAGES } from "../constants/error.js";

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
};

export default errorHandler;
