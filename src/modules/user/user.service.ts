import bcrypt from "bcryptjs"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { RegisterUserPayload } from "./user.interface"

const registerUser = async (payload: RegisterUserPayload) => {
    const { name, email, password, role } = payload

    if (role === "ADMIN") {
        throw new Error("You cannot register as an Admin. Admins must be created directly in the database.")
    }

    const safeRole = role === "PROVIDER" ? "PROVIDER" : "CUSTOMER"

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("User with this email already exists")
    }
     
    const saltRounds = Number(config.bcrypt_salt_rounds) || 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: safeRole 
        },
        omit: {
            password: true
        }
    })

    return createdUser
}

const getUserProfile = async (userId: string) => { 
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: {
            password: true
        }
    })

    return user
}

const updateUserProfile = async (userId: string, payload: any) => { 
    const { name, email } = payload
    
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name, 
            email
        },
        omit: {
            password: true
        }
    })
    
    return updatedUser
}

export const userService = {
    registerUser,
    getUserProfile,
    updateUserProfile
}