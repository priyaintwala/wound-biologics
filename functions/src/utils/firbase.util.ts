import { Timestamp } from "firebase-admin/firestore";

export function convertToJsDate(inputArray: object[]) {
    inputArray.forEach((object) => {
        for (const key in object) {
            const value = object[key];
            if (value instanceof Timestamp) {
                object[key] = value.toDate();
            }
        }
    });
    return inputArray.length == 1 ? inputArray[0] : inputArray;
}
