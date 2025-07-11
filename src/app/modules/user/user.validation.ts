import { z } from "zod";
import { IsActive, Role } from "./user.interface";

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
const bdPhoneRegex = /^01[3-9]\d{8}$/;

export const userCreateZodSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => uppercaseRegex.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => lowercaseRegex.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => numberRegex.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => specialCharRegex.test(val), {
      message: "Password must contain at least one special character",
    }),

  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .regex(bdPhoneRegex, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g., 01XXXXXXXXX)",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "User should be a character" })
    .optional(),
});

export const userUpdateZodSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .optional(),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => uppercaseRegex.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => lowercaseRegex.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => numberRegex.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => specialCharRegex.test(val), {
      message: "Password must contain at least one special character",
    })
    .optional(),

  phone: z
    .string({
      required_error: "Phone number is required",
    })
    .regex(bdPhoneRegex, {
      message:
        "Phone number must be a valid Bangladeshi number (e.g., 01XXXXXXXXX)",
    })
    .optional(),
  isDelete: z
    .boolean({ invalid_type_error: "isDelete should be true or false" })
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified should be true or false" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  address: z
    .string({ invalid_type_error: "User should be a character" })
    .optional(),
});