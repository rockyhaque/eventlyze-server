

import { Notification } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";


// get all notification
const allNotificatoinIntoDB = async (user: JwtPayload): Promise<{
    allNotifications: Notification[];
    totalUnReadNotification: number;
}> => {

    // Check if user is admin/superadmin
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const allNotification = await prisma.notification.findMany();

        const unReadNotification = await prisma.notification.findMany({
            where: {
                read: false
            }
        });

        const totalUnreadNotification = unReadNotification.length;

        return {
            allNotifications: allNotification,
            totalUnReadNotification: totalUnreadNotification
        };
    }
    // For regular users
    else {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        const allNotificationUser = await prisma.notification.findMany({
            where: {
                userId: existingUser?.id
            }
        });

        const unReadUserNotification = await prisma.notification.findMany({
            where: {
                userId: existingUser?.id,
                read: false
            }
        });

        const totalUnreadNotification = unReadUserNotification.length;

        return {
            allNotifications: allNotificationUser,
            totalUnReadNotification: totalUnreadNotification
        };
    }
};

// User all notification
const allNotificatoinByUserIntoDB = async () => {
    console.log("user Notification");

}


export const notificationService = {
    allNotificatoinIntoDB,
    allNotificatoinByUserIntoDB
}
