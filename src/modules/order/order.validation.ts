import { z } from 'zod'

const createRentalOrderValidationSchema = z.object({
    body: z.object({
        startDate: z.string({
            message: 'Start date is required',
        }).refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid start date format (ISO date string expected)',
        }),

        endDate: z.string({
            message: 'End date is required',
        }).refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid end date format (ISO date string expected)',
        }),

        items: z.array(
            z.object({
                gearItemId: z.string({
                    message: 'Gear Item ID is required',
                }).uuid('Invalid gear item ID format'),
            })
        ).min(1, 'Rental order must contain at least one gear item'),
    }),
})

const updateRentalStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'PICKED_UP', 'RETURNED'], {
            message: 'Status must be PENDING, CONFIRMED, PICKED_UP, RETURNED',
        }),
    }),
})

export const rentalValidation = {
    createRentalOrderValidationSchema,
    updateRentalStatusValidationSchema,
}