import jwt from "jsonwebtoken";
import CustomError from "../models/customError.js";
import { Roles } from "../constants/enums.js";
import { NextFunction, Response } from "express";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";
import { logger } from "firebase-functions";
import { firebaseAuth } from "../config/firebase.config.js";
import { ERROR_MESSAGES } from "../constants/error.js";

export function verifyToken(
    req: ExtendedExpressRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.header("Authorization");
    if (!authHeader)
        return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    // Split header and check format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return res.status(401).json({
            message: ERROR_MESSAGES.MIDDLEWARE.INVALID_AUTHORIZATION_FORMAT,
        });
    }
    // Extract the token
    const token = parts[1];
    try {
        const decodedJwt: any = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as jwt.Secret
        );
        req.user = decodedJwt;
        logger.info(req.user);
        next();
    } catch (err: any) {
        if (err.name == "TokenExpiredError") {
            next(new CustomError(ERROR_MESSAGES.SESSION_EXPIRED, 401));
        } else {
            next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
        }
    }
}

export function verifyRole(expectedRole: string[]) {
    return function (
        req: ExtendedExpressRequest,
        res: Response,
        next: NextFunction
    ) {
        if (expectedRole.includes(req.user.role)) next();
        else next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    };
}

export const isCompanyAdmin = async (
    req: ExtendedExpressRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (
            req.user.companyId == req.params.companyId &&
            req.user.role == Roles.COMPANY_ADMIN
        ) {
            next();
        } else {
            next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
        }
    } catch (e) {
        console.log(e);
        return res
            .status(401)
            .json({ message: ERROR_MESSAGES.UNAUTHENTICATED });
    }
};

export const isSystemAdminOrCompanyAdmin = async (
    req: ExtendedExpressRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (
            (req.user.companyId == req.params.companyId &&
                req.user.role == Roles.COMPANY_ADMIN) ||
            req.user.role == Roles.SYSTEM_ADMIN
        ) {
            next();
        } else {
            next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
        }
    } catch (e) {
        console.log(e);
        return res
            .status(401)
            .json({ message: ERROR_MESSAGES.UNAUTHENTICATED });
    }
};

export const verifyFirebaseIdToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader)
        return next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    // Split header and check format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return res.status(401).json({
            message: ERROR_MESSAGES.MIDDLEWARE.INVALID_AUTHORIZATION_FORMAT,
        });
    }
    // Extract the token
    const token = parts[1];
    try {
        const decodeValue = await firebaseAuth.verifyIdToken(token);
        if (decodeValue) {
            req.user = decodeValue;
            return next();
        }
    } catch (e) {
        console.log(e);
        return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
    }
};

export const isSystemAdminOrDistributor = async (
    req: ExtendedExpressRequest,
    res: Response,
    next: NextFunction
) => {
    if (verifyRole([Roles.SYSTEM_ADMIN])) {
        next();
    } else if (verifyRole([Roles.DISTRIBUTOR])) {
        next();
    } else {
        next(new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }
};

// export const isAdmin = ( req: ExtendedExpressRequest,
//     res: Response,
//     next: NextFunction) => {
//     if (req.user.role == Roles.SYSTEM_ADMIN) {
//         next();
//     } else {
//         res.status(403).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
//     }
// };

// export const isDistributor = ( req: ExtendedExpressRequest,
//     res: Response,
//     next: NextFunction) => {
//     if (req.user.role == Roles.DISTRIBUTOR) {
//         next();
//     } else {
//         res.status(403).json({message: ERROR_MESSAGES.UNAUTHORIZED });
//     }
// };

// export const isSalesExecutive = ( req: ExtendedExpressRequest,
//     res: Response,
//     next: NextFunction) => {
//     if (req.user.role == Roles.SALESEXECUTIVE) {
//         next();
//     } else {
//         res.status(403).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
//     }
// };
