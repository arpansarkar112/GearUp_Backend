import { Router } from "express"
import { gearController } from "./gear.controller"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/client"

const router = Router()

router.get("/categories", gearController.getAllCategories)

router.get("/", gearController.getAllGear)
router.get("/:id", gearController.getGearById)

router.post("/categories", 
    auth(Role.ADMIN), 
    gearController.createCategory)

const providerRouter = Router()

providerRouter.post(
    "/",
    auth(Role.ADMIN, Role.PROVIDER),
    gearController.createGear)

providerRouter.put(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER),
    gearController.updateGear)

providerRouter.delete(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER),
    gearController.deleteGear)


export const gearRoutes = router
export const providerGearRoutes = providerRouter