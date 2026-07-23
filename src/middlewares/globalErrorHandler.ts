import { NextFunction, Request, Response } from "express"
import HttpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client"
import { ZodError } from "zod"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error: ", err)

    let statusCode: number = err?.statusCode || err?.status || HttpStatus.BAD_REQUEST
    let errorMessage: string = err?.message || "Something went wrong!"
    let errorName: string = err?.name || "Internal Server Error"
    let errorStack = err?.stack || null
    let errorDetails: any = null

    // ZOD VALIDATION ERRORS
    if (err instanceof ZodError) {
        statusCode = HttpStatus.BAD_REQUEST
        errorMessage = "Validation Error"
        errorName = "ZodValidationError"
        errorDetails = err.issues.map((issue) => ({
            field: issue.path[issue.path.length - 1] || "unknown",
            message: issue.message
        }))
    } 
    // PRISMA VALIDATION ERRORS
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = HttpStatus.BAD_REQUEST
        errorMessage = "You have provided incorrect field type or missing fields"
    } 
    // PRISMA KNOWN REQUEST ERRORS
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = HttpStatus.BAD_REQUEST
            errorMessage = "Duplicate Key Error"
        } else if (err.code === "P2003") {
            statusCode = HttpStatus.BAD_REQUEST
            errorMessage = "Foreign Key Constraint failed"
        } else if (err.code === "P2025") {
            statusCode = HttpStatus.BAD_REQUEST
            errorMessage = "An operation failed because it depends on one or more records that were required but not found"
        }
    } 
    // PRISMA INITIALIZATION ERRORS
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = HttpStatus.UNAUTHORIZED
            errorMessage = "Authentication failed against database server. Please check your credentials"
        } else if (err.errorCode === "P1001") {
            statusCode = HttpStatus.UNAUTHORIZED
            errorMessage = "Cannot reach database server. Please check your credentials"
        }
    } 
    // PRISMA UNKNOWN REQUEST ERRORS
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        errorMessage = "Error occurred during execution"
    }

    if (!errorDetails) {
        errorDetails = {
            statusCode,
            errorCode: err?.code || err?.errorCode || null,
            name: errorName,
            error: errorStack
        }
    }

    res.status(statusCode).json({
        success: false,
        message: errorMessage,
        errorDetails
    })
}