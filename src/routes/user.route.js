const {Router} = require('express');
const {
  login,
  register,
  getUserById,
  verify,
  updatePassword,
  confirmUpdatePassword,
  updateModerator,
  googleLogIn 
} = require("../controllers/user.controller.js"); 
const { verifyToken } = require('../middleware/auth.js');
const router = Router()


router.get("/:id/:role",getUserById)
router.post("/login", login)
router.post("/google-login", googleLogIn)
router.post("/register", register)
router.post("/verify", verify)
router.post('/confirm-update-password',confirmUpdatePassword)
router.put('/change-password',updatePassword)
router.post("/moderator", verifyToken, updateModerator);
module.exports = router