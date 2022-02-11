
const {
  Housing,
  Location,
  Facilities,
  Services,
  UserMod,
  Reservations,
  Reviews
} = require("../db");
const { buscar } = require("../libs/buscar")

const getHouses = async (req, res, next) => {
  const { page=1, size=10 }=req.query
  try {
    const Offset = size*(page-1)
    const count = await Housing.findAndCountAll()
    const HousePage = await Housing.findAndCountAll({
      limit:size,
      offset:Offset,
      attributes: { exclude: ['createdAt',"updatedAt","LocationId","description","houseRules"] },
      include: [
        { model: Location },
        { model: Facilities },
        { model: Services },
        { model: UserMod, attributes: ["id", "email"] },
        { model: Reviews,attributes: ["stars"] },
        { model: Reservations },
      ],
    })
    HousePage.count=count.count // Esto es xq el count All me cuenta tambien las relaciones de servicxes y facilities y no se como cambiarlo sin traer menos
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
          model:
            Reservations ,attributes: ["date_start", "date_end","userClientId"] ,
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
  const {
    id,
  } = req.body;
  try {
    const prev = await Housing.findByPk(id) 
    const {
      name = prev.name,
      pricePerNight = prev.pricePerNight,
      numberOfPeople = prev.numberOfPeople,
      description = prev.description,
      houseRules = prev.houseRules,
      images = prev.images,
    } = req.body;
    const housecheck = await Housing.findOne({ where: { id: id } });
    console.log(housecheck);
    if (housecheck.userModId === req.userId) {
      console.log("Es el mismo usuario, (no se aplico esta proiedad)");
    }
    await Housing.update(
      {
        name,
        pricePerNight,
        numberOfPeople,
        description,
        houseRules,
        images,
      },
      {
        where: {
          id: id,
        },
      },
      
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
    res.json({ msg: "Successfully deleted" });
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
          id: id,
        },
      }
    );
   
     result >= 1
       ? res.status(201).json({ msg: "Successfully changed" })
       : res.json({ msg: "House not changed" });
    

  } catch (error) {
    console.log(error, "errorr");
    next(error);
  }
};
const filterHouses = async (req, res, next)=>{
  const { pricePerNight, numberOfPeople, facilit,serv,loc } =req.body
  
  try{
    var filtro = await Housing.findAll({
      include: [
        { model: Location, attributes:["name"] },
        { model: Facilities,attributes:["name"] },
        { model: Services,attributes:["name"] },
        { model: UserMod, attributes: ["id", "email"] },
        
      ],
    });
    if(pricePerNight){
      filtro = filtro.filter(e=>e.pricePerNight===pricePerNight)}
    if(numberOfPeople){
      filtro = filtro.filter(e=>e.numberOfPeople===numberOfPeople)}
    if(loc){
      filtro = filtro.filter(e=>e.dataValues.Location.dataValues.name.toLowerCase()===loc.toLowerCase())}
    if(facilit){
    
      filtro= filtro.filter(e=>buscar(e.dataValues.Facilities,facilit))}
    if(serv){
        filtro= filtro.filter(e=>buscar(e.dataValues.Services,serv))}  

res.json(filtro)
  
  }catch(error){
    console.log(error,"Error")
    next(error)
  }
} 
module.exports = {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  AdminChangeHousing,
  filterHouses,
};
