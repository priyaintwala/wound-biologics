import { beforeAll, describe, expect, it } from "@jest/globals";
import {
    LoggedInUser,
    login,
    registerSuperAdmin,
    supertestRequest,
} from "./testUtils.js";

let companyId: string;
let patientId: string;
let loggedInUser: LoggedInUser;
let authToken: string;

beforeAll(async () => {
    await registerSuperAdmin();
    loggedInUser = await login();
    authToken = loggedInUser.token;

    // Creating a company for the patient
    const companyName = {
        name: "Premium",
    };

    const companyData = await supertestRequest
        .post("/api/companies")
        .set("Authorization", `Bearer ${authToken}`)
        .send(companyName)
        .expect(200);
    companyId = companyData.body.data.id;
});

describe("Patient Routes", () => {
    it("should create a new patient", async () => {
        const newPatient = {
            name: "John Great",
            age: 30,
            companyId,
        };

        const response = await supertestRequest
            .post("/api/patients")
            .set("Authorization", `Bearer ${authToken}`)
            .send(newPatient)
            .expect(200);

        expect(response.body.success).toBe(true);
        patientId = response.body.data.id;
    }, 20000);

    it("should get the patient", async () => {
        const response = await supertestRequest
            .get(`/api/patients/${patientId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
    });

    it("should get the patients by company Id", async () => {
        const response = await supertestRequest
            .get(`/api/patients?companyId=${companyId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
    });

    it("should update the patient", async () => {
        const updatedPatient = {
            name: "Updated Patient",
            age: 90,
            companyId,
        };

        const response = await supertestRequest
            .put(`/api/patients/${patientId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(updatedPatient)
            .expect(200);

        expect(response.body.success).toBe(true);
    });
    // it("should delete the patient by stored ID", async () => {
    //     const response = await request(BASE_URL)
    //         .delete(`/api/patients/${patientId}`)
    //         .set("Authorization", `Bearer ${authToken}`)
    //         .expect(200);

    //     expect(response.body.success).toBe(true);
    // });
});
