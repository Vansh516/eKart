const { Router } = require('express');
const { addReview, updateReview } = require('../../controllers/shop/review.controller');


const router = Router();

router.post("/add", addReview)
router.patch("/update", updateReview)



module.exports = router