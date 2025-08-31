const { Router } = require('express');
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  deleteImage,
  updateImage,
} = require('../../controllers/admin/product.controller');

const upload = require('../../middlewares/multer.middlware');

const router = Router();

router.post('/add', addProduct);
router.get('/all', getProducts);
router.get('/:id', getProduct);

router.patch('/edit', upload.single('image'), updateImage);

router.patch('/:id', upload.none(), updateProduct);

router.delete('/:id', deleteProduct);

router.post('/image', upload.single('image'), uploadImage);

router.post('/delete', deleteImage);

module.exports = router;
