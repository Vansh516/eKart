const expressAsyncHandler = require("express-async-handler");
const orderCollection = require("../../models/order.model");
const CustomError = require("../../utils/CustomError.utils");
const ApiResponse = require("../../utils/ApiResponse.utils");

const getOrders = expressAsyncHandler(async (req, res, next) => {
    let orders = await orderCollection.find({})

    if (orders.length === 0) return next(new CustomError('No orders found', 404))

    new ApiResponse(200, true, 'orders found', orders).send(res)
});

const getOrder = expressAsyncHandler(async (req, res, next) => {
    let order = await orderCollection.findById(req.params.id)

    if (!order) return next(new CustomError('No order found', 404))

    new ApiResponse(200, true, 'order found', order).send(res)
});

const updateOrderStatus = expressAsyncHandler(async (req, res, next) => {

    let order = await orderCollection.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, {
        new: true,
        runValidators: true
    })

    if (!order) return next(new CustomError('No order found', 404))

    new ApiResponse(200, true, 'order updated', order).send(res)
});

module.exports = {
    getOrders,
    getOrder,
    updateOrderStatus
}