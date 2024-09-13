import { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import CustomResponse from "../models/customResponse.js";
import asyncHandler from "../utils/catchAsync.util.js";

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    createProduct = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const { manufacturerId } = req.params;
        const product = req.body;
        const productId = await this.productService.createProduct(
            manufacturerId,
            product
        );
        const customResponse = new CustomResponse(
            true,
            "Product created successfully",
            {
                id: productId,
            }
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "product.create",
            },
        });
    });

    getProducts = asyncHandler(async (req: Request, res: Response) => {
        const { manufacturerId } = req.params;
        const productId = await this.productService.getProducts(manufacturerId);
        const customResponse = new CustomResponse(
            true,
            "Product created successfully",
            {
                id: productId,
            }
        );
        return res.status(200).json(customResponse);
    });

    updateProduct = asyncHandler(async (req: Request, res: Response) => {
        console.log(req.body);
        const product = req.body;
        product.id = req.params.productId;
        const manufacturerId = req.params.manufacturerId;
        await this.productService.updateProduct(manufacturerId, product);
        const customResponse = new CustomResponse(
            true,
            "Product updated successfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "product.update",
            },
        });
    });

    deleteProduct = asyncHandler(async (req: Request, res: Response) => {
        const { manufacturerId, productId } = req.params;
        await this.productService.deleteProduct(manufacturerId, productId);
        const customResponse = new CustomResponse(
            true,
            "Product deleted successfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "product.delete",
            },
        });
    });
}
