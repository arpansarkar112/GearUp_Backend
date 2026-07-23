import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";
import config from "../../config";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { rentalOrderId } = req.body; 

    const result = await paymentServices.createCheckoutSession(userId as string, rentalOrderId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Checkout session created successfully",
        data: result
    });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const eventBuffer = req.body; 
    const signature = req.headers['stripe-signature'] as string;
    const endpointSecret = config.stripe_webhook_secret as string; 

    await paymentServices.handleWebhook(eventBuffer, signature, endpointSecret);
    
    res.status(HttpStatus.OK).json({ received: true });
});

export const paymentController = {
    createCheckoutSession,
    handleWebhook
}