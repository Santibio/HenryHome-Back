const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserAdmin, UserClient, UserMod, Housing, Reservations,Reviews } = require("../db");
const nodemailer = require('nodemailer');

const userRoles = {
  Client: UserClient,
  Admin: UserAdmin,
  Moderator: UserMod,
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
    const { password, ...userData } = existingUser.dataValues;
    res.status(200).json({ result: userData, token });
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
      role,
    });

    const token = jwt.sign(
      { email: result.email, id: result.id, role: result.role },
      process.env.SECRET_WORD, //Deberia ser una palabra secreta
      { expiresIn: "24h" }
    );


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "pf.grupo5@gmail.com",
        pass: "iwyssmpfaiqpplkw",
      },
    });

    transporter.verify().then(()=>console.log('Listo para enviar mail'))

    const mailOptions = {
      from: '"Henry Home 🏠" <pf.grupo5@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Registro ✔", // Subject line
      html: `<p>Thank you for registering at Henry Home, click on the following link to activate your account: </p> <a href="http://localhost:3002/api/user/verify?token=${token}">Link</a>`, // html body
    };

    transporter.sendMail(mailOptions,(error,info)=>{
      if(error) res.status(500).send(error.message)
      else{
        console.log("Email enviado");
      }
    });

    const { password, ...userData } = result.dataValues;
    res.status(200).json({ userData, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  const { id, role } = req.params;
  var user
  if(role==="Client"){
     user = await userRoles[role].findOne({
      where: {
        id: id,
      },
      include: [{ model: Reservations },
                {model: Reviews}
      ],
      
    });
  }
  if(role==="Moderator"){
     user = await userRoles[role].findOne({
      where: {
        id: id,
      },
      include: [{ model: Housing }],
    });
  }
  if(role==="Admin"){
    user = await userRoles[role].findOne({
     where: {
       id: id,
     },
   });
 }
  

  const { password, ...userData } = user.dataValues;

  res.status(200).json(userData);
};
 



const verify = async (req, res) => {
  const { token } = req.query;
  const {email,id,role} = jwt.verify(token, process.env.SECRET_WORD);
   const result = await userRoles[role].update(
     { verify: true },
     {
       where: {
         id,
       },
     }
   );

   result >= 1
     ? res.status(201).json({ msg: "User successfully verify" })
     : res.json({ msg: "User not verify" });

};

const updatePassword = async (req,res)=>{
  
  const { role , email, newPassword } = req.body
  try{
      const newHashedPassword = await bcrypt.hash(newPassword,12)

      await userRoles[role].update({
      password:newHashedPassword
    },{
      where:{
        email:email
      }
    })
    res.status(200).json({message:"Data updated"})
  }catch(err){
    console.log(err)
    res.status(500).json(err)
  }
}


module.exports = { login, register, getUserById, verify, updatePassword };
