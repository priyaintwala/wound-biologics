import { Product } from "../models/product.js";
import { firebaseDB } from "../config/firebase.config.js";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";

const manufacturersCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.MANUFACTURERS
);

const productsCollectionName = FIREBASE_CONSTANTS.FIRESTORE.PRODUCTS;

export class ProductService {
    constructor() {}

    createProduct = async (manufacturerId: string, product: Product) => {
        const docRef = manufacturersCollection
            .doc(manufacturerId)
            .collection(productsCollectionName);
        const addedDocRef = await docRef.add(product);
        const doc = await addedDocRef.get();
        // let addedProduct = await doc.data() as Product;
        // addedProduct.id = doc.id;
        return doc.id;
    };

    getProducts = async (manufacturerId: string) => {
        const docRef = manufacturersCollection
            .doc(manufacturerId)
            .collection(productsCollectionName);
        const querySnapshot = await docRef.get();
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    };

    updateProduct = async (manufacturerId: string, product: Product) => {
        const docRef = manufacturersCollection
            .doc(manufacturerId)
            .collection(productsCollectionName)
            .doc(product.id);
        await docRef.update({ ...product });
        // let doc = await productsCollection.doc(product.id).get();
        // let updatedProduct = await doc.data();
        // updatedProduct.id = doc.id;
        // return updatedProduct;
    };

    deleteProduct = async (manufacturerId: string, productId: string) => {
        const docRef = manufacturersCollection
            .doc(manufacturerId)
            .collection(productsCollectionName)
            .doc(productId);
        await docRef.delete();
    };
}
