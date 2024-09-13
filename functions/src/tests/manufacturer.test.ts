import { beforeAll, describe, expect, it } from "@jest/globals";
import { login, registerSuperAdmin, supertestRequest } from "./testUtils.js";

let manufacturerId;
let productId;
let loggedInUser;

beforeAll(async () => {
    await registerSuperAdmin();
    loggedInUser = await login();
});

describe("Manufacturers", () => {
    it("should create manufacturer", async () => {
        const manufacturer = {
            name: "Extremety Care",
        };

        const manufacturerData = await supertestRequest
            .post("/api/manufacturers")
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(manufacturer)
            .expect(200);

        expect(manufacturerData.body).toHaveProperty("success", true);
        expect(manufacturerData.body.data).toHaveProperty("id");
        manufacturerId = manufacturerData.body.data.id;
    });

    it("should get a manufacturer by ID", async () => {
        const response = await supertestRequest
            .get(`/api/manufacturers/${manufacturerId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .expect(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should update a manufacturer", async () => {
        const updatedManufacturer = {
            name: "New Extremety Care",
        };
        const response = await supertestRequest
            .put(`/api/manufacturers/${manufacturerId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(updatedManufacturer)
            .expect(200);

        expect(response.body).toHaveProperty("success", true);
    });
});

describe("Manufacturer's Products", () => {
    it("should create a new manufacturer product", async () => {
        const product = {
            name: "CarePatch",
            price: "200$",
            size: "120cm/s",
            manufacturerId,
        };

        const response = await supertestRequest
            .post(`/api/manufacturers/${manufacturerId}/products`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(product)
            .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data).toHaveProperty("id");
        productId = response.body.data.id;
    });

    it("should update a manufacturer product", async () => {
        const updatedProduct = {
            name: "CarePatch2",
            price: "500$",
        };
        const response = await supertestRequest
            .put(`/api/manufacturers/${manufacturerId}/products/${productId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(updatedProduct)
            .expect(200);

        expect(response.body).toHaveProperty("success", true);
    });

    it("should delete a manufacturer product", async () => {
        const response = await supertestRequest
            .delete(
                `/api/manufacturers/${manufacturerId}/products/${productId}`
            )
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .expect(200);

        expect(response.body).toHaveProperty("success", true);
    });

    it("should delete a manufacturer", async () => {
        const response = await supertestRequest
            .delete(`/api/manufacturers/${manufacturerId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .expect(200);
        expect(response.body).toHaveProperty("success", true);
    });
});
