const {Router} = require('express');
const {
  login,
  register,
  getUserById,
  verify,
  updatePassword,
  confirmUpdatePassword
} = require("../controllers/user.controller.js"); 
const router = Router()


router.get("/:id/:role",getUserById)
router.post("/login", login)
router.post("/register", register)
router.get("/verify", verify)
router.get('/confirm-update-password',confirmUpdatePassword)
router.put('/change-password',updatePassword)
module.exports = router