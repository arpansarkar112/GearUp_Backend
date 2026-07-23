import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client"
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router()

router.put(
    "/my-profile",
    auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
    validateRequest(userValidation.updateUserProfileValidationSchema),
    userController.updateUserProfile
)

export const userRoutes = router