const router = require('express').Router()
const { createReview, patchReview, deleteReview} = require('../controllers/reviews.controller')
const { veryfyToken, isModerador, isAdmin } = require("../middleware/auth.js");
router.post('/',veryfyToken,createReview)
router.patch('/',veryfyToken,patchReview)
router.delete('/',veryfyToken,deleteReview)
module.exports = router