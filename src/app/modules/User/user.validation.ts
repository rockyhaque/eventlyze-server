import { z } from "zod";

const createUser = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    user: z.object({
        name: z.string({
            required_error: "Name is required"
        }),
        email: z.string({
            required_error: "Email is required"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required"
        }).optional()
    })
})

const createAdmin = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error: "Name is required"
        }),
        email: z.string({
            required_error: "Email is required"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required"
        }).optional()
    })
})

export const UserValidation = {
    createUser,
    createAdmin
}