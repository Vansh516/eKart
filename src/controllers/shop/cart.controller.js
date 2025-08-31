const cartCollection = require('../../models/cart.model');
const productCollection = require('../../models/product.model');

const expressAsyncHandler = require('express-async-handler');

const addToCart = expressAsyncHandler(async (req, res, next) => {});

const getCartItems = expressAsyncHandler(async (req, res, next) => {});

const removeFromCart = expressAsyncHandler(async (req, res, next) => {});

const clearCartItems = expressAsyncHandler(async (req, res, next) => {});

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCartItems,
};
