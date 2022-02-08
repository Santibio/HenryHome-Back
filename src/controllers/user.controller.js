const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserAdmin, UserClient, UserMod, Housing } = require("../db");

const userRoles = {
  "Client": UserClient,
  "Admin": UserAdmin,
  "Moderator": UserMod,
};

const login = async (req, res) => {
   const { email, password, role } = req.body;
   try {
     
     const existingUser = await userRoles[role].findOne({
       where: {
         email,
       },
     });
     if (!existingUser)
       return res.status(404).json({ message: "User doesn't exisit." });
     const isPasswordCorrect = await bcrypt.compare(
       password,
       existingUser.password
     );
     if (!isPasswordCorrect)
       return res.status(400).json({ message: "Invalid credentials" });
     const token = jwt.sign(
       { email: existingUser.email, id: existingUser.id },
       "test", //Deberia ser una palabra secreta
       { expiresIn: "24h" }
     );
     res.status(200).json({ result:existingUser, token });
   } catch (error) {
     res.status(500).json({ message: "Something went wrong" });
   }
};

const register = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, role } =
    req.body;
    
  try {
    
    const existingUser = await userRoles[role].findOne({
      where: {
        email,
      },
    });
    if (existingUser)
      return res.status(404).json({ message: "User already exisit." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match." });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await userRoles[role].create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      rol: role,
    });
    console.log(result);
    const token = jwt.sign({ email: result.email, id: result.id }, "test" //Deberia ser una palabra secreta
    , {expiresIn: "24h",
    });
    
    res.status(200).json({ result, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getUserById = async(req,res)=>{
  const {id, role} = req.params
  console.log(req.params);

  const User= await userRoles[role].findOne({
    where: {
      id: id
    },
     include:[{model:Housing}],
  }); 

  res.status(200).json(User)
}

module.exports = { login, register,getUserById };
