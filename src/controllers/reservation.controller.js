const { Reservations, Housing, Order, UserClient } = require("../db");
const { daysCalculator } = require("../libs/daysCalculator");
const { validateDate } = require("../libs/validateDate");
const mercadopago = require("mercadopago");
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

const createReservation = async (req, res, next) => {
  const { id_hotel, date_start, date_end, detail, title } = req.body;
  console.log(req.body);
  try {
    if (!id_hotel || !date_start || !date_end || !detail) {
      return res.json(400).json({ message: "Se necesitan datos" });
    }
    const hotel = await Housing.findByPk(id_hotel);
    const amount = daysCalculator(date_start, date_end) * hotel.pricePerNight;
    const order = await Order.create({ amount: amount, status: "Pending" });

    mercadopago.configure({
      access_token:
        "TEST-6405237416728256-020819-a6841f5be0ffa7942b47b8c844622d16-244670840",
    });

    var preference = {
      items: [
        {
          title,
          quantity: 1,
          currency_id: "ARS",
          unit_price: amount,
        },
      ],
      back_urls: {
       /*  success: "https://henry-home.vercel.app/payment/success",
        failure: "https://henry-home.vercel.app/payment/failure",
        pending: "https://henry-home.vercel.app/payment/failure", */

        success: "http://localhost:3000/payment/success",
        failure: "http://localhost:3000/payment/failure",
        pending: "http://localhost:3000/payment/failure",
      },
      auto_return: "approved",
    };
    const mercadoPagoResponse = await mercadopago.preferences.create(
      preference
    );

    const newReservation = await Reservations.create({
      id_hotel,
      date_start,
      date_end,
      detail,
      id_mercado_pago: mercadoPagoResponse.body.id,
      link_mercado_pago: mercadoPagoResponse.body.init_point,
    });
    const available = await validateDate(id_hotel, date_start, date_end);

    if (!available) {
      return res.status(404).json({ message: "Fecha ya tomada" });
    }
    await newReservation.setOrder(order.id);
    await newReservation.setUserClient(req.userId);
    await newReservation.setHousing(id_hotel);

    res.status(201).json({
      newReservation,
      order,
      message: "Reserva creada",
      linkPay: mercadoPagoResponse.body.init_point,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateReservation = async (req, res) => {
  const { id, status } = req.body;
  try {
    await Reservations.update(
      {
        status,
      },
      {
        where: {
          id_mercado_pago: id,
        },
      }
    );

    const reservation = await Reservations.findOne({
      where: { id_mercado_pago: id },
      include: [{ model: UserClient }],
    });

   
    transporter.verify().then(() => console.log("Listo para enviar mail"));

    const mailOptions = {
      from: '"Henry Home 🏠" <henryhome.grupo5@gmail.com>', // sender address
      to: reservation.userClient.email, // list of receivers
      subject: "Registro ✔", // Subject line
      html: `<p>Reserva realizada con exito!!</p>`, // html body
      /* html: `<p>Gracias por registrase en Henry Home, haga click en el siguiente link para activar su cuenta: </p> <a href="http://localhost:3000/register?token=${token}">Link</a>`, */ // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      else {
        console.log("E-mail enviado");
      }
    });

    res.status(200).json({ message: "Reserva actualizada" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const cancelReservation = async (req, res) => {
  const { id } = req.body;
  try {
    await Reservations.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createReservation,
  updateReservation,
  cancelReservation,
};
