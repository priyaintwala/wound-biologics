import { firebaseDB } from "../config/firebase.config.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { Role } from "../models/role.js";

const rolesCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.ROLES
);

export class RoleService {
    constructor() {}

    createRole = async (role: Role) => {
        const docRef = rolesCollection;
        await docRef.add(role);
    };

    updateRole = async (role: Role) => {
        const docRef = rolesCollection.doc(role.id);
        await docRef.update({ ...role });
    };

    updateRoleStatus = async (role: Role) => {
        const docRef = rolesCollection.doc(role.id);
        await docRef.update({ isActive: role.isActive });
    };

    deleteRole = async (roleId: string) => {
        const docRef = rolesCollection.doc(roleId);
        await docRef.delete();
    };

    roleExists = async (roleTitle: string) => {
        const docRef = rolesCollection;
        const snapshot = await docRef.where("title", "==", roleTitle).get();
        return !snapshot.empty;
    };
}
