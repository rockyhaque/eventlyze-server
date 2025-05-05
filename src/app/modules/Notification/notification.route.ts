

import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();



// All Notification Route
router.get(
    "/all-notification",
    auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    NotificationController.allNotification
);


// All Notification Route By User
router.get(
    "/user-notification",
    NotificationController.allNotificationByUser
);


export const NotificationRoutes = router;
