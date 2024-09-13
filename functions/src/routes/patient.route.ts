import express, { Router } from "express";
import { PatientController } from "../controllers/patient.controller.js";

const patientRouter: Router = express.Router();
const patientController: PatientController = new PatientController();

patientRouter.get("/", patientController.getPatients);
patientRouter.get("/:id", patientController.getPatientById);
patientRouter.post("/", patientController.createPatient);
patientRouter.put("/:id", patientController.updatePatient);
patientRouter.delete("/:id", patientController.deletePatient);

export default patientRouter;
