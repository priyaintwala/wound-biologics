import { beforeAll, describe, expect, it } from "@jest/globals";
import { login, registerSuperAdmin, supertestRequest } from "./testUtils.js";

let companyId;
let companyAdminId;
let loggedInUser;

const COMPANY_ADMIN_EMAIL = "companyadmin@wb.com";

beforeAll(async () => {
    await registerSuperAdmin();
    loggedInUser = await login();
});

// afterAll(async () => {
//     await deleteUser();
// });

describe("Companies and it's users", () => {
    it("should create company", async () => {
        const companyName = {
            name: "Mr.Sharma Clinic",
        };

        const companyData = await supertestRequest
            .post("/api/companies")
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(companyName)
            .expect(200);

        expect(companyData.body).toHaveProperty("success", true);
        expect(companyData.body.data).toHaveProperty("id");
        companyId = companyData.body.data.id;
    });

    it("should get a company by ID", async () => {
        const response = await supertestRequest
            .get(`/api/companies/${companyId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .expect(200);
        console.log("Done Getting company");

        expect(response.body).toHaveProperty("success", true);
    });

    it("should update a company", async () => {
        const updatedCompany = {
            name: "Mr.Kohil Clinic",
        };

        const response = await supertestRequest
            .put(`/api/companies/${companyId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(updatedCompany)
            .expect(200);

        expect(response.body).toHaveProperty("success", true);
    });

    it("should create a new company user", async () => {
        const newUser = {
            firstname: "John",
            lastname: "Doe",
            email: COMPANY_ADMIN_EMAIL,
            companyId,
            role: "companyadmin",
        };

        const response = await supertestRequest
            .post(`/api/companies/${companyId}/users`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(newUser)
            .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data.user).toHaveProperty("id");
        companyAdminId = response.body.data.user.id;
    });

    it("should update a company user", async () => {
        const updatedUser = {
            firstname: "John",
            lastname: "Smith",
        };
        const response = await supertestRequest
            .put(`/api/companies/${companyId}/users/${companyAdminId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(updatedUser)
            .expect(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should not allow company admin to create company", async () => {
        const loggedInCompanyAdmin = await login(COMPANY_ADMIN_EMAIL);
        const companyName = {
            name: "Mr.Sharma Clinic",
        };
        await supertestRequest
            .post("/api/companies")
            .set("Authorization", `Bearer ${loggedInCompanyAdmin.token}`)
            .send(companyName)
            .expect(401);
    });

    it("should not allow to delete company to company admin", async () => {
        const loggedInCompanyAdmin = await login(COMPANY_ADMIN_EMAIL);
        const response = await supertestRequest
            .delete(`/api/companies/${companyId}`)
            .set("Authorization", `Bearer ${loggedInCompanyAdmin.token}`)
            .expect(401);

        expect(response.body).toHaveProperty("success", false);
    });

    it("should not allow company admin to create other company users", async () => {
        const loggedInCompanyAdmin = await login(COMPANY_ADMIN_EMAIL);

        const companyName = {
            name: "Mr.Shami Clinic",
        };

        //Create a dummy company by superadmin
        const companyData = await supertestRequest
            .post("/api/companies")
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .send(companyName);

        const dummyCompanyId = companyData.body.data.id;

        const newUser = {
            firstname: "John",
            lastname: "Doe",
            email: "testuser@dummy.com",
            dummyCompanyId,
            role: "user",
        };

        //Attemtpting to access another company user
        await supertestRequest
            .post(`/api/companies/${dummyCompanyId}/users`)
            .set("Authorization", `Bearer ${loggedInCompanyAdmin.token}`)
            .send(newUser)
            .expect(401);
    });

    it("should delete a company user", async () => {
        const response = await supertestRequest
            .delete(`/api/companies/${companyId}/users/${companyAdminId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .expect(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should delete a company", async () => {
        console.log("Deleting company");
        const response = await supertestRequest
            .delete(`/api/companies/${companyId}`)
            .set("Authorization", `Bearer ${loggedInUser.token}`)
            .expect(200);
        expect(response.body).toHaveProperty("success", true);
    });
});
