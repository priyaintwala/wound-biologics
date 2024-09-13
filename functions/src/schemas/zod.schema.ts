import { z } from "zod";

export const userRegistrationSchema = z
    .object({
        email: z.string().email(),
        firstname: z.string(),
        lastname: z.string(),
    })
    .required({
        email: true,
        firstname: true,
        lastname: true,
    })
    .strict();

export const userLoginSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
    })
    .strict();

export const forgotPasswordSchema = z
    .object({
        email: z.string().email(),
    })
    .strict();

export const emailSchema = z
    .object({
        email: z.string().email(),
    })
    .strict();

export const otpSchema = z
    .object({
        email: z.string().email(),
        otp: z.string().length(5),
    })
    .strict();

export const resetPasswordSchema = z
    .object({
        email: z.string().email(),
        newPassword: z.string().min(8),
    })
    .strict();

export const patientSchema = z
    .object({
        firstname: z.string(),
        lastname: z.string(),
        address: z.object({}),
        dateOfBirth: z.date(),
    })
    .strict();

export const comapanyUserSchema = userRegistrationSchema
    .extend({
        companyId: z.string(),
        role: z.string(),
    })
    .required({
        companyId: true,
    })
    .strict();
