const Joi = require("joi");

const registervalidation = Joi.object({
  userName: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(5).required(),
  email: Joi.string().email().min(5).max(40).required(),
});

const loginValidattion = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().email().min(5).max(40).required(),
});

const updatedUserValidation = Joi.object({
  userName: Joi.string().min(3).max(20).required().optional(),
  email: Joi.string().email().min(5).max(40).required().optional(),
});

const updateUserPassword = Joi.object({
  password: Joi.string().min(5).required(),
});

module.exports = {
  registervalidation,
  loginValidattion,
  updatedUserValidation,
  updateUserPassword,
};
