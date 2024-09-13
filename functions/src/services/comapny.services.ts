import { firebaseDB } from "../config/firebase.config.js";
import { ERROR_MESSAGES } from "../constants/error.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { Company } from "../models/company.js";
// import { User } from "../models/user.js";

const companiesCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.COMPANIES
);

export default class CompanyService {
    constructor() {}

    getCompnayById = async (userId: string) => {
        const docRef = companiesCollection.doc(userId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error(ERROR_MESSAGES.COMPANY.COMPANY_NOT_EXISTS);
        } else {
            return doc.data() as Company;
        }
    };

    createCompany = async (company: Company) => {
        const res = await companiesCollection.add(company);
        return res.id;
    };

    updateCompany = async (company: Company) => {
        const docRef = companiesCollection.doc(company.id);
        await docRef.update({ ...company });
    };

    deleteCompany = async (comapnyId: string) => {
        const docRef = companiesCollection.doc(comapnyId);
        await docRef.delete();
    };

    // createCompanyUser = async (companyId: string, user: User) => {
    //     let isUserExists: boolean = await this.userExists(user.email);
    //     if (isUserExists) throw new Error("USER_EXISTS");
    //     const password = generateRandomText(10);
    //     Logger.info(`Generated Password---${password}`);
    //     const { hashedText, salt } = hashRandomText(password);
    //     user.password = { hash: hashedText, salt };
    //     const docRef = companiesCollection.doc(user.companyId).collection(FIREBASE_CONSTANTS.FIRESTORE.USERS);
    //     await docRef.add(user);
    //     return docRef.id;
    // }

    // updateCompanyUser = async (companyId: string, user: User) => {
    //     const docRef = companiesCollection.doc(user.companyId).collection(FIREBASE_CONSTANTS.FIRESTORE.USERS).doc(user.id);
    //     await docRef.update(user as any);
    // }

    // deleteCompanyUser = async (companyId: string, user: User) => {
    //     const docRef = companiesCollection.doc(user.companyId).collection(FIREBASE_CONSTANTS.FIRESTORE.USERS).doc(user.id);
    //     await docRef.delete();
    // }

    // userExists = async (user: User, email: string): Promise<boolean> => {
    //     const docRef = companiesCollection.doc(user.companyId).collection(FIREBASE_CONSTANTS.FIRESTORE.USERS);
    //     const snapshot = await docRef.where("email", "==", email).get();
    //     return !snapshot.empty;
    // }
}
