const { Router } = require('express');
const {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCartItems,
} = require('../../controllers/shop/cart.controller');

const router = Router();

router.post('/add', addToCart);
router.get('/all', getCartItems);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCartItems);

module.exports = router;
