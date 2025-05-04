import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { INotification } from "./notification.interface";
import { User } from "@prisma/client";
import { TAuthUser } from "../../interfaces/common";



// Admin all notification
const allNotificatoinByAdminIntoDB = async () => {
    console.log("admin Notification");

}


// User all notification
const allNotificatoinByUserIntoDB = async () => {
    console.log("user Notification");

}


export const notificationService = {
    // addNotificationIntoDB,
    allNotificatoinByAdminIntoDB,
    allNotificatoinByUserIntoDB
}
