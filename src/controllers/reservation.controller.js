const { Reservations, Housing, Order, UserClient } = require("../db");
const { dias } = require("../libs/days");
const {validateDate} = require("../libs/validateDate")

const createReservation = async (req, res) => {
  const { id_hotel, date_start, date_end, detail } = req.body;

  try {
    if (!id_hotel || !date_start || !date_end || !detail) {
      return res.json(400).json({ msg: "Data needed!" });
    }
    const hotel = await Housing.findByPk(id_hotel);
    console.log(hotel);
    const amount = dias(date_start, date_end) * hotel.pricePerNight;
    const order = await Order.create({ amount: amount, status: "Pending" });
    const newReservation = await Reservations.create({
      id_hotel,
      date_start,
      date_end,
      detail,
      status: "Pending",
    });
    const result = await validateDate(id_hotel, date_start, date_end);
    if(!result){
        res.status(404).json({msg: 'Date already taken'})
    }
    await newReservation.setOrder(order.id);
    await newReservation.setUserClient(req.userId);
    await newReservation.addHousing(id_hotel);
    res.status(201).json({ newReservation, order });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.body;
  try {
    await Reservations.update(
      {
        status: "Resolved",
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).json({ msg: "Reservation updated" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createReservation,
  updateReservation,
};
