const { Router } = require('express');
const {
  addAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} = require('../../controllers/shop/address.controller');

const router = Router();

router.post('/add', addAddress);
router.get('/all', getAddresses);
router.get('/:id', getAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
