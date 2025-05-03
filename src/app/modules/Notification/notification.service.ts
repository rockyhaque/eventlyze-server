

// add Notification
const addNotificationIntoDB = async () => {

    // const result = await prisma.specialties.create({
        
    // });

    console.log("notification");
    

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
