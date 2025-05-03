

// add Notification
const addNotificationIntoDB = async (message: string) => {

    // const result = await prisma.specialties.create({
        
    // });

    console.log("service", message);
    

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
