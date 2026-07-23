import { Router } from "express";
import { authController } from "./auth.controller";
import { userController } from "../user/user.controller";
import { Role } from "../../../generated/prisma/client"
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router()

router.post(
    "/register",
    validateRequest(authValidation.registerValidationSchema),
    userController.registerUser)

router.post(
    "/login",
    validateRequest(authValidation.loginValidationSchema),
    authController.loginUser)

router.post("/refresh-token", authController.refreshToken)

router.get(
    "/me",
    auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
    userController.getUserProfile)

export const authRoutes = router