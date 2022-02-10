const router = require('express').Router()
const { createReview, } = require('../controllers/reviews.controller')
const { veryfyToken, isModerador, isAdmin } = require("../middleware/auth.js");
router.post('/',veryfyToken,createReview)
router.patch('/')

module.exports = router