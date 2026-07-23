import { prisma } from "../../lib/prisma"
import { ICreateReviewPayload } from "./review.interface"

const createReview = async (payload: ICreateReviewPayload, customerId: string) => {
    const validRental = await prisma.rentalOrder.findFirst({
        where: {
            customerId: customerId,
            status: "RETURNED", 
            orderItems: {
                some: {
                    gearItemId: payload.gearItemId
                }
            }
        }
    })

    if (!validRental) {
        throw new Error("You can only review gear that you have successfully rented and returned.")
    }

    const result = await prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            customerId,
            gearItemId: payload.gearItemId
        },
        include: {
            customer: {
                select: { id: true, name: true }
            },
            gearItem: { select: { id: true, name: true, description:true, brand: true, price: true } }
        }
    })

    return result
}

const getReviewsByGearId = async (gearItemId: string) => {
    return await prisma.review.findMany({
        where: { gearItemId },
        include: {
            customer: { select: { id: true, name: true } },
            gearItem: { select: { id: true, name: true, description:true, brand: true, price: true } }
        },
        orderBy: { createdAt: "desc" }
    })
}

const getAllReviews = async () => {
    return await prisma.review.findMany({
        include: {
            customer: { select: { id: true, name: true } },
            gearItem: { select: { id: true, name: true, description:true, brand: true, price: true } }
        },
        orderBy: { createdAt: "desc" }
    })
}

export const reviewService = {
    createReview,
    getReviewsByGearId,
    getAllReviews
}