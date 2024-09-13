import { describe, it } from "@jest/globals";
import { supertestRequest } from "./testUtils.js";

describe("POST /api/users/system-admin", () => {
    it("should return bad request if not required fields", () => {
        const data = { firstname: "superadmin" };
        return supertestRequest
            .post("/api/users/system-admin")
            .send(data)
            .expect(400)
            .then(() => {
                //console.log(body);
            });
    });

    it("should return unauthorized if not api key", () => {
        const data = {
            firstname: "super",
            lastname: "admin",
            email: "suerpadmin@test.com",
        };
        return supertestRequest
            .post("/api/users/system-admin")
            .send(data)
            .expect(401)
            .then(() => {
                //console.log(body);
            });
    });
});
