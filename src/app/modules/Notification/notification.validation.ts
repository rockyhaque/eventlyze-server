import { z } from "zod";


// create Notification validationschema
const createNotificationValidation = z.object({
    message: z.string({
        required_error: "Message is required!"
    })
});



export const notificationValidation = {
    createNotificationValidation,
}