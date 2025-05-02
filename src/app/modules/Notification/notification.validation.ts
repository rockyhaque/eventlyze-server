import { z } from "zod";


// create Notification validationschema
const createNotificationValidation = z.object({
    message: z.string({
        required_error: "Notification message is required!"
    })
});



export const notificationValidation = {
    createNotificationValidation,
}