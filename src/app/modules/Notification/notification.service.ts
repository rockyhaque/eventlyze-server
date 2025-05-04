import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { INotification } from "./notification.interface";
import { User } from "@prisma/client";
import { TAuthUser } from "../../interfaces/common";



// add Notification
// const addNotificationIntoDB = async (req: Request):Promise<INotification> => {
const addNotificationIntoDB = async (notification: INotification, user: TAuthUser | undefined) => {
    // console.log(req.body);
    // console.log(req.user);

    // console.log(notification, user);

    if (notification.eventId) {
        const eventExists = await prisma.event.findUnique({
            where: { id: notification.eventId },
        });

        if (!eventExists) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Event not found');
        }
    }

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
        },
    });

    // console.log("userInfo", userInfo);


    if (!userInfo) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const userId = userInfo?.id
    // console.log(userId);

    const notificationData = {
        userId: userId,
        eventId: notification?.eventId,
        message: notification?.message
    }

    // console.log(notificationData);




    // const result = await prisma.notification.create({
    //     data: notificationData as INotification

    // })
    // const result = await prisma.notification.create({
    //     data: notificationData as INotification
    // })

    // console.log(result);



    // console.log("service", message);


    // return result;
    return null
};


// Admin all notification
const allNotificatoinByAdminIntoDB = async () => {
    console.log("admin Notification");

}


// User all notification
const allNotificatoinByUserIntoDB = async () => {
    console.log("user Notification");

}


export const notificationService = {
    addNotificationIntoDB,
    allNotificatoinByAdminIntoDB,
    allNotificatoinByUserIntoDB
}
