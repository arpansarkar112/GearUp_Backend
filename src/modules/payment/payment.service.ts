import { stripe } from "../../lib/stripe"
import { prisma } from "../../lib/prisma"
import Stripe from "stripe"
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums"
import config from "../../config"

const createCheckoutSession = async (userId: string, rentalOrderId: string) => {
    const rentalOrder = await prisma.rentalOrder.findUniqueOrThrow({
        where: { id: rentalOrderId },
        include: {
            orderItems: {
                include: {
                    gearItem: true,
                },
            },
        },
    })

    if (rentalOrder.customerId !== userId) {
        throw new Error("You are not authorized to pay for this rental order.")
    }

    const amountInCents = Math.round(rentalOrder.totalAmount * 100)

    const gearNames = rentalOrder.orderItems.map((item) => item.gearItem.name).join(", ")
    const productName = gearNames ? `Rental: ${gearNames}` : `GearUp Rental Order #${rentalOrder.id.substring(0, 8)}`

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${config.app_url}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/api/payment/cancel`,
        client_reference_id: userId,
        metadata: {
            rentalOrderId: rentalOrder.id,
            userId: userId,
        },
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: productName,
                        description: `Rental Period: ${new Date(rentalOrder.startDate).toLocaleDateString()} to ${new Date(rentalOrder.endDate).toLocaleDateString()}`,
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            },
        ],
    })

    return { checkoutUrl: session.url }
}

const handleWebhook = async (eventBuffer: Buffer, signature: string, endpointSecret: string) => {
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(eventBuffer, signature, endpointSecret)
    } catch (err: any) {
        throw new Error(`Webhook Error: ${err.message}`)
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        const rentalOrderId = session.metadata?.rentalOrderId
        const transactionId = session.payment_intent as string
        const amountPaid = (session.amount_total || 0) / 100

        if (!rentalOrderId) {
            console.error("Webhook Error: Missing rentalOrderId in session metadata.")
            return
        }

        await prisma.$transaction([
            prisma.payment.upsert({
                where: { rentalOrderId },
                create: {
                    rentalOrderId,
                    transactionId,
                    amount: amountPaid,
                    method: PaymentMethod.STRIPE, 
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                },
                update: {
                    transactionId,
                    amount: amountPaid,
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                },
            }),
            prisma.rentalOrder.update({
                where: { id: rentalOrderId },
                data: {
                    status: OrderStatus.CONFIRMED, 
                },
            }),
        ])
    }
}

export const paymentServices = {
    createCheckoutSession,
    handleWebhook,
}