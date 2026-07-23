import { Router } from "express"
import { gearController } from "./gear.controller"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/client"
import { validateRequest } from "../../middlewares/validateRequest"
import { gearValidation } from "./gear.validation"

const router = Router()

router.get("/categories", gearController.getAllCategories)

router.get("/", gearController.getAllGear)
router.get("/:id", gearController.getGearById)

router.post("/categories", 
    auth(Role.ADMIN), 
    validateRequest(gearValidation.createCategoryValidationSchema),
    gearController.createCategory)

const providerRouter = Router()

providerRouter.post(
    "/",
    auth(Role.ADMIN, Role.PROVIDER),
    validateRequest(gearValidation.createGearValidationSchema),
    gearController.createGear)

providerRouter.put(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER),
    validateRequest(gearValidation.updateGearValidationSchema),
    gearController.updateGear)

providerRouter.delete(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER),
    validateRequest(gearValidation.deleteGearValidationSchema),
    gearController.deleteGear)


export const gearRoutes = router
export const providerGearRoutes = providerRouter