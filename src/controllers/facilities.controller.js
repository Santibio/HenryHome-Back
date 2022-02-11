const { Facilities } = require("../db");
const { facilitiesArray } = require("../config_db/facilities.array");

const createFacilitie = async (req, res, next) => {
  const { name } = req.body;
  try {
    if (name) {
      const [facility, result] = await Facilities.findOrCreate({
        where: { name: name.toLowerCase() },
      });
      return res
      .status(201)
      .json(
        result
          ? { msg: "Correctly created facility",  facility }
          : { msg: "There is already a facility with that name", facility })
    } else {
      res.status(400).json({ mesagge: "Data needed." });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getFacilities = async (req, res) => {
  try {
    facilitiesArray.forEach(async (f) => {
      await Facilities.findOrCreate({
        where: {
          name: f.toLowerCase(),
        },
      });
    });
    const facilities = await Facilities.findAll();
    res.json(facilities);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createFacilitie,
  getFacilities,
};
