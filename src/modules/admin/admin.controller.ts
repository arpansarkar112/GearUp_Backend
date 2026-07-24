import { NextFunction, Request, Response } from "express"
import HttpStatus from "http-status"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { adminService } from "./admin.service"
import { UserStatus } from "../../../generated/prisma/enums"

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "All users retrieved successfully",
        data: result
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const { status } = req.body 

    const result = await adminService.updateUserStatus(userId as string, status as UserStatus)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: `User status updated successfully`,
        data: result
    })
})

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllGear();

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "All gear retrieved successfully",
        data: result
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllGear
}