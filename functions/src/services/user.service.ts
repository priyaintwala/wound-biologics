import { FieldValue } from "firebase-admin/firestore";
import { firebaseDB } from "../config/firebase.config.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { User, UserResponse } from "../models/user.js";
import { generateRandomText, hashRandomText } from "../utils/pwd.util.js";
import { logger } from "firebase-functions";
import EmailService from "./email.service.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { AuthService } from "./auth.service.js";
import { ERROR_MESSAGES } from "../constants/error.js";
import { typesense } from "../config/typesense.config.js";
import { Roles } from "../constants/enums.js";

const usersCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.USERS
);

export default class UserService {
    constructor() {}

    getUserById = async (userId: string) => {
        const docRef = usersCollection.doc(userId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error(ERROR_MESSAGES.USER.USER_NOT_EXISTS);
        } else {
            return doc.data() as User;
        }
    };

    getUserByEmail = async (email: string) => {
        const docRef = usersCollection;
        const snapshot = await docRef.where("email", "==", email).get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            throw new Error(ERROR_MESSAGES.USER.USER_NOT_REGISTERED);
        }
        const user = snapshot.docs[0].data() as User;
        user.id = snapshot.docs[0].id;
        return user;
    };

    getUserByDistributorId = async (distributorId: string) => {
        const docRef = usersCollection;
        const snapshot = await docRef
            .where("distributorId", "==", distributorId)
            .get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            throw new Error(ERROR_MESSAGES.USER.USER_NOT_REGISTERED);
        }
        const users = [];
        snapshot.forEach((doc) => {
            users.push(doc.data());
        });
        return users;
    };

    getUserBySalesExecutive = async (salesExecutiveId: string) => {
        const docRef = usersCollection;
        const snapshot = await docRef
            .where("salesExecutiveId", "==", salesExecutiveId)
            .get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            throw new Error(ERROR_MESSAGES.USER.USER_NOT_REGISTERED);
        }
        const users = [];
        snapshot.forEach((doc) => {
            users.push(doc.data());
        });
        return users;
    };

    getUserByClinicGroup = async (clinicGroupId: string) => {
        const docRef = usersCollection;
        const snapshot = await docRef
            .where("clinicGroupId", "==", clinicGroupId)
            .get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            throw new Error(ERROR_MESSAGES.USER.USER_NOT_REGISTERED);
        }
        const user = snapshot.docs[0].data() as User;
        user.id = snapshot.docs[0].id;
        return user;
    };

    getUserByClinicians = async (clinicianId: string) => {
        const docRef = usersCollection;
        const snapshot = await docRef
            .where("clinicianId", "==", clinicianId)
            .get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            throw new Error(ERROR_MESSAGES.USER.USER_NOT_REGISTERED);
        }
        const user = snapshot.docs[0].data() as User;
        user.id = snapshot.docs[0].id;
        return user;
    };

    getAllDistributor = async () => {
        const usersRef = usersCollection;
        const snapshot = await usersRef.where("role", "==", Roles.DISTRIBUTOR).get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        const users = [];
        snapshot.forEach((doc) => {
            users.push(doc.data());
            console.log(doc.id, "=>", doc.data());
        });
        return users;
    };

    getAllUsers = async () => {
        const usersRef = usersCollection;
        const snapshot = await usersRef.where("role", "==", true).get();
        if (snapshot.empty) {
            console.log("No matching documents.");
            return;
        }
        const users = [];
        snapshot.forEach((doc) => {
            users.push(doc.data());
            console.log(doc.id, "=>", doc.data());
        });
        return users;
    };

    getNames = async (name: string) => {
        const searchParameters = {
            q: name,
            query_by: "firstname",
            // sort_by:"createdAt:desc"
        };
        const result = await typesense
            .collections(FIREBASE_CONSTANTS.FIRESTORE.USERS)
            .documents()
            .search(searchParameters);
        return result.hits;
    };

    createUser = async (
        user: User,
        isSuperTest: boolean = false
    ): Promise<{ [key: string]: any }> => {
        const isUserExists: boolean = await this.userExists(user.email);
        if (isUserExists) throw new Error(ERROR_MESSAGES.USER.USER_EXISTS);
        let password;
        if (isSuperTest) {
            password = process.env.TEST_USER_PWD;
        } else {
            password = generateRandomText(10);
            process.env.NODE_ENV == "local" &&
                logger.info(`Generated Rnadom Password--- ${password}`);
        }

        const { hashedText, salt } = hashRandomText(password);
        user.password = { hash: hashedText, salt };
        const docRef = await usersCollection.add({
            ...user,
            isActive: true,
            createdAt: FieldValue.serverTimestamp(),
        });
        await typesense
            .collections(FIREBASE_CONSTANTS.FIRESTORE.USERS)
            .documents()
            .create({
                id: docRef.id,
                firstname: user.firstname,
                lastname: user.lastname,
            });

        return { id: docRef.id, password };
    };

    updateUser = async (user: User) => {
        const docRef = usersCollection.doc(user.id);
        await docRef.update({ ...user });
    };

    // updateUserByDistributorId = async (user: User) => {
    //     const querySnapshot = await usersCollection
    //         .where("distributorId", "==", user.distributorId)
    //         .get();

    //     if (!querySnapshot.empty) {
    //         const documentRef = querySnapshot.docs[0].ref;
    //         await documentRef.update({ ...user });
    //     } else {
    //         console.log("No matching documents found.");
    //     }
    // };

    deleteUser = async (userId: string) => {
        const docRef = usersCollection.doc(userId);
        await docRef.delete();
    };

    deleteUserByDistributorId = async (distributorId: string) => {
        const querySnapshot = await usersCollection
            .where("distributorId", "==", distributorId)
            .get();

        if (!querySnapshot.empty) {
            const batch = firebaseDB.batch();
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        } else {
            console.log("No matching documents found.");
        }
    };

    getToken = async (userId: string) => {
        const user: User = await this.getUserById(userId);
        const userMapper = new UserMapper();
        const userResponse: UserResponse =
            userMapper.generateUserResponse(user);

        const authService = new AuthService();
        return authService.generateToken(userResponse);
    };

    userExists = async (email: string): Promise<boolean> => {
        const docRef = usersCollection;
        const snapshot = await docRef.where("email", "==", email).get();
        return !snapshot.empty;
    };

    sendCredsEmailToUser = async ({
        firstname,
        lastname,
        password,
        toEmailAddress,
    }: {
        firstname: string;
        lastname: string;
        password: string;
        toEmailAddress: string;
    }) => {
        //Step3: Send email with temp creds to system admin email
        const emailService = new EmailService();
        const mailOptions: object = {
            to: toEmailAddress,
            template: "welcome",
            subject: "Welcome to the Wound Biologics!",
            context: {
                password,
                firstname: firstname || "",
                lastname: lastname || "",
            },
        };
        await emailService.sendMail(mailOptions);
    };
}
