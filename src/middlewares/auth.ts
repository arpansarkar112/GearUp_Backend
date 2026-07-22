import { NextFunction, Request, Response } from "express"
import { Role } from "../../generated/prisma/client" 
import { catchAsync } from "../utils/catchAsync"
import { jwtUtils } from "../utils/jwt"
import config from "../config"
import { JwtPayload } from "jsonwebtoken"
import { prisma } from "../lib/prisma"

declare global {
    namespace Express{
        interface Request {
            user?: {
                email: string
                name: string
                id: string
                role: Role
            }
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ") ?
            req.headers.authorization?.split(" ")[1]
            : req.headers.authorization
        
        if (!token) throw new Error("You are not logged in. Please log in first to access this resource")

        const decoded = jwtUtils.verifyToken(token, config.jwt_access_secret as string) as JwtPayload
            
        const { id, role } = decoded
        
        if (requiredRoles.length && !requiredRoles.includes(role)){
            throw new Error("Forbidden. You don't have permission to access this resource") 
        }

        const user = await prisma.user.findUnique({
            where: { id }
        })

        if (!user) throw new Error("User not found. Please log in again")
        
        if (user.status !== "ACTIVE") {
            throw new Error("Your account has been suspended. Please contact support")
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }

        next()
    })
}