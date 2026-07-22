import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client"

const router = Router()

router.put(
    "/my-profile",
    auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
    userController.updateUserProfile
)

export const userRoutes = router