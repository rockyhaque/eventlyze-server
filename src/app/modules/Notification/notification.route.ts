
import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();


// Create Notification Route
// router.post(
//     "/create-notification",
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
//     NotificationController.addNotification
// );


// All Notification Route By Admin
router.get(
    "/admin-notification",
    NotificationController.allNotificationByAdmin
);


// All Notification Route By User
router.get(
    "/user-notification",
    NotificationController.allNotificationByUser
);


export const NotificationRoutes = router;