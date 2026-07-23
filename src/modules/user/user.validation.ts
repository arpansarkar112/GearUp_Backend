import { z } from 'zod'

const updateUserProfileValidationSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'Name must be a string',
        }).min(2, 'Name must be at least 2 characters').optional(),

        email: z.string({
            message: 'Email must be a string',
        }).email('Invalid email address format').optional(),
    })
})

export const userValidation = {
    updateUserProfileValidationSchema,
}