const Joi = require("joi")

const addReviewValidation = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().max(500),
    productId: Joi.string().required().hex().length(24),
    userName: Joi.string().required()
})


module.exports = {
    addReviewValidation
}