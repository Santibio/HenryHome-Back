const { Router } = require("express");
const {
  getServices,
  createService,
} = require("../controllers/services.controller.js");
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");

const { createFacilitie, getFacilities } = require('../controllers/facilities.controller')


const router = Router()

router.get("/", getServices);
router.post("/", [verifyToken, isAdmin], createService);



module.exports = router