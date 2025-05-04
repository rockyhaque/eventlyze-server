

import { Notification } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";


// Admin all notification
const allNotificatoinByAdminIntoDB = async (user: JwtPayload): Promise<
    {
        allNotifications: Notification[];
        totalUnderdNotification: number;
    }
> => {

    // console.log(user.role);


    // *********************** if user role= admin/superadmin

    // const allNotification = await prisma.notification.findMany();

    // const unReadNotification = await prisma.notification.findMany({
    //     where: {
    //         read: false
    //     }
    // });

    // const totalUnreadNotification = unReadNotification.length

    // return {
    //     allNotifications: allNotification,
    //     totalUnderdNotification: totalUnreadNotification
    // }


        // *********************** if user role=user

    // if user role= user
    const existingUser = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    });

    // console.log(existingUser?.id);
    

    const allNotificationUser = await prisma.notification.findMany({
        where: {
            userId: existingUser?.id
        }
    });

    // console.log(allNotificationUser);
    

    const unReadUserNotification = await prisma.notification.findMany({
        where: {
            read: false
        }
    });

    // console.log(unReadNotification);
    

    const totalUnreadNotification = unReadUserNotification.length
    // console.log(totalUnreadNotification);
    

    return {
        allNotifications: allNotificationUser,
        totalUnderdNotification: totalUnreadNotification
    }

}


// User all notification
const allNotificatoinByUserIntoDB = async () => {
    console.log("user Notification");

}


export const notificationService = {
    allNotificatoinByAdminIntoDB,
    allNotificatoinByUserIntoDB
}
