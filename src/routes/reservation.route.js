const router = require('express').Router()
const { createReservation , updateReservation } = require('../controllers/reservation.controller')
const { veryfyToken, isModerador, isAdmin } = require("../middleware/auth.js");
router.post('/',veryfyToken,createReservation)
router.put('/',updateReservation)

module.exports = router