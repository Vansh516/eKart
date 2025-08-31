const { Router } = require('express');
const {
  fetchAllProducts,
  fetchOneProduct,
  searchProducts,
} = require('../../controllers/shop/product.controller');

const router = Router();

router.get('/all', fetchAllProducts);
router.get('/search', searchProducts);
router.get('/one/:id', fetchOneProduct);

module.exports = router;
