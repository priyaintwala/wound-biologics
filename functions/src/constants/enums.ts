export enum Roles {
    SYSTEM_ADMIN = "systemadmin",
    ADMIN = "admin",
    COMPANY_ADMIN = "companyadmin",
    USER = "user",
    DISTRIBUTOR = "distributor",
    SALESEXECUTIVE = "salesexecutive",
    CLINICGROUP = "clinicgroup",
    CLINICIANS = "clinicians"
}

export enum HttpStatusCodes {
    BAD_REQUEST = 400,
    OK = 200,
    UNAUTHORIZED = 401,
    INTERNAL_SERVER_ERROR = 500,
}

export enum OrderStatus {
    PENDING = "Pending",
    COMPLETED = "Completed",
    AWAITING_PAYMENT = "Awaiting Payment",
    PAID = "Paid",
}
