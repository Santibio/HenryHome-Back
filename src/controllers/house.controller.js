const {
  Housing,
  Location,
  Facilities,
  Services,
  UserMod,
  Reservations,
  Reviews,
} = require("../db");
const { buscar } = require("../libs/buscar");
const  filter  = require("../libs/Filter")

const getHouses = async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  const ubicacion = req.query.location? {name:req.query.location} : null
  filter(req)
  try {

    const Offset = size * (page - 1);

    const count = await Housing.findAndCountAll({where: filter(req),include: [
      {
        model: Location,
        where: ubicacion,
        required:true
      }]});

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
          required:true
        },
        { model: Facilities },
        { model: Services },
        { model: UserMod, attributes: ["id", "email"] },
        { model: Reviews, attributes: ["stars"] },
        { model: Reservations },
        
      ],
    });

     var c=0;
    
     if(req.query.stars&&HousePage.rows.length){
       HousePage.rows = HousePage.rows.filter(e=>{if(e.average<= req.query.stars) return true; c++})
     }
    HousePage.count = count.count-c; // Esto es xq el count All me cuenta tambien las relaciones de servicxes y facilities y no se como cambiarlo sin traer menos
    
    res.json(HousePage);
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
        {
          model: Reservations,
          attributes: ["date_start", "date_end", "userClientId"],
        },
        { model: Reviews },
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

    let servicesDB = await Services.findAll({
      where: { name: services },
    });
    let facilitiesDB = await Facilities.findAll({
      where: { name: facilities },
    });

    await house.addServices(servicesDB);
    await house.addFacilities(facilitiesDB);
    await house.setLocation(location);
    await house.setUserMod(req.userId);

    res.status(201).json(house);
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
    } = req.body;
    const housecheck = await Housing.findByPk(id);
    console.log(housecheck);
    if (housecheck.userModId === req.userId) {
      console.log("Es el mismo usuario, (no se aplico esta proiedad)");
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
      },
      {
        where: {
          id: id,
        },
      }
    );
    const resp = await Housing.findAll({ where: { id: id } });

    res.status(200).send(resp);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteHouse = async (req, res, next) => {
  const { id } = req.body;
  try {
    const house = await Housing.destroy({
      where: {
        id,
      },
    });
    res.json({ message: "La casa se ha eliminado correctamente" });
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
          id
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
