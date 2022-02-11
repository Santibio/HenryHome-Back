const router = require('express').Router()
const { createReservation , updateReservation } = require('../controllers/reservation.controller')
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");

router.post('/',verifyToken,createReservation)
router.put('/',updateReservation)

module.exports = router