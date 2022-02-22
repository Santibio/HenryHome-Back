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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "henryhome.grupo5@gmail.com",
    pass: "dkccunkjkwectfeh",
  },
});

const userRoles = {
  Client: UserClient,
  Admin: UserAdmin,
  Moderator: UserMod,
};

const login = async (req, res, next) => {
  const { email, inputPassword, role } = req.body;
  console.log(email, inputPassword, role);
  try {
    
    const existingUser = await userRoles[role].findOne({
      where: {
        email,
      },
      
    });

    if (!existingUser)
      return res.status(404).json({ message: "Usuario no existe" });
    const isPasswordCorrect = await bcrypt.compare(
      inputPassword,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.SECRET_WORD,
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
  const { email, inputPassword, confirmPassword, firstName, lastName,role } =
    req.body;
  try {
    const existingUser = await userRoles[role].findOne({
      where: {
        email,
      },
    });
    if (existingUser && !existingUser.verify)
      return res
        .status(400)
        .json({ message: "El usuario necesita ser verificado" });
    if (existingUser && existingUser.verify)
      return res.json({ message: "El usuario ya existe" });
    if (inputPassword !== confirmPassword)
      return res.status(400).json({ message: "Las constraseña no concuerdan" });
    const hashedPassword = await bcrypt.hash(inputPassword, 12);
    const result = await userRoles[role].create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role
    });

    const token = jwt.sign(
      { email: result.email, id: result.id },
      process.env.SECRET_WORD, //Deberia ser una palabra secreta
      { expiresIn: "24h" }
    );

    transporter.verify().then(() => console.log("Listo para enviar mail"));

    const mailOptions = {
      from: '"Henry Home 🏠" <henryhome.grupo5@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Registro ✔", // Subject line
      html: `<p>Gracias por registrase en Henry Home, haga click en el siguiente link para activar su cuenta: </p> <a href="https://henryhome.vercel.app/register?token=${token}">Link</a>`, // html body
      /* html: `<p>Gracias por registrase en Henry Home, haga click en el siguiente link para activar su cuenta: </p> <a href="http://localhost:3000/register?token=${token}">Link</a>`, */ // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {

      if (error) console.log(error);

      else {
        console.log("E-mail enviado");
      }
    });

    const { password, ...userData } = result.dataValues;
    res.json({ userData, token, message: "E-mail enviado" });
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
      user = await userRoles[role].findByPk(id, {
        include: [
          { model: Reservations },
          { model: Reviews, order: [['updatedAt', 'DESC']] , include:[{ model: Housing, attributes: ["name","images","id"] }, {model :UserClient}]},
          { model: Housing, as: "favs" },
          
        ],
      });
    }
    if (role === "Moderator") {
      user = await userRoles[role].findByPk(id, {
        include: [{ model: Housing }, {model: UserClient}],

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
    const { id } = jwt.verify(token, process.env.SECRET_WORD);
    const result = await UserClient.update(
      { verify: true },
      {
        where: {
          id,
        },
      }
    );
    result >= 1
      ? res.status(201).json({ message: "Usuario correctamente verificado" })
      : res.json({ message: "Usuario no verificado" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  const { role, email, newPassword } = req.body;
  console.log(role, email, newPassword); //Faltaria un confirm password
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

    const mailOptions = {
      from: '"Henry Home 🏠" <pf.grupo5@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Cambio de contraseña ✔", // Subject line
      html: `<p>Su contraseña ha sido cambiada con exito :)</p>`, // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) res.status(500).send(error.message);
      else {
        console.log("Email enviado");
      }
    });
    res.status(200).json({ message: "Contraseña cambiada!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const confirmUpdatePassword = async (req, res) => {
  const { email } = req.body;
  console.log({ email });
  try {
    const user = await UserClient.findAll({
      where: {
        email: email,
      },
    });
    if (user) {
      const token = jwt.sign(
        { email: email },
        process.env.SECRET_WORD, //Deberia ser una palabra secreta
        { expiresIn: "24h" }
      );

      const mailOptions = {
        from: '"Henry Home 🏠" <pf.grupo5@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Cambio de contraseña ✔", // Subject line
        html: `<p>Para cambiar tu contraseña haz click en siguiente enlace: <a href='https://henryhome.vercel.app/change-password?token=${token}' target='_blank'>cambiar contraseña</a></p>`, // html body
        /*  html: `<p>Para cambiar tu contraseña haz click en siguiente enlace: <a href='http://localhost:3000/change-password?token=${token}' target='_blank'>cambiar contraseña</a></p>`, */ // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) res.status(500).send(error.message);
        else {
          console.log("Email enviado");
        }
      });

      res.status(200).json({ message: "E-Mail enviado" });
    } else {
      res.status(404).json({ message: "Usuario no existe" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateModerator = async (req, res, next) => {
  try {
    const userClient = await UserClient.findByPk(req.userId);

    const { email, password, firstName, lastName, verify } =
      userClient.dataValues;

    const [userMod, result] = await UserMod.findOrCreate({
      where: {
        email,
      },
      defaults: {
        password,
        firstName,
        lastName,
        verify,
      },
    });

    await userMod.setUserClient(userClient);

    
  
    result
      ? res
          .status(201)
          .json({ userMod, message: "Usuario Moderador creado correctamente" })
      : res
          .status(404)
          .json({ message: "Usuario ya registrado como moderador" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const googleLogIn = async (req, res, next)=>{

  try{
    const {email, familyName, givenName, googleId, imageUrl, role} = req.body

    const existingUser = await userRoles[role].findOne({
      where: {
        email,
      },
    });
    if (existingUser){

      const isPasswordCorrect = await bcrypt.compare(
        googleId,
        existingUser.password
      );
      if (!isPasswordCorrect)
      return res.status(400).json({ message: "Este Email ya ha sido utilizado" });
      
      const token = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.SECRET_WORD,
      { expiresIn: "24h" }
    );
        
    const { password, ...userData } = existingUser.dataValues;
    console.log("Login google")
    res.json({ result: userData, token });
      
    }else{
      const hashedPassword = await bcrypt.hash(googleId, 12);
      const result = await userRoles[role].create({
        email,
        firstName:givenName,
        lastName:familyName,
        password: hashedPassword,
        profile_img:imageUrl,
        role,
        verify: true
      });
      const token = jwt.sign(
        { email: result.email, id: result.id },
        process.env.SECRET_WORD, //Deberia ser una palabra secreta
        { expiresIn: "24h" }
      );
        
      const { password, ...userData } = result.dataValues;
      console.log("Register google")
    return res.json({ result: userData, token });

    }
    
  }catch(error){
    console.log(error);
    next(error);
  }
}

module.exports = {
  login,
  register,
  getUserById,
  verify,
  updatePassword,
  confirmUpdatePassword,
  updateModerator,
  googleLogIn,
};
