const { Router } = require('express');
const { getOrders, getOrder, updateOrderStatus } = require('../../controllers/admin/order.controller');

const router = Router();



router.get("/all", getOrders)
router.patch("/update/:id", updateOrderStatus)

router.get("/:id", getOrder)

module.exports = router