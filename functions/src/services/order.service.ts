import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { firebaseDB } from "../config/firebase.config.js";
import { Order } from "../models/order.js";
import { DateTime } from "luxon";
import { FIREBASE_CONSTANTS } from "../constants/firebase.js";
import { OrderStatus } from "../constants/enums.js";
import { convertToJsDate } from "../utils/firbase.util.js";
import { logger } from "firebase-functions";
import { ERROR_MESSAGES } from "../constants/error.js";

const ordersCollection = firebaseDB.collection(
    FIREBASE_CONSTANTS.FIRESTORE.ORDERS
);

export default class OrderService {
    constructor() {}

    /**
     * @description Filtering orders based on input filters parameters
     * @param userId
     * @param filterParams
     * @returns
     */
    getOrders = async (userId: string, filterParams: any) => {
        filterParams.status = filterParams.status
            ? filterParams.status.split(",")
            : [];
        //TODO: Pass logged in userid
        userId = "";
        let orderQuery;
        let resultOrders = [];
        if (filterParams.days) {
            // Filter by last number of days
            const beforeNumberOfDays = DateTime.now()
                .minus({ days: filterParams.days })
                .startOf("day");
            const beforeNumberOfDaysTimeStamp = Timestamp.fromDate(
                beforeNumberOfDays.toJSDate()
            );
            orderQuery = ordersCollection.where(
                "orderDate",
                ">=",
                beforeNumberOfDaysTimeStamp
            );
        } else if (filterParams.startDate && filterParams.endDate) {
            // Filter by custom range of date
            const startDate = Timestamp.fromDate(
                new Date(filterParams.startDate)
            );
            // To adjust the full end date instead of starting of end day.
            const endDatePlusOneDay = DateTime.fromISO(
                filterParams.endDate
            ).plus({ days: 1 });
            const endDate = Timestamp.fromDate(endDatePlusOneDay.toJSDate());
            orderQuery = ordersCollection
                .where("orderDate", ">=", startDate)
                .where("orderDate", "<=", endDate);
        } else if (filterParams.patientId) {
            // Filter by patientid
            orderQuery = ordersCollection.where(
                "patientId",
                "==",
                filterParams.patientId
            );
        } else {
            orderQuery = ordersCollection;
        }

        // Add status in query
        if (filterParams.status.length) {
            orderQuery = orderQuery.where("status", "in", filterParams.status);
        }

        //TODO: If logged in user is company Admin or specific company user then fetch only that company data.

        // orderQuery.where("patientId");

        const snapshot = await orderQuery.get();

        if (snapshot.empty) {
            logger.info(`No orders for userid ${userId}`);
            return [];
        }

        const promiseArray = [];
        snapshot.forEach((doc) => {
            const order = doc.data();
            order.id = doc.id;
            promiseArray.push(this.processOrderData(order));
        });
        resultOrders = await Promise.all(promiseArray);
        return resultOrders;
    };

    getOrderById = async (orderId: string) => {
        //TODO: Only allow if logged in user is company admin of that company or system admin
        const orderRef = ordersCollection.doc(orderId);
        const doc = await orderRef.get();
        if (!doc.exists) {
            throw new Error(ERROR_MESSAGES.ORDER.ORDER_NOT_EXISTS);
        } else {
            const order = doc.data();
            order.id = doc.id;
            return await this.processOrderData(order);
        }
    };

    createOrder = async (order: Order) => {
        order.orderDate = order.updatedDate = FieldValue.serverTimestamp();
        const res = await ordersCollection.add(order);
        ordersCollection
            .doc(res.id)
            .collection(FIREBASE_CONSTANTS.FIRESTORE.ORDERS_STATUS_HISTORY)
            .add({
                status: order.status || OrderStatus.PENDING,
                timestamp: FieldValue.serverTimestamp(),
            });
        return res.id;
    };

    updateOrder = async (order: Order) => {
        //TODO: Only allow if logged in user is company admin of that company or system admin
        order.updatedDate = FieldValue.serverTimestamp();
        const orderRef = ordersCollection.doc(order.id);
        const existingOrderRef = await orderRef.get();
        const existingOrderDetails = await existingOrderRef.data();
        await orderRef.update({ ...order });
        //If status is updated then only need to add status
        if (existingOrderDetails.status !== order.status) {
            const orderStatusHistoryRef = orderRef.collection(
                FIREBASE_CONSTANTS.FIRESTORE.ORDERS_STATUS_HISTORY
            );
            await orderStatusHistoryRef.add({
                status: order.status,
                timestamp: FieldValue.serverTimestamp(),
            });
        }
    };

    deleteOrder = async (orderId: string) => {
        const docRef = ordersCollection.doc(orderId);
        await docRef.delete();
    };

    processOrderData = async (order) => {
        order = convertToJsDate([order]);
        const statusHistorySnapshot = await ordersCollection
            .doc(order.id)
            .collection(FIREBASE_CONSTANTS.FIRESTORE.ORDERS_STATUS_HISTORY)
            .orderBy("timestamp")
            .get();

        if (statusHistorySnapshot.docs?.length) {
            order.statusHistory = statusHistorySnapshot.docs.map((doc) =>
                doc.data()
            );
            order.statusHistory = convertToJsDate(order.statusHistory);
        }
        return order;
    };
}
