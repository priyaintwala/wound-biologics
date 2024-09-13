import { firebaseAuth } from "../config/firebase.config.js";
import { UserResponse } from "../models/user.js";

export default class FirebaseService {
    constructor() {}

    createCustomToken = async (userResponse: UserResponse) => {
        const customToken = await firebaseAuth.createCustomToken(
            userResponse.id,
            userResponse
        );
        return customToken;
    };
}
