import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
