const { Router } = require("express");
const {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  AdminChangeHousing,
 
} = require("../controllers/house.controller.js");
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");

const router = Router()


router.get("/", getHouses);
router.get("/:id", getHouseById)
router.post("/",[verifyToken,isModerador],createHouse)
router.patch("/",[verifyToken,isModerador], updateHouse)
router.patch("/status",AdminChangeHousing);
router.delete("/", deleteHouse)

module.exports = router