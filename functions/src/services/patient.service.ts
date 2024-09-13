import { Patient } from "../models/patient.js";
import { firebaseDB } from "../config/firebase.config.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import { ERROR_MESSAGES } from "../constants/error.js";

const patientsCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.PATIENTS
);
const countersCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.COUNTERS
);

export class PatientService {
    constructor() {}

    getPatients = async (filterParams: any) => {
        let patientQuery;
        const patients = [];
        if (filterParams.companyId) {
            patientQuery = patientsCollection.where(
                "companyId",
                "==",
                filterParams.companyId
            );
        } else {
            patientQuery = patientsCollection;
        }

        //Todo: If logged in user is company admin then allow to fetch patients of only that company.

        const snapshot = await patientQuery.get();
        if (snapshot.empty) {
            return [];
        }

        snapshot.forEach((doc) => {
            const patient = doc.data();
            patient.id = doc.id;
            patients.push(patient);
        });

        return patients;
    };

    getPatientById = async (patientId: string) => {
        //TODO: Only allow if logged in user is company admin of that company or system admin
        // Same we need to think for the manufacturer side as well
        const docRef = patientsCollection.doc(patientId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new Error(ERROR_MESSAGES.PATIENT.PATIENT_NOT_EXISTS);
        } else {
            return doc.data() as Patient;
        }
    };

    createPatient = async (patient: Patient) => {
        //Step1: Fetch counter for patient id
        const patientCounterDoc = await countersCollection
            .doc("patientIdCounter")
            .get();
        const patientCounter = patientCounterDoc.data();
        const patientId = patientCounter?.counter ?? 123;
        //Step2: Create a patient in patients collection name
        await patientsCollection.doc(`${patientId}`).set(patient);
        //Step3: Update latest count of patient id in counters collection
        await countersCollection.doc("patientIdCounter").set(
            {
                counter: patientCounter?.counter
                    ? FieldValue.increment(1)
                    : 124,
            },
            { merge: true }
        );
        return patientId;
    };

    updatePatient = async (patient: Patient) => {
        const docRef = patientsCollection.doc(patient.id);
        await docRef.update({ ...patient });
    };

    deletePatient = async (patientId: string) => {
        const docRef = patientsCollection.doc(patientId);
        await docRef.delete();
    };
}
