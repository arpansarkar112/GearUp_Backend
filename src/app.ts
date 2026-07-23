import express, { Application, Request, Response } from "express"
import cors from "cors"
import config from "./config"
import cookieParser from "cookie-parser"
import { userRoutes } from "./modules/user/user.route"
import { authRoutes } from "./modules/auth/auth.route"
import { globalErrorHandler } from "./middlewares/globalErrorHandler"
import { gearRoutes, providerGearRoutes } from "./modules/gear/gear.route"
import { adminRentalRoutes, customerRentalRoutes, providerOrderRoutes } from "./modules/order/order.route"
import { reviewRoutes } from "./modules/review/review.route"

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))

app.use(cookieParser())

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use("/api/users", userRoutes)

app.use("/api/auth", authRoutes)

app.use("/api/gear", gearRoutes)
app.use("/api/provider/gear", providerGearRoutes)

app.use("/api/customer/rentals", customerRentalRoutes)
app.use("/api/provider/orders", providerOrderRoutes)
app.use("/api/admin/rentals", adminRentalRoutes)

app.use("/api/reviews", reviewRoutes)

app.use(globalErrorHandler)

export default app