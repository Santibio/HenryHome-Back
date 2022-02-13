const router = require('express').Router()
const { addFav, deleteFav } = require('../controllers/favs.controller.js')
const { verifyToken } = require("../middleware/auth.js");
router.post('/', verifyToken, addFav )
router.delete('/', verifyToken, deleteFav )
module.exports = router