import express, { Router } from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import companyRouter from "./company.route.js";
import roleRouter from "./role.route.js";
import orderRouter from "./order.route.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import manufacturerRouter from "./manufacturer.route.js";
import patientRouter from "./patient.route.js";
import auditLogsRouter from "./auditlogs.route.js";
import googleDriveRouter from "./google-drive.route.js";
import distributorRouter from "./distributor.route.js";
import salesExecutiveRouter from "./sales-executive.route.js";
import clinicGroupRouter from "./clinic-group.route.js";
import cliniciansRouter from "./clinicians.route.js";

const indexRouter: Router = express.Router();

console.log("hello");
indexRouter.use("/gdrive", googleDriveRouter);
indexRouter.use("/auth", authRouter);
indexRouter.use("/users", userRouter);
indexRouter.use(verifyToken);
indexRouter.use("/distributor",distributorRouter);
indexRouter.use("/salesexecutive", salesExecutiveRouter);
indexRouter.use("/clinicgroup", clinicGroupRouter);
indexRouter.use("/clinicians", cliniciansRouter);
indexRouter.use("/companies", companyRouter);
indexRouter.use("/manufacturers", manufacturerRouter);
indexRouter.use("/roles", roleRouter);
indexRouter.use("/orders", orderRouter);
indexRouter.use("/patients", patientRouter);
indexRouter.use("/auditlogs", auditLogsRouter);

export default indexRouter;
