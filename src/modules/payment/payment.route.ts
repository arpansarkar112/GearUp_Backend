import { Router } from "express";
import express from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client"

const router = Router();

router.post(
    "/checkout",
    auth(Role.CUSTOMER),
    paymentController.createCheckoutSession
);

router.post(
    "/webhook",
    express.raw({ type: 'application/json' }), 
    paymentController.handleWebhook
);

router.get(
    "/",
    auth(Role.CUSTOMER),
    paymentController.getPaymentHistory
);

export const paymentRoutes = router;