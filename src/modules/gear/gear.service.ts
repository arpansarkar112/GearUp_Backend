import { prisma } from "../../lib/prisma"
import { ICreateGearPayload, IGearQuery, IUpdateGearPayload } from "./gear.interface"

const createGear = async (payload: ICreateGearPayload, providerId: string) => {
    await prisma.category.findUniqueOrThrow({
        where: { id: payload.categoryId }
    })

    const result = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId
        }
    })
    return result
}

const getAllGear = async (query: IGearQuery) => {
    const limit = query.limit ? Number(query.limit) : 10
    const page = query.page ? Number(query.page) : 1
    const skip = (page - 1) * limit

    const sortBy = query.sortBy ? query.sortBy : "createdAt"
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"

    const andConditions: any[] = []

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: query.searchTerm, mode: "insensitive" } },
                { description: { contains: query.searchTerm, mode: "insensitive" } }
            ]
        })
    }

    if (query.categoryId) andConditions.push({ categoryId: query.categoryId })
    if (query.brand) andConditions.push({ brand: { contains: query.brand, mode: "insensitive" } })

    if (query.minPrice) andConditions.push({ price: { gte: Number(query.minPrice) } })
    if (query.maxPrice) andConditions.push({ price: { lte: Number(query.maxPrice) } })

    andConditions.push({ stock: { gt: 0 } })

    const gear = await prisma.gearItem.findMany({
        where: andConditions.length > 0 ? { AND: andConditions } : {},
        take: limit,
        skip: skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            category: true,
            provider: {
                select: { id: true, name: true, email: true } 
            }
        }
    })

    const totalGearCount = await prisma.gearItem.count({
        where: andConditions.length > 0 ? { AND: andConditions } : {}
    })

    return {
        data: gear,
        meta: {
            page,
            limit,
            total: totalGearCount,
            totalPages: Math.ceil(totalGearCount / limit)
        }
    }
}

const getGearById = async (gearId: string) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearId },
        include: {
            category: true,
            provider: { select: { id: true, name: true } },
            reviews: true 
        }
    })
    return gear
}

const updateGear = async (gearId: string, payload: IUpdateGearPayload, providerId: string, isAdmin: boolean) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearId }
    })

    if (!isAdmin && gear.providerId !== providerId) {
        throw new Error("You do not have permission to update this gear item.")
    }

    const result = await prisma.gearItem.update({
        where: { id: gearId },
        data: payload
    })
    return result
}

const deleteGear = async (gearId: string, providerId: string, isAdmin: boolean) => {
    const gear = await prisma.gearItem.findUniqueOrThrow({
        where: { id: gearId }
    })

    if (!isAdmin && gear.providerId !== providerId) {
        throw new Error("You do not have permission to delete this gear item.")
    }

    await prisma.gearItem.delete({
        where: { id: gearId }
    })
}

const getAllCategories = async () => {
    return await prisma.category.findMany()
}

export const gearService = {
    createGear,
    getAllGear,
    getGearById,
    updateGear,
    deleteGear,
    getAllCategories
}