const {
  Housing,
  Location,
  Facilities,
  Services,
  UserMod,
  UserClient,
  Reservations,
  Reviews,
} = require("../db");
const { buscar } = require("../libs/buscar");
const filter = require("../libs/Filter");

const getHouses = async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  const ubicacion = req.query.location ? { name: req.query.location } : null;

  try {
    const Offset = size * (page - 1);

    const count = await Housing.findAndCountAll({
      where: filter(req),
      include: [
        {
          model: Location,
          where: ubicacion,
          required: true,
        },
      ],
    });

    const HousePage = await Housing.findAndCountAll({
      limit: size,
      offset: Offset,
      where: filter(req),
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "LocationId",
          "description",
          "houseRules",
        ],
      },
      include: [
        {
          model: Location,
          where: ubicacion,
          required: true,
        },
        { model: Facilities },
        { model: Services },
        { model: UserMod, attributes: ["id", "email"] },
        { model: Reviews, attributes: ["stars"] },
        { model: Reservations },
      ],
    });

    var c = 0;
    if (req.query.stars && HousePage.rows.length) {
      HousePage.rows = HousePage.rows.filter((e) => {
        if (e.average >= req.query.stars) return true;
        c++;
      });
    }
    HousePage.count = count.count - c; // Esto es xq el count All me cuenta tambien las relaciones de servicxes y facilities y no se como cambiarlo sin traer menos

    res
      .status(200)
      .json(HousePage?.rows.length ? HousePage : { message: "Error 404" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getHouseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const Houses = await Housing.findByPk(id, {
      include: [
        { model: Location },
        { model: Facilities },
        { model: Services },
        { model: UserMod },
        { model: Reservations },
        { model: Reviews,order: [['updatedAt', 'DESC']] ,include:[{ model: UserClient, attributes: ["firstName", "lastName", "email"] }]},
      ],
    });
    res.json(Houses);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createHouse = async (req, res, next) => {
  const {
    name,
    pricePerNight,
    numberOfPeople,
    numberOfBeds,
    description,
    houseRules,
    images,
    services,
    facilities,
    location,
  } = req.body;
  try {
    const [house, status] = await Housing.findOrCreate({
      where: {
        name: name.toLowerCase(),
      },
      defaults: {
        pricePerNight,
        numberOfPeople,
        numberOfBeds,
        description,
        houseRules,
        images,
      },
    });

    let servicesDB = services ? 
    await Services.findAll({
      where: { name: services },
    }) : null
    let facilitiesDB = facilities ?
     await Facilities.findAll({
      where: { name: facilities },
    }) : null

    await house.addServices(servicesDB);
    await house.addFacilities(facilitiesDB);
    
    await house.setLocation(location);
    await house.setUserMod(req.userId);

    status
      ? res.status(201).json({ house, message: "Casa creada correctamente" })
      : res.status(404).json({ message: "Ya hay una casa con ese nombre" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateHouse = async (req, res, next) => {
  const { id } = req.body;
  try {
    const prev = await Housing.findByPk(id);

    const {
      name = prev.name,
      pricePerNight = prev.pricePerNight,
      numberOfPeople = prev.numberOfPeople,
      numberOfBeds = prev.numberOfBeds,
      description = prev.description,
      houseRules = prev.houseRules,
      images = prev.images,
      services,
      facilities,
      location,
    } = req.body;

    const housecheck = await Housing.findByPk(id);

    if (housecheck.userModId !== req.userId) {
      return res.status(401).json({ message: "No es el dueño de esta casa" });
    }

    await Housing.update(
      {
        name,
        pricePerNight,
        numberOfPeople,
        numberOfBeds,
        description,
        houseRules,
        images,
        status: "Pending",
      },
      {
        where: {
          id,
        },
      }
    );

    const houseUpdated = await Housing.findByPk(id);

    if (services) {
      let servicesDB = await Services.findAll({
        where: { name: services },
      });
      await houseUpdated.setServices(servicesDB);
    }
    if (facilities) {
      let facilitiesDB = await Facilities.findAll({
        where: { name: facilities },
      });
      await houseUpdated.setFacilities(facilitiesDB);
    }

    console.log(location);

    await houseUpdated.setLocation(location);

    res
      .status(201)
      .json({ houseUpdated, message: "Casa modificada correctamente" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteHouse = async (req, res, next) => {
  const { id } = req.params;

  console.log({ id }, "aca");
  try {
    const house = await Housing.destroy({
      where: {
        id,
      },
    });
    res.status(201).json({ message: "La casa se ha eliminado correctamente" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const AdminChangeHousing = async (req, res, next) => {
  try {
    const { status, id } = req.body;
    const result = await Housing.update(
      { status: status },
      {
        where: {
          id,
        },
      }
    );

    result >= 1
      ? res.status(201).json({ message: "Los cambios fueron aplicados" })
      : res.json({ message: "Algo ha salido mal" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  AdminChangeHousing,
};
