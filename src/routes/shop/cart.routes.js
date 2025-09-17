const { Router } = require('express');
const {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCartItems,
} = require('../../controllers/shop/cart.controller');

const router = Router();

router.post('/add', addToCart);
router.get('/', getCartItems);
router.patch('/remove', removeFromCart);
router.patch('/clear', clearCartItems);

module.exports = router;
