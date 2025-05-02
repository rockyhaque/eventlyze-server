
import express from 'express';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.post(
    "/create-notification",
    NotificationController.addNotification
);


export const NotificationRoutes = router;