import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/checkout",
    auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
    paymentController.createCheckoutSession)

export const paymentRoutes = router