import { Role } from "../../../generated/prisma/client";

export interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    role: Role; 
}