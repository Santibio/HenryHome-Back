const router = require('express').Router()
const { createReview, patchReview, deleteReview} = require('../controllers/reviews.controller')
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");
router.post('/',verifyToken,createReview)
router.patch('/',verifyToken,patchReview)
router.delete('/',verifyToken,deleteReview)
module.exports = router