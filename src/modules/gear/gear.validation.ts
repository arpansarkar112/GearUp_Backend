import { z } from 'zod'

const createGearValidationSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Gear name is required',
        }).min(2, 'Gear name must be at least 2 characters'),

        description: z.string({
            message: 'Description is required',
        }).min(10, 'Description must be at least 10 characters'),

        price: z.number({
            message: 'Price per day is required and must be a number',
        }).positive('Price must be greater than 0'),

        brand: z.string().optional(),

        categoryId: z.string({
            message: 'Category ID is required',
        }).uuid('Invalid category ID format'),

        stock: z.number().int().nonnegative('Stock cannot be negative').optional(), 
        isAvailable: z.boolean().optional(),
    }),
})

const updateGearValidationSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Gear name must be at least 2 characters').optional(),
        description: z.string().min(10, 'Description must be at least 10 characters').optional(),
        price: z.number().positive('Price must be greater than 0').optional(),
        brand: z.string().optional(),
        categoryId: z.string().uuid('Invalid category ID format').optional(),
        stock: z.number().int().nonnegative().optional(),
        isAvailable: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().uuid('Invalid gear ID format in URL parameter'),
    }),
})

const deleteGearValidationSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid gear ID format in URL parameter'),
    }),
})

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Category name is required',
        }).min(2, 'Category name must be at least 2 characters'),
    }),
})

export const gearValidation = {
    createGearValidationSchema,
    updateGearValidationSchema,
    deleteGearValidationSchema,
    createCategoryValidationSchema 
}