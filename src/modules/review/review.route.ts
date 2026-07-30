import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/client"
import { reviewController } from "./review.controller"
import { validateRequest } from "../../middlewares/validateRequest"
import { reviewValidation } from "./review.validation"

const router = Router()

router.get("/gear/:gearId", reviewController.getReviewsByGearId)
router.get("/provider", auth(Role.PROVIDER), reviewController.getProviderReviews)
router.get("/", reviewController.getAllReviews)

router.post(
    "/",
    auth(Role.CUSTOMER),
    validateRequest(reviewValidation.createReviewValidationSchema),
    reviewController.createReview)

export const reviewRoutes = router