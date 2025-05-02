import { Gender, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";
const UserRoleEnum = z.nativeEnum(UserRole);
const UserStatusEnum = z.nativeEnum(UserStatus);
const GenderEnum = z.nativeEnum(Gender);

const createUser = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string().optional(),
    role: UserRoleEnum.optional(),
    gender: GenderEnum.optional(),
    photo: z.string().optional(),
    status: UserStatusEnum.optional(),
  }),
});

const createAdmin = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password is required",
    }),
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string().optional(),
    role: UserRoleEnum.optional(),
    gender: GenderEnum.optional(),
    photo: z.string().optional(),
    status: UserStatusEnum.optional(),
  }),
});

export const UserValidation = {
  createUser,
  createAdmin,
};
