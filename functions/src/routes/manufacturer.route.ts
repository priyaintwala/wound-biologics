import express, { Router } from "express";
import { ManufacturerController } from "../controllers/manufacturer.controller.js";
import { ProductController } from "../controllers/product.controller.js";

const manufacturerRouter: Router = express.Router();
const manufacturerController: ManufacturerController =
    new ManufacturerController();
const productController: ProductController = new ProductController();

manufacturerRouter.post("/", manufacturerController.createManufacturer);
manufacturerRouter.get("/:id", manufacturerController.getManufacturerById);
manufacturerRouter.put("/:id", manufacturerController.updateManufacturer);
manufacturerRouter.delete("/:id", manufacturerController.deleteManufacturer);
manufacturerRouter.post(
    "/:manufacturerId/products",
    productController.createProduct
);
manufacturerRouter.get(
    "/:manufacturerId/products",
    productController.getProducts
);
manufacturerRouter.put(
    "/:manufacturerId/products/:productId",
    productController.updateProduct
);
manufacturerRouter.delete(
    "/:manufacturerId/products/:productId",
    productController.deleteProduct
);

export default manufacturerRouter;
