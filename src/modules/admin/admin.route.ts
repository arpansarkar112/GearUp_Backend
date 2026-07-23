import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/client"
import { adminController } from "./admin.controller"

const router = Router()

router.get(
    "/users",
    auth(Role.ADMIN),
    adminController.getAllUsers)

router.patch(
    "/users/:id",
    auth(Role.ADMIN),
    adminController.updateUserStatus)

export const adminRoutes = router