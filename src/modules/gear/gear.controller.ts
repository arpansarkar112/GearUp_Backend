import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { gearService } from "./gear.service"
import { sendResponse } from "../../utils/sendResponse"
import HttpStatus from "http-status"

const createGear = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const providerId = req.user?.id as string
    const payload = req.body

    const result = await gearService.createGear(payload, providerId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Gear item added to inventory successfully",
        data: result
    })
})

const getAllGear = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const query = req.query
    const result = await gearService.getAllGear(query)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Gear retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const getGearById = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const gearId = req.params.id

    const result = await gearService.getGearById(gearId as string)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Gear details retrieved successfully",
        data: result
    })
})

const updateGear = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const providerId = req.user?.id as string
    const isAdmin = req.user?.role === "ADMIN"
    const gearId = req.params.id
    const payload = req.body
    
    const result = await gearService.updateGear(gearId as string, payload, providerId, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Gear item updated successfully",
        data: result
    })
})

const deleteGear = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const providerId = req.user?.id as string
    const isAdmin = req.user?.role === "ADMIN"
    const gearId = req.params.id as string
    
    await gearService.deleteGear(gearId, providerId, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Gear item removed from inventory successfully",
        data: null 
    })
})

const createCategory = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const payload = req.body;

    const result = await gearService.createCategory(payload);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Category created successfully",
        data: result
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const categoryId = req.params.id as string;
    const payload = req.body;

    const result = await gearService.updateCategory(categoryId, payload);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Category updated successfully",
        data: result
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const result = await gearService.getAllCategories()

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Categories retrieved successfully",
        data: result
    })
})

const getProviderGear = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const providerId = req.user?.id as string
    const result = await gearService.getProviderGear(providerId)

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Provider gear retrieved successfully",
        data: result
    })
})

export const gearController = {
    createGear,
    getAllGear,
    getProviderGear,
    getGearById,
    updateGear,
    deleteGear,
    createCategory,
    updateCategory,
    getAllCategories
}