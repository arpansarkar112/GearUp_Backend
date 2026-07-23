import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/client"
import { reviewController } from "./review.controller"

const router = Router()

router.get("/gear/:gearId", reviewController.getReviewsByGearId)
router.get("/", reviewController.getAllReviews)

router.post(
    "/",
    auth(Role.CUSTOMER),
    reviewController.createReview)

export const reviewRoutes = router