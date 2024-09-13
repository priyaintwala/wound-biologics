import { expect } from "@jest/globals";
import supertest from "supertest";

export type LoggedInUser = { token: string; userId: string };

// let loggedInUser: LoggedInUser;

// export function setAuthUser(userDetails: LoggedInUser) {
//     loggedInUser = userDetails;
// }

// export function getAuthUser() {
//     return loggedInUser;
// }

export const supertestRequest = supertest
    .agent(process.env.LOCAL_URL)
    .set("supertest", true);

export function registerSuperAdmin() {
    const data = {
        firstname: "super",
        lastname: "admin",
        email: process.env.TEST_USER_EMAIL,
    };
    return supertestRequest
        .post("/api/users/system-admin")
        .set("x-api-key", process.env.SYSTEM_ADMIN_KEY)
        .send(data)
        .then(({ body }) => {
            return body;
        });
}

// export async function deleteUser() {
//     await supertestRequest
//         .delete(`/api/users/${loggedInUser.userId}`)
//         .set("Authorization", `Bearer ${loggedInUser.token}`);
// }

export function login(
    email?: string,
    password: string = process.env.TEST_USER_PASSWORD
) {
    return supertestRequest
        .post("/api/auth/login")
        .send({
            email: email || process.env.TEST_USER_EMAIL,
            password,
        })
        .then(({ body }) => {
            expect(body).toHaveProperty("success", true);
            return { token: body.data.token, userId: body.data.user.id };
        });
}
