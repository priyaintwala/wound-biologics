import { Request } from "express";
import { User } from "./user.js";

// Extend Request with user and other custom properties
export interface ExtendedExpressRequest extends Request {
    user: User; // Optional user property
    isSuperTest: boolean;
}
