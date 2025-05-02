import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { EventRoutes } from "../modules/Event/event.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { ReviewRoutes } from "../modules/Review/review.routes";
import { ParticipantRoutes } from "../modules/Participation/participation.routes";
import { SubscriberRoutes } from "../modules/Subscriber/subscriber.routes";
import { NotificationRoutes } from "../modules/Notification/notification.route";



const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/subscribe",
    route: SubscriberRoutes,
  },
  {
    path: "/event",
    route: EventRoutes,
  },
  {
    path: "/participation",
    route: ParticipantRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
