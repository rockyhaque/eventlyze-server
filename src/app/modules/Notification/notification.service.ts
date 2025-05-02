

// add Notification
const addNotificationIntoDB = async () => {


    const result = await prisma.specialties.create({
        
    });

    return result;
};


export const notificationService = {
    addNotificationIntoDB
}
