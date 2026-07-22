import { Router } from "express";
import { userController } from "./user.controller";

const router = Router()

router.post("/register", userController.registerUser)

router.get("/:id", userController.getUserProfile)

router.put("/:id", userController.updateUserProfile)

export const userRoutes = router