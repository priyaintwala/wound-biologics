import { User } from "../models/user.js";

export class UserMapper {
    generateUserResponse(user: User) {
        const {
            password: _password,
            resetPasswordToken: _resetPasswordToken,
            createdAt: _createdAt,
            ...userRespose
        } = user;
        return userRespose;
    }
}
