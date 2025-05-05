

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


// Update Single Notification Router
router.patch(
    "/:id",
    auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    NotificationController.updateSingleNotificatoin
);


// Update Notification Router
router.patch(
    "/update-notification",
    auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    NotificationController.updateAllNotificatoin
);


export const NotificationRoutes = router;
