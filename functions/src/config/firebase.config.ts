import { initializeApp, App, cert, ServiceAccount } from "firebase-admin/app";
import serviceAccountKey from "../../woundbio-firebase-adminsdk-wk8ik-2f8a43c54c.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = serviceAccountKey as ServiceAccount;

const firebaseApp: App = initializeApp({
    credential: cert(serviceAccount),
});

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
export default firebaseApp;
