import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { userService } from "./user.service"

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const user = await userService.registerUser(payload)
})

const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const user = await userService.getUserProfile(payload)
})

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const user = await userService.updateUserProfile(payload)
})

export const userController = {
    registerUser,
    getUserProfile,
    updateUserProfile
}