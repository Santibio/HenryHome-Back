const {Router} = require('express');
const {
  login,
  register,
  getUserById,
  verify,
} = require("../controllers/user.controller.js"); 
const router = Router()


router.get("/:id/:role",getUserById)
router.post("/login", login)
router.post("/register", register)
router.get("/verify", verify)
module.exports = router