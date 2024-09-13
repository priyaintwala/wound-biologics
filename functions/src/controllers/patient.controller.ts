import { Request, Response } from "express";
import { PatientService } from "../services/patient.service.js";
import CustomResponse from "../models/customResponse.js";
import { Patient } from "../models/patient.js";
import asyncHandler from "../utils/catchAsync.util.js";

export class PatientController {
    private patientService: PatientService;

    constructor() {
        this.patientService = new PatientService();
    }

    getPatients = asyncHandler(async (req: Request, res: Response) => {
        const filterParams = req.query;
        const patients = await this.patientService.getPatients(filterParams);
        return res.status(200).json(new CustomResponse(true, null, patients));
    });

    getPatientById = asyncHandler(async (req: Request, res: Response) => {
        const patient: Patient = await this.patientService.getPatientById(
            req.params.id
        );
        return res.status(200).json(new CustomResponse(true, null, patient));
    });

    createPatient = asyncHandler(async (req: Request, res: Response) => {
        const patient = req.body;
        const patientId = await this.patientService.createPatient(patient);
        const customResponse = new CustomResponse(
            true,
            "Patient created successfully",
            {
                id: patientId,
            }
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "patient.create",
            },
        });
    });

    updatePatient = asyncHandler(async (req: Request, res: Response) => {
        const patient = req.body;
        patient.id = req.params.id;
        await this.patientService.updatePatient(patient);
        const customResponse = new CustomResponse(
            true,
            "Patient updated successfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "patient.update",
            },
        });
    });

    deletePatient = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.patientService.deletePatient(id);
        const customResponse = new CustomResponse(
            true,
            "Patient deleted successfully",
            {}
        );
        return res.status(200).json({
            customResponse,
            audit: {
                action: "patient.delete",
            },
        });
    });
}
