

import { Notification } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";


// get all notification
const allNotificatoinIntoDB = async (user: JwtPayload): Promise<{
    allNotifications: Notification[];
    totalUnReadNotification: number;
}> => {

    // Check if user is admin/superadmin
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const allNotification = await prisma.notification.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

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

        if (!existingUser) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
        }

        const allNotificationUser = await prisma.notification.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                userId: existingUser?.id
            }
        });

        const unReadUserNotification = await prisma.notification.findMany({
            where: {
                userId: existingUser?.id,
                readUser: false as any
            }
        });

        // total Notification by User
        const totalUnreadNotification = unReadUserNotification.length;

        return {
            allNotifications: allNotificationUser,
            totalUnReadNotification: totalUnreadNotification
        };
    }
};


// Update Single notifications
const updateSingleNotificatoinIntoDB = async (user: JwtPayload, id: string) => {


    // Check if user is admin/superadmin
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const updateNotificationByAdmin = await prisma.notification.update({
            where: {
                id: id
            },
            data: {
                read: true
            }
        });

        // const deletedCount = await deleteOldNotifications();
        // console.log(deletedCount);


        return updateNotificationByAdmin;
    }

    // For regular users 
    else {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        if (!existingUser) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
        }

        const updateNotificationByUser = await prisma.notification.update({
            where: {
                userId: existingUser?.id,
                id: id
            },
            data: {
                readUser: true,
            }
        });

        return updateNotificationByUser;
    }

};


// Update notification
const updateAllNotificatoinIntoDB = async (user: JwtPayload) => {

    // Check if user is admin/superadmin
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        const updateNotificationByAdmin = await prisma.notification.updateMany({
            where: {
                read: false
            },
            data: {
                read: true
            }
        });

        return updateNotificationByAdmin;
    }

    // For regular users 
    else {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        if (!existingUser) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
        }

        const updateNotificationByUser = await prisma.notification.updateMany({
            where: {
                userId: existingUser?.id,
                readUser: false
            },
            data: {
                readUser: true,
            }
        });

        return updateNotificationByUser;
    }

};


export const notificationService = {
    allNotificatoinIntoDB,
    updateAllNotificatoinIntoDB,
    updateSingleNotificatoinIntoDB
}
