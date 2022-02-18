const jwt = require("jsonwebtoken");
const { UserAdmin, UserClient, UserMod } = require("../db");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log({token});
    const isCustomAuth = token.length < 500;
    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET_WORD);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }
 
    next();
  } catch (error) {
    next(error);
  }
};

const isModerador = async (req, res, next) => {
  try {
    
    const Mod = await UserMod.findByPk(req.userId);
    if (Mod) {
      next();
    } else {
      return res.status(403).json({ message: "You are not a Moderator" });
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const adminID = req.userId;

    const Admin = await UserAdmin.findOne({ where: { id: adminID } });
    if (Admin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not a Admin" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyToken, isModerador, isAdmin };
