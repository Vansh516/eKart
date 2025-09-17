const expressAsyncHandler = require("express-async-handler");
let reviewCollection = require("../../models/review.model");
let orderCollection = require("../../models/order.model");
let productCollection = require("../../models/product.model");
const CustomError = require("../../utils/CustomError.utils");
const ApiResponse = require("../../utils/ApiResponse.utils");
const { addReviewValidation } = require("../../validations/review.validation");

const addReview = expressAsyncHandler(async (req, res, next) => {

    let { error } = addReviewValidation.validate(req.body)
    if (error) return next(new CustomError(error.details[0].message, 400))

    let userId = req.myUser._id
    const { productId, rating, comment, userName } = req.body

    let product = await productCollection.findById(productId)
    if (!product) return next(new CustomError('No product found', 404));

    let order = await orderCollection.findOne({ userId })
    if (!order) return next(new CustomError('No order found', 404));

    let productReview = await reviewCollection.findOne({ productId, userId })
    if (productReview) return next(new CustomError('You have already reviewed this product', 400))

    let findProd = order.cartItems.find((item) => item.productId.toString() === productId)
    if (!findProd) return next(new CustomError('You have not ordered this product', 400))

    let review = await reviewCollection.create({ productId, rating, comment, userName, userId })

    let reviews = await reviewCollection.find({ productId })
    let number = reviews.length
    let totalRating = reviews.reduce((total, review) => total + review.rating, 0)
    let averageReview = totalRating / number

    await productCollection.updateOne({ _id: productId }, { $set: { averageReview: averageReview } })


    new ApiResponse(200, true, 'Review added', review).send(res)

})

const updateReview = expressAsyncHandler(async (req, res, next) => { })



module.exports = {
    addReview,
    updateReview
}