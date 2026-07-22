import { Router } from "express";
import { authController } from "./auth.controller";
import { userController } from "../user/user.controller";
import { Role } from "../../../generated/prisma/client"
import { auth } from "../../middlewares/auth";

const router = Router()

router.post("/register", userController.registerUser)

router.post("/login", authController.loginUser)

router.post("/refresh-token", authController.refreshToken)

router.get(
    "/me",
    auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
    userController.getUserProfile)

export const authRoutes = router