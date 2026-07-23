import { z } from 'zod'

const registerValidationSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Name is required and must be a string',
        }).min(2, 'Name must be at least 2 characters'),

        email: z.string({
            message: 'Email is required',
        }).email('Invalid email address'),

        password: z.string({
            message: 'Password is required',
        }).min(6, 'Password must be at least 6 characters'),

        role: z.enum(['CUSTOMER', 'PROVIDER'], {
            message: 'Role must be either CUSTOMER or PROVIDER',
        }).optional(),
    }),
})

const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({
            message: 'Email is required',
        }).email('Invalid email address'),

        password: z.string({
            message: 'Password is required',
        }).min(1, 'Password is required'), 
    }),
})

export const authValidation = {
    registerValidationSchema,
    loginValidationSchema,
}