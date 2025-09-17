const cartCollection = require('../../models/cart.model');
const productCollection = require('../../models/product.model');

const expressAsyncHandler = require('express-async-handler');
const ApiResponse = require('../../utils/ApiResponse.utils');
const CustomError = require('../../utils/CustomError.utils');

const addToCart = expressAsyncHandler(async (req, res, next) => {
  let userId = req.myUser._id;
  let productId = req.body.productId;

  let product = await productCollection.findById(productId);
  if (!product) return next(new CustomError('No product found', 404));

  let cart = await cartCollection.findOne({ userId });
  if (!cart) {
    await cartCollection.create({ userId, items: [{ productId, quantity: 1 }] });
  } else {
    let idx = cart.items.findIndex((item) => {
      return item.productId.toString() == productId;
    });
    if (idx === -1) {
      cart.items.push({ productId, quantity: 1 });
      await cart.save();
    } else {
      cart.items[idx].quantity++;
      await cart.save();
    }
  }

  new ApiResponse(201, true, 'product added to cart').send(res);
});
// add to cart/ +1

const getCartItems = expressAsyncHandler(async (req, res, next) => {
  let cart = await cartCollection.findOne({ userId: req.myUser._id }).populate({
    path: "items.productId",
    select: "category brand title salePrice -_id"
  })

  if (!cart) return next(new CustomError('No cart found', 404));
  if (cart.items.length === 0) return next(new CustomError('No items in cart', 404));

  // let flatArray = cart.items.map((item) => {
  //   return ({
  //     title: item.productId.title,
  //     category: item.productId.category,
  //     brand: item.productId.brand,
  //     salePrice: item.productId.salePrice,
  //     quantity: item.quantity
  //   })
  // })

  let flatArrayShort = cart.items.map((item) => {
    return ({
      ...item.productId._doc,
      quantity: item.quantity
    }
    )
  })

  new ApiResponse(200, true, 'cart found', flatArrayShort).send(res);
});


const clearCartItems = expressAsyncHandler(async (req, res, next) => {
  let userId = req.myUser._id;

  let cart = await cartCollection.findOne({ userId });

  cart.items = [];
  await cart.save();

  new ApiResponse(200, true, 'cart cleared').send(res);

});

const removeFromCart = expressAsyncHandler(async (req, res, next) => {
  let userId = req.myUser._id;
  let productId = req.body.productId;

  let cart = await cartCollection.findOne({ userId })
  if (!cart) return next(new CustomError('No cart found', 404));

  let idx = cart.items.findIndex((item) => {
    return item.productId.toString() == productId;
  })
  if (idx == -1) return next(new CustomError('No product found in cart', 404));
  console.log(idx);


  if (cart.items[idx].quantity == 1) {
    cart.items.splice(idx, 1);
    await cart.save();
    return new ApiResponse(200, true, 'product removed from cart').send(res);
  }

  cart.items[idx].quantity -= 1;
  await cart.save();

  let cartP = await cartCollection.findOne({ userId: req.myUser._id }).populate({
    path: "items.productId",
    select: "category brand title salePrice -_id"
  })

  if (!cartP) return next(new CustomError('No cart found', 404));
  if (cartP.items.length === 0) return next(new CustomError('No items in cart', 404));

  let flatArrayShort = cartP.items.map((item) => {
    return ({
      ...item.productId._doc,
      quantity: item.quantity
    }
    )
  })

  new ApiResponse(200, true, 'cart found', flatArrayShort).send(res);

});


module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCartItems,
};

