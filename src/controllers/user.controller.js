const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserAdmin, UserClient, UserMod, Housing } = require("../db");

const userRoles = {
  "Client": UserClient,
  "Admin": UserAdmin,
  "Moderator": UserMod,
};

const login = async (req, res) => {
  const { email, inputPassword, role } = req.body;
  try {
    
    const existingUser = await userRoles[role].findOne({
       where: {
         email,
        },
      });
      if (!existingUser)
      return res.status(404).json({ message: "User doesn't exisit." });
      const isPasswordCorrect = await bcrypt.compare(
        inputPassword,
        existingUser.password
        );
        if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign(
          { email: existingUser.email, id: existingUser.id },
          process.env.SECRET_WORD, //Deberia ser una palabra secreta
          { expiresIn: "24h" }
        );
        const { password,...userData } = existingUser.dataValues
          res.status(200).json({ result:userData, token });
        } catch (error) {
          res.status(500).json({ message: "Something went wrong" });
        }
      };
      
      const register = async (req, res) => {
        const { email, inputPassword, confirmPassword, firstName, lastName, role } =
        req.body;
        
        try {
          
          const existingUser = await userRoles[role].findOne({
            where: {
              email,
            },
          });
          
          if (existingUser)
          return res.status(404).json({ message: "User already exisit." });
          if (inputPassword !== confirmPassword)
          return res.status(400).json({ message: "Password don't match." });
          const hashedPassword = await bcrypt.hash(inputPassword, 12);
          const result = await userRoles[role].create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            rol: role,
          });
         
          const token = jwt.sign(
            { email: result.email, id: result.id },
            process.env.SECRET_WORD, //Deberia ser una palabra secreta
            { expiresIn: "24h" }
          );
          const { password,...userData } = result.dataValues
        res.status(200).json({ userData, token });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserById = async(req,res)=>{
  const {id, role} = req.params
  console.log(req.params);

  const user= await userRoles[role].findOne({
    where: {
      id: id
    },
     include:[{model:Housing}],
  }); 

  const { password,...userData } = user.dataValues

  res.status(200).json(userData)
}

module.exports = { login, register,getUserById };
