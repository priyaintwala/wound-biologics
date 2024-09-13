import { Manufacturer } from "../models/manufacturer.js";
import { firebaseDB } from "../config/firebase.config.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { ERROR_MESSAGES } from "../constants/error.js";

const manufacturersCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.MANUFACTURERS
);

export class ManufacturerService {
    constructor() {}

    createManufacturer = async (manufacturer: Manufacturer) => {
        const docRef = manufacturersCollection;
        const addedDocRef = await docRef.add(manufacturer);
        const doc = await addedDocRef.get();
        // let addedManufacturer = await doc.data() as Manufacturer;
        // addedManufacturer.id = doc.id;
        return doc.id;
    };

    getManufacturerById = async (manufacturerId: string) => {
        const docRef = manufacturersCollection.doc(manufacturerId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error(ERROR_MESSAGES.MANUFACTURER.MANUFACTURER_NOT_EXISTS);
        } else {
            return doc.data() as Manufacturer;
        }
    };

    updateManufacturer = async (manufacturer: Manufacturer) => {
        const docRef = manufacturersCollection.doc(manufacturer.id);
        await docRef.update({ ...manufacturer });
        await manufacturersCollection.doc(manufacturer.id).get();
        // let updatedManufacturer = await doc.data();
        // updatedManufacturer.id = doc.id;
        // return updatedManufacturer;
    };

    deleteManufacturer = async (manufacturerId: string) => {
        const docRef = manufacturersCollection.doc(manufacturerId);
        await docRef.delete();
    };
}
