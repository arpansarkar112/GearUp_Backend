import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { userService } from "./user.service"
import { sendResponse } from "../../utils/sendResponse"
import HttpStatus from "http-status"

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const user = await userService.registerUser(payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "User registered successfully",
        data: user 
    })
})
    
const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string 

    const profile = await userService.getUserProfile(userId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User profile fetched successfully",
        data: profile 
    })
})

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string
    const payload = req.body
    
    const updatedProfile = await userService.updateUserProfile(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User profile updated successfully",
        data: updatedProfile 
    })
})

export const userController = {
    registerUser,
    getUserProfile,
    updateUserProfile
}