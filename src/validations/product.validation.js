const Joi = require("joi");

const addProductValidation = Joi.object({
  image: Joi.string().required().optional(),
  title: Joi.string().required().min(3).max(100).lowercase(),
  description: Joi.string().required().lowercase().min(10).trim(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  price: Joi.number().required(),
  salePrice: Joi.number().required(),
  totalStock: Joi.number().required(),
});

const updateProductValidation = Joi.object({
  title: Joi.string().required().min(3).max(100).lowercase().optional(),
  description: Joi.string().required().lowercase().min(10).trim().optional(),
  category: Joi.string().required().optional(),
  brand: Joi.string().required().optional(),
  price: Joi.number().required().optional(),
  salePrice: Joi.number().required().optional(),
  totalStock: Joi.number().required().optional(),
});

const updateImageValidation = Joi.object({
  url: Joi.string().required().optional(),
  image: Joi.required().optional(),
});

module.exports = {
  addProductValidation,
  updateProductValidation,
  updateImageValidation,
};
