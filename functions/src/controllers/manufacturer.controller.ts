import CustomResponse from "../models/customResponse.js";
import { Manufacturer } from "../models/manufacturer.js";
import { ManufacturerService } from "../services/manufacturer.service.js";
import { Request, Response } from "express";
import asyncHandler from "../utils/catchAsync.util.js";

export class ManufacturerController {
    private manufacturerService: ManufacturerService;

    constructor() {
        this.manufacturerService = new ManufacturerService();
    }

    createManufacturer = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const manufacturer: Manufacturer = req.body;
        manufacturer.id =
            await this.manufacturerService.createManufacturer(manufacturer);
        const customResponse = new CustomResponse(
            true,
            "created successfully",
            {
                id: manufacturer.id,
            }
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "mf.create",
            },
        });
    });

    getManufacturerById = asyncHandler(async (req: Request, res: Response) => {
        const manufacturer: Manufacturer =
            await this.manufacturerService.getManufacturerById(req.params.id);
        const customResponse = new CustomResponse(true, null, manufacturer);
        return res.status(200).json(customResponse);
    });

    updateManufacturer = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const manufacturer: Manufacturer = req.body;
        manufacturer.id = req.params.id;
        await this.manufacturerService.updateManufacturer(manufacturer);
        const customResponse = new CustomResponse(
            true,
            "Updated successfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "mf.update",
            },
        });
    });

    // updateManufacturerStatus = async (req: Request, res: Response) => {
    //     try {
    //         console.log(req.body);
    //         let role: Manufacturer = req.body;
    //         role.id = req.params.id;
    //         role. = req.body.isActive;
    //         await this.roleService.updateManufacturerStatus(role);
    //         return res.status(200).json("Done");
    //     } catch (err:any) {
    //         throw err;
    //     }
    // }

    deleteManufacturer = asyncHandler(async (req: Request, res: Response) => {
        const manufacturerId = req.params.id;
        await this.manufacturerService.deleteManufacturer(manufacturerId);
        const customResponse = new CustomResponse(
            true,
            "Deleted successfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "mf.delete",
            },
        });
    });
}
