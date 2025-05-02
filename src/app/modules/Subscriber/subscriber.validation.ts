import { z } from "zod";

const subscriberSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Enter a valid email address"),
  }),
});

export const subscriberValidation = {
  subscriberSchema,
};
