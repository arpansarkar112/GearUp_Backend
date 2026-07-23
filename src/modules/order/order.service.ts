import { OrderStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreateRentalPayload } from "./order.interface"

const createRentalOrder = async (payload: ICreateRentalPayload, customerId: string) => {
    const start = new Date(payload.startDate)
    const end = new Date(payload.endDate)

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1 

    const uniqueGearIds = [...new Set(payload.gearItemIds)]

    const gearItems = await prisma.gearItem.findMany({
        where: { id: { in: uniqueGearIds } }
    })

    if (gearItems.length !== uniqueGearIds.length) {
        throw new Error("One or more gear items were not found or are unavailable.")
    }

    const totalAmount = payload.gearItemIds.reduce((sum, id) => {
        const item = gearItems.find(g => g.id === id)
        return sum + (item?.price || 0)
    }, 0) * diffDays

    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.rentalOrder.create({
            data: {
                startDate: start,
                endDate: end,
                totalAmount,
                customerId,
                orderItems: {
                    create: payload.gearItemIds.map(id => ({
                        gearItemId: id
                    }))
                }
            },
            include: {
                orderItems: { include: { gearItem: true } }
            }
        })
        return order
    })

    return result
}

const getMyRentals = async (customerId: string) => {
    return await prisma.rentalOrder.findMany({
        where: { customerId },
        include: {
            orderItems: { include: { gearItem: true } },
            payment: true 
        },
        orderBy: { createdAt: "desc" }
    })
}

const getProviderOrders = async (providerId: string) => {
    return await prisma.rentalOrder.findMany({
        where: {
            orderItems: {
                some: {
                    gearItem: { providerId }
                }
            }
        },
        include: {
            orderItems: { include: { gearItem: true } },
            customer: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: "desc" }
    })
}

const updateOrderStatus = async (orderId: string, status: OrderStatus, providerId: string, isAdmin: boolean) => {
    if (!isAdmin) {
        const orderHasProviderGear = await prisma.rentalOrder.findFirst({
            where: {
                id: orderId,
                orderItems: { some: { gearItem: { providerId } } }
            }
        })
        if (!orderHasProviderGear) throw new Error("You do not have permission to update this order.")
    }

    return await prisma.rentalOrder.update({
        where: { id: orderId },
        data: { status },
        include: { customer: { select: { id: true, email: true } } }
    })
}

const getAllRentals = async () => {
    return await prisma.rentalOrder.findMany({
        include: {
            customer: { select: { name: true, email: true } },
            orderItems: { include: { gearItem: true } }
        },
        orderBy: { createdAt: "desc" }
    })
}

export const rentalService = {
    createRentalOrder,
    getMyRentals,
    getProviderOrders,
    updateOrderStatus,
    getAllRentals
}