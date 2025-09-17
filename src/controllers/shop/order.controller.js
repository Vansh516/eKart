const orderCollection = require("../../models/order.model")
const cartCollection = require("../../models/cart.model")
const productCollection = require("../../models/product.model")
const addressCollection = require("../../models/address.model")
const expressAsyncHandler = require("express-async-handler")
const paypal = require("../../config/paypal.config")
const CustomError = require("../../utils/CustomError.utils")
const ApiResponse = require("../../utils/ApiResponse.utils")

const createOrder = expressAsyncHandler(async (req, res, next) => {
    const userId = req.myUser._id

    let { cartId, paymentMethod, addressId } = req.body

    let cart = await cartCollection.findOne({ _id: cartId, userId })
    if (!cart) {
        return next(new CustomError('No cart found', 404))
    }

    let address = await addressCollection.findOne({ _id: addressId, userId })
    if (!address) {
        return next(new CustomError('No address found', 404))
    }

    let addressInfo = {
        addressId: address._id,
        address: address.address,
        city: address.city,
        pincode: address.pincode,
        phone: address.phone,
        notes: address.notes,
    }

    let cartItems = []
    let totalAmount = 0

    for (const item of cart.items) {
        let product = await productCollection.findById(item.productId)
        if (!product) return next(new CustomError('No product found', 404))

        totalAmount += item.quantity * product.salePrice
        cartItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.salePrice,
            image: product.image,
            title: product.title
        })
    }

    console.log(cartItems);
    console.log(totalAmount);

    if (paymentMethod === "online") {
        const create_payment_json = {
            intent: "sale", // "sale" means PayPal will charge immediately
            payer: { payment_method: "paypal" }, // Payment method used: PayPal
            redirect_urls: {
                return_url: `http://localhost:9000/api/shop/orders/capture`, // On payment success, redirect here
                cancel_url: `http://localhost:5173/shop/paypal-cancel`, // On payment cancel, redirect here
            },
            transactions: [
                {
                    // Send the list of cart items to PayPal
                    item_list: {
                        items: cartItems.map((item) => ({
                            name: item.title, // Product title
                            sku: item.productId.toString(), // Product ID as Stock Keeping Unit
                            price: item.price.toFixed(2), // Price (2 decimal places)
                            currency: "USD", // Currency used
                            quantity: item.quantity, // Quantity purchased
                        })),
                    },
                    amount: {
                        currency: "USD", // Total amount currency
                        total: totalAmount.toFixed(2), // Total order value
                    },
                    description: "Order payment", // Custom description
                },
            ],
        };


        paypal.payment.create(create_payment_json, async (err, payment) => {
            if (err) return next(new CustomError(err, 500))

            // console.log(payment);
            let paymentObject = payment.links.find((link) => link.rel === 'approval_url')
            // console.log(paymentLink.href);
            let paymentLink = paymentObject.href

            let order = await orderCollection.create({
                userId,
                cartId,
                cartItems,
                addressId,
                paymentMethod,
                totalAmount,
                status: 'pending',
                paymentId: payment.id,
                addressInfo
            })
            if (!order) return next(new CustomError('Error creating order', 500))

            new ApiResponse(200, true, 'order created', paymentLink).send(res)

        })
    }
    else {
        let order = await orderCollection.create({
            userId,
            cartId,
            cartItems,
            addressId,
            paymentMethod,
            totalAmount,
            status: 'pending',
            addressInfo
        })
        if (!order) return next(new CustomError('Error creating order', 500))

        new ApiResponse(200, true, 'order created').send(res)
    }

})

const captureOrder = expressAsyncHandler(async (req, res, next) => {
    let { PayerID, paymentId } = req.query
    console.log(req.query);
    let order = await orderCollection.findOne({ paymentId })
    if (!order) return next(new CustomError('No order found', 404))

    paypal.payment.execute(paymentId, { payer_id: PayerID }, async (err, payment) => {
        if (err) return next(new CustomError("Something went wrong", 500))
        console.log(payment);
        if (payment.state === "approved") {
            order.orderStatus = "Processing"
            order.paymentStatus = "Paid"
            order.payerId = PayerID
            await order.save()

            // decrease the qty

            order.cartItems.map(async (item) => {
                let prod = await productCollection.findById(item.productId)
                prod.totalStock -= item.quantity
                await prod.save()
            })

            let cart = await cartCollection.findOne({ _id: order.cartId })
            cart.items = []
            await cart.save()



            new ApiResponse(200, true, "Payemnt success").send(res)
        } else {
            order.orderStatus = "Cancelled"
            order.paymentStatus = "Failed"
            order.payerId = PayerID
            await order.save()

            new ApiResponse(200, true, "Payemnt failed").send(res)
        }

    })
})

const getOrders = expressAsyncHandler(async (req, res, next) => {
    let userId = req.myUser._id
    let orders = await orderCollection.find({ userId })
    if (orders.length === 0) return next(new CustomError('No orders found', 404))

    new ApiResponse(200, true, 'orders found', orders).send(res)
})

const getOrder = expressAsyncHandler(async (req, res, next) => {
    let order = await orderCollection.findById(req.params.id)
    if (!order) return next(new CustomError('No order found', 404))

    new ApiResponse(200, true, 'order found', order).send(res)
})


module.exports = {
    createOrder,
    captureOrder,
    getOrder,
    getOrders
}
