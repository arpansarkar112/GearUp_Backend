import { z } from 'zod'

const createReviewValidationSchema = z.object({
    body: z.object({
        gearItemId: z.string({
            message: 'Gear Item ID is required',
        }).uuid('Invalid gear item ID format'),

        rating: z.number({
            message: 'Rating is required',
        })
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),

        comment: z.string({
            message: 'Comment is required',
        }).min(3, 'Comment must be at least 3 characters'),
    }),
})

export const reviewValidation = {
    createReviewValidationSchema,
}