import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { IloginUser } from "./auth.interface"
import { jwtUtils } from "../../utils/jwt"
import config from "../../config"


const loginUser = async (payload: IloginUser) => {
    const { email, password } = payload

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.status !== "ACTIVE") {
        throw new Error("Your account has been suspended. Please contact support.")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) throw new Error("Password is incorrect")

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    )

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    )

    return { accessToken, refreshToken, user }
}

const refreshToken = async (currentRefreshToken: string) => {
    const decoded = jwtUtils.verifyToken(currentRefreshToken, config.jwt_refresh_secret as string)
    
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: decoded.id }
    })

    if (user.status !== "ACTIVE") throw new Error("User account is suspended!")
    
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const newAccessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
    )

    const newRefreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    )

    return { 
        accessToken: newAccessToken, 
        refreshToken: newRefreshToken 
    }
}

export const authService = {
    loginUser,
    refreshToken
}