const router = require('express').Router()
const { createReservation , updateReservation , cancelReservation } = require('../controllers/reservation.controller')
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");

router.post("/",verifyToken,createReservation)
router.delete('/',cancelReservation)
router.put("/",updateReservation)

module.exports = router