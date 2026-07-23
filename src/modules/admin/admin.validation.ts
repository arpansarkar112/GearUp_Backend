import { z } from 'zod'

const updateUserStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'SUSPENDED'], {
            message: 'Status must be either ACTIVE or SUSPENDED',
        }),
    }),
})

export const adminValidation = {
    updateUserStatusValidationSchema,
}