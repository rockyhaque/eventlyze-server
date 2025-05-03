import prisma from "../../../shared/prisma";



// add Notification
const addNotificationIntoDB = async (req: Request) => {
    console.log(req.body);
    // console.log(req.user);

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: req.user?.email,
        },
    });

    console.log(userInfo);
    

    // const result = await prisma.specialties.create({

    // });

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
