const router = require("express").Router();
const { verifyToken, isModerador, isAdmin } = require("../middleware/auth.js");
const { addFavorite } = require("../controllers/favorites.controller");


router.post("/:idClient", addFavorite);


module.exports = router;
