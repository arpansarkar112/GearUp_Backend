import { Request, Response } from "express"
import HttpStatus from "http-status"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { reviewService } from "./review.service"

const createReview = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id as string
    const result = await reviewService.createReview(req.body, customerId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Review submitted successfully",
        data: result
    })
})

const getReviewsByGearId = catchAsync(async (req: Request, res: Response) => {
    const { gearId } = req.params 
    const result = await reviewService.getReviewsByGearId(gearId as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Reviews for gear item retrieved successfully",
        data: result
    })
})

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewService.getAllReviews()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "All reviews retrieved successfully",
        data: result
    })
})

export const reviewController = {
    createReview,
    getReviewsByGearId,
    getAllReviews
}