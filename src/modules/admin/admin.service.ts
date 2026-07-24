import { UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"


const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: { createdAt: "desc" }
    })
}

const updateUserStatus = async (userId: string, status: UserStatus) => {
    const userToUpdate = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    })
    
    if (userToUpdate.role === "ADMIN") {
        throw new Error("You cannot change the status of an Admin account.")
    }

    const result = await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true
        }
    })

    return result
}

const getAllGear = async () => {
    return await prisma.gearItem.findMany({
        include: { category: true, provider: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" }
    });
}

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllGear
}