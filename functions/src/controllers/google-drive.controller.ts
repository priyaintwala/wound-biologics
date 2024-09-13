import { Response, Request } from "express";
import CustomResponse from "../models/customResponse.js";
import { ExtendedExpressRequest } from "../models/extendedExpressRequest.js";
import asyncHandler from "../utils/catchAsync.util.js";
import GoogleDriveService from "../services/google-drive.service.js";

export class GoogleDriveController {
    private googleDriveService: GoogleDriveService;

    constructor() {
        this.googleDriveService = new GoogleDriveService();
    }

    getFiles = asyncHandler(
        async (req: ExtendedExpressRequest, res: Response) => {
            const files = await this.googleDriveService.getFiles();
            return res.status(200).json(
                new CustomResponse(true, "list of files", {
                    files,
                })
            );
        }
    );

    uploadFiles = asyncHandler(async (req: Request, res: Response) => {
        const callback = (statusCode: number, message: string) => {
            res.status(statusCode).json(new CustomResponse(false, message, {}));
        };
        await this.googleDriveService.upladFiles(
            req.headers,
            req.body,
            callback
        );
    });
}
