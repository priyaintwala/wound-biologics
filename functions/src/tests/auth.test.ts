import { describe, expect, it } from "@jest/globals";
import { supertestRequest } from "./testUtils.js";

describe("AUTH /api/auth/login", () => {
    it("should not login if not correct format of email", () => {
        const data = {
            email: "invalid_email_format",
            password: "user",
        };
        return supertestRequest
            .post("/api/auth/login")
            .send(data)
            .expect(400)
            .then(() => {
                //console.log(body);
            });
    });

    it("should not login if password not match criteria", () => {
        const data = {
            email: process.env.TEST_USER_EMAIL,
            password: "pwd",
        };
        return supertestRequest
            .post("/api/auth/login")
            .send(data)
            .expect(400)
            .then(() => {
                //console.log(body);
            });
    });

    it("should not login with invalid creds", () => {
        const data = {
            email: "unresgisteruser@test.com",
            password: process.env.TEST_USER_PASSWORD,
        };
        return supertestRequest
            .post("/api/auth/login")
            .send(data)
            .expect(401)
            .then(() => {
                //console.log(body);
            });
    });

    it("should not send forgot password code to unregistered email", async () => {
        const forgetSchema = {
            email: "hello@bacancy.com",
        };
        await supertestRequest
            .post("/api/auth/forgot-password")
            .send(forgetSchema)
            .expect(401);
    });

    it("should login with correct details", () => {
        const data = {
            email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
        };
        return supertestRequest
            .post("/api/auth/login")
            .send(data)
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveProperty("success", true);
            });
    });
});
