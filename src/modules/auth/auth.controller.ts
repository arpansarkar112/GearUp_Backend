import HttpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
    const payload = req.body
    const { accessToken, refreshToken, user } = await authService.loginUser(payload)
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    })

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User logged in successfully",
        data: {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            accessToken, 
            refreshToken
        }
    })
})

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) throw new Error("Refresh token not found");

    const { accessToken } = await authService.refreshToken(token)
    
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000  
    })

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Token Refreshed Successfully",
        data: { accessToken }
    })
})

export const authController = {
    loginUser,
    refreshToken
}