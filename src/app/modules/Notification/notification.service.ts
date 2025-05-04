

import { Notification } from "@prisma/client";
import prisma from "../../../shared/prisma";


// Admin all notification
const allNotificatoinByAdminIntoDB = async ():Promise<Notification[]> => {
   
    const allNotification =await prisma.notification.findMany({
        where: {
            read: false
        }
    });
    
    console.log(allNotification);
    
    
    return  allNotification

}


// User all notification
const allNotificatoinByUserIntoDB = async () => {
    console.log("user Notification");

}


export const notificationService = {
    allNotificatoinByAdminIntoDB,
    allNotificatoinByUserIntoDB
}
