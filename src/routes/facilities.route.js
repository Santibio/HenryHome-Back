const router = require('express').Router()
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");
const { createFacilitie, getFacilities } = require('../controllers/facilities.controller')

router.post("/", [verifyToken, isAdmin], createFacilitie);
router.get('/', getFacilities )

module.exports = router