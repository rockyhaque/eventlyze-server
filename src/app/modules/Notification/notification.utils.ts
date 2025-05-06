
import prisma from "../../../shared/prisma";


// Delete Notification function
export const deleteOldNotifications = async () => {

    // const sevenDaysAgo = new Date();
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 1);

    const deleteResult = await prisma.notification.deleteMany({
        where: {
            read: true,
            readUser: true,
            updatedAt: {
                // lte: sevenDaysAgo
                lte: twoMinutesAgo            }
        }
    });

    return deleteResult.count;
};