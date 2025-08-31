const Joi = require('joi');

const addAddressValidation = Joi.object({
  address: Joi.string().required(),
  city: Joi.string().required(),
  pincode: Joi.string().required().length(6),
  phone: Joi.string()
    .required()
    .max(10)
    .pattern(/^[6-9]\d{9}$/)
    .message('Invalid phone number'),
  notes: Joi.string().optional(),
});

const updateAddressValidation = Joi.object({
  address: Joi.string().required().optional(),
  city: Joi.string().required().optional(),
  pincode: Joi.string().required().length(6).optional(),
  phone: Joi.string()
    .required()
    .max(10)
    .pattern(/^[6-9]\d{9}$/)
    .message('Invalid phone number')
    .optional(),
  notes: Joi.string().optional(),
});

module.exports = {
  addAddressValidation,
  updateAddressValidation,
};
