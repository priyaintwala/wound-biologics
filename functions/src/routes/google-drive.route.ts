import express, { Router } from "express";
import { GoogleDriveController } from "../controllers/google-drive.controller.js";

const googleDriveRouter: Router = express.Router();
const googleDriveController: GoogleDriveController =
    new GoogleDriveController();

googleDriveRouter.get("/files", googleDriveController.getFiles);

googleDriveRouter.post(
    "/upload",
    googleDriveController.uploadFiles
);

export default googleDriveRouter;
