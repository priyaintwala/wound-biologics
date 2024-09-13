import { beforeAll, describe, expect, it } from "@jest/globals";
import {
    LoggedInUser,
    login,
    registerSuperAdmin,
    supertestRequest,
} from "./testUtils.js";

let companyId: string;
let orderId: string;
let patientId: string;

let loggedInUser: LoggedInUser;
let authToken: string;

beforeAll(async () => {
    await registerSuperAdmin();
    loggedInUser = await login();
    authToken = loggedInUser.token;

    // Creating a company for the patient
    const companyName = {
        name: "company_name",
    };

    const companyData = await supertestRequest
        .post("/api/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(companyName)
        .expect(200);
    companyId = companyData.body.data.id;

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

    patientId = response.body.data.id;
});

describe("Order Routes", () => {
    it("should create a new order", async () => {
        const order = {
            companyId,
            patientId,
            items: [
                {
                    productId: "iwuhewnbchb213",
                    quantity: 3,
                },
            ],
            totalSaleAmount: "5000$",
            shippingAddress: {
                street: "street1",
                city: "Ahmedabad",
            },
        };

        const response = await supertestRequest
            .post("/api/orders")
            .set("Authorization", `Bearer ${authToken}`)
            .send(order)
            .expect(200);

        expect(response.body.success).toBe(true);
        orderId = response.body.data.id;
    }, 20000);

    it("should get the order", async () => {
        const response = await supertestRequest
            .get(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
    });

    it("should update the order", async () => {
        const updatedOrder = {
            shippingAddress: {
                street: "Sheelaj",
                city: "New Ahmedabad",
            },
        };

        const response = await supertestRequest
            .put(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(updatedOrder)
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
