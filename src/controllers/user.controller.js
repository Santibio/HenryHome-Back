const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  UserAdmin,
  UserClient,
  UserMod,
  Housing,
  Reservations,
  Reviews,
} = require("../db");
const nodemailer = require("nodemailer");

const userRoles = {
  Client: UserClient,
  Admin: UserAdmin,
  Moderator: UserMod,
};

const login = async (req, res, next) => {
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
    res.json({ result: userData, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, inputPassword, confirmPassword, firstName, lastName, role } =
    req.body;
  try {
    const existingUser = await userRoles[role].findOne({
      where: {
        email,
      },
    });
    if (existingUser && !existingUser.verify) return res.status(404).json({ message: "User needs to be verify." });
    if (existingUser && existingUser.verify)
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

    transporter.verify().then(() => console.log("Listo para enviar mail"));

    const mailOptions = {
      from: '"Henry Home 🏠" <pf.grupo5@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Registro ✔", // Subject line
      html: `<p>Thank you for registering at Henry Home, click on the following link to activate your account: </p> <a href="https://henry-home.vercel.app/register?token=${token}">Link</a>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) res.status(500).send(error.message);
      else {
        console.log("Email enviado");
      }
    });

    const { password, ...userData } = result.dataValues;
    res.json({ userData, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const { id, role } = req.params;
  try {
    let user;
    if (role === "Client") {

      user = await userRoles[role].findByPk(id,{

        include: [{ model: Reservations },
                  { model: Reviews },
                  { model: Housing, as:"favs" }
                
            ],

      });
    }
    if (role === "Moderator") {
      user = await userRoles[role].findByPk(id, {
        include: [{ model: Housing }],
      });
    }
    if (role === "Admin") {
      user = await userRoles[role].findByPk(id);
    }
    const { password, ...userData } = user.dataValues;
    res.json(userData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verify = async (req, res, next) => {
  const { token } = req.query;
  try {
    const { id, role } = jwt.verify(token, process.env.SECRET_WORD);
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
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePassword = async (req, res) => {
  const { role, email, newPassword } = req.body;
  try {
    const newHashedPassword = await bcrypt.hash(newPassword, 12);

    await userRoles[role].update(
      {
        password: newHashedPassword,
      },
      {
        where: {
          email: email,
        },
      }
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

    const mailOptions = {
      from: '"Henry Home 🏠" <pf.grupo5@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Cambio de contraseña ✔", // Subject line
      html: `<p>Your password has been sucessfully changed :)</p>`, // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) res.status(500).send(error.message);
      else {
        console.log("Email enviado");
      }
    });
    res.status(200).json({msg:'Password changed!'})
    next()
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const confirmUpdatePassword = async (req,res)=>{
  const { email } = req.body
  try{
    const user = await UserClient.findAll({
      where:{
        email:email
      }
    })
    if(user){
      const token = jwt.sign(
        { email: email },
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
  
      const mailOptions = {
        from: '"Henry Home 🏠" <pf.grupo5@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Cambio de contraseña ✔", // Subject line
        html: `<p>Para cambiar tu contraseña haz click en siguiente enlace: <a href='https://henry-home.vercel.app/change-password?token=${token}' target='_blank'>cambiar contraseña</a></p>`, // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) res.status(500).send(error.message);
        else {
          console.log("Email enviado");
        }
      });
  
      res.status(200).json({message:"Mail sent"})
    }
    else{
      res.status(404).json({message:"User doesn't exist"})
    }
  }catch(err){
    res.status(500).json(err)
  }
}

module.exports = { login, register, getUserById, verify, updatePassword,confirmUpdatePassword };
