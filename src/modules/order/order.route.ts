import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/client"
import { rentalController } from "./order.controller"

// CUSTOMER ROUTES 
const router = Router()
router.post("/", auth(Role.CUSTOMER), rentalController.createRental)
router.get("/", auth(Role.CUSTOMER), rentalController.getMyRentals)
export const customerRentalRoutes = router


// PROVIDER ROUTES 
const providerOrderRouter = Router()
providerOrderRouter.get("/", auth(Role.PROVIDER), rentalController.getProviderOrders)
providerOrderRouter.patch("/:id", auth(Role.PROVIDER, Role.ADMIN), rentalController.updateOrderStatus)
export const providerOrderRoutes = providerOrderRouter


// ADMIN ROUTES 
const adminRentalRouter = Router()
adminRentalRouter.get("/", auth(Role.ADMIN), rentalController.getAllRentalsAdmin)
export const adminRentalRoutes = adminRentalRouter