const { Router } = require("express");
const { createOrder, captureOrder, getOrders, getOrder } = require("../../controllers/shop/order.controller");


const router = Router();


router.post("/create", createOrder)
router.patch("/capture", captureOrder)

router.get('/all', getOrders)
router.get('/:id', getOrder)


module.exports = router