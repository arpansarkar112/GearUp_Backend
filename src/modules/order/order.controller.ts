import { NextFunction, Request, Response } from "express"
import HttpStatus from "http-status"
import { catchAsync } from "../../utils/catchAsync"
import { rentalService } from "./order.service"
import { sendResponse } from "../../utils/sendResponse"
import { OrderStatus } from "../../../generated/prisma/enums"


const createRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.id as string
    const result = await rentalService.createRentalOrder(req.body, customerId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Rental order created successfully",
        data: result
    })
})

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id as string
    const result = await rentalService.getMyRentals(customerId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Your rental orders retrieved successfully",
        data: result
    })
})

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.user?.id as string
    const result = await rentalService.getProviderOrders(providerId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Incoming rental orders retrieved successfully",
        data: result
    })
})

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const providerId = req.user?.id as string
    const isAdmin = req.user?.role === "ADMIN"
    const orderId = req.params.id as string
    const { status } = req.body 

    const result = await rentalService.updateOrderStatus(orderId, status as OrderStatus, providerId, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: `Order status updated to ${status}`,
        data: result
    })
})

const getAllRentalsAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.getAllRentals()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "All platform rental orders retrieved successfully",
        data: result
    })
})

export const rentalController = {
    createRental,
    getMyRentals,
    getProviderOrders,
    updateOrderStatus,
    getAllRentalsAdmin
}