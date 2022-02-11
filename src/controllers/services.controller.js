const { Services } = require("../db");
const { servicesArray } = require("../config_db/services.array.js");

const createService = async (req, res) => {
  const { name } = req.body;
  try {
    if (name) {
      const [service,result] = await Services.findOrCreate({
        where: { name: name.toLowerCase() },
      });
      return res
        .status(201)
        .json(
          result
            ? { msg: "Correctly created service", service }
            : { msg: "There is already a service with that name", service }
        );
    } else {
      res.status(400).json({ msg: "Data needed" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getServices = async (req, res) => {
  try {
    servicesArray.forEach(async (e) => {
      await Services.findOrCreate({
        where: {
          name: e.toLowerCase(),
        },
      });
    });

    const services = await Services.findAll();
    res.json(services);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { createService, getServices };
