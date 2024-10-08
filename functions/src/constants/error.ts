export const ERROR_MESSAGES = {
    UNAUTHORIZED:"UNAUTHORIZED",
    SESSION_EXPIRED: "SESSION_EXPIRED",
    UNAUTHENTICATED: "Unauthenticated",
    INTERNAL_SERVER_ERROR:"INTERNAL_SERVER_ERROR",
    INVALID_DATA:"INVALID_DATA",
    MIDDLEWARE:{
        INTERNAL_SERVER_ERROR: "Internal Server Error",
        INVALID_DATA:"Invalid data",
        INVALID_AUTHORIZATION_FORMAT: "Invalid authorization format",
    },
    AUTH:{
        INVALID_CREDS:"INVALID_CREDS",
        INACTIVE_USER: "INACTIVE_USER",
        ACCOUNT_LOCKED:"ACCOUNT_LOCKED",
        INVALID_VERIFY_REQUEST:"INVALID_VERIFY_REQUEST",
        OTP_ALREDAY_VERIFIED:"OTP_ALREDAY_VERIFIED",
        EXPIRED_CODE:"EXPIRED_CODE",
        INVALID_CODE:"INVALID_CODE",
        INVALID_RESET_REQUEST:"INVALID_RESET_REQUEST",
    },
    USER:{
        USER_NOT_REGISTERED:"USER_NOT_REGISTERED",
        USER_EXISTS:"USER_EXISTS",
        USER_NOT_EXISTS:"USER_NOT_EXISTS",
    },
    COMPANY:{
        COMPANY_NOT_EXISTS:"COMPANY_NOT_EXISTS"
    },
    MANUFACTURER:{
        MANUFACTURER_NOT_EXISTS:"MANUFACTURER_NOT_EXISTS"
    },
    ORDER:{
        ORDER_NOT_EXISTS:"ORDER_NOT_EXISTS",
    },
    PATIENT:{
        PATIENT_NOT_EXISTS:"PATIENT_NOT_EXISTS"
    },
    UTILS:{
        HASH_TEXT_ERR:"HASH_TEXT_ERR",
        COMPARE_TEXT_ERR:"COMPARE_TEXT_ERR",
    }
};
